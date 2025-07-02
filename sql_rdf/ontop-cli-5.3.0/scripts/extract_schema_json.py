import re
import json
from collections import defaultdict

def enrich_semantic_relations(table, columns):
    implicit_relations = []
    for col in columns:
        if col.endswith("FK"):
            ref_table = col[:-2].lower()
            ref_column = ref_table.capitalize() + "PK"
            implicit_relations.append({
                "column": col,
                "references_table": ref_table,
                "references_column": ref_column,
                "inferred": True
            })
    return implicit_relations

def enrich_annotations(table_name, schema_entry):
    annotations = {}
    pk = schema_entry["primary_keys"]
    if len(pk) > 1:
        annotations["composite_pk"] = True
    if table_name.lower() in ["comunidad", "provincia", "ciudad"]:
        annotations["hierarchy_level"] = table_name.lower()
    return annotations

def extract_schema(sql_path, output_path):
    with open(sql_path, "r", encoding="utf-8") as f:
        sql = f.read()

    sql = re.sub(r'--.*', '', sql)
    sql = re.sub(r'/\*.*?\*/', '', sql, flags=re.DOTALL)

    schema = defaultdict(lambda: {
        "columns": [],
        "primary_keys": [],
        "foreign_keys": [],
        "annotations": {}
    })


    table_blocks = re.findall(
        r'CREATE TABLE\s+`?(\w+)`?\s*\((.*?)\)\s*(?:ENGINE|DEFAULT|CHARSET|COMMENT|;)',
        sql, re.DOTALL | re.IGNORECASE
    )

    for table_name, content in table_blocks:
        lines = [line.strip().rstrip(',') for line in content.splitlines() if line.strip()]
        for line in lines:
            # Columnas
            match_col = re.match(r'`(\w+)`\s+\w+', line)
            if match_col:
                col_name = match_col.group(1)
                if col_name not in schema[table_name]["columns"]:
                    schema[table_name]["columns"].append(col_name)

            # Clave primaria
            pk_match = re.match(r'PRIMARY KEY\s*\((.*?)\)', line, re.IGNORECASE)
            if pk_match:
                pk_fields_raw = pk_match.group(1)
                pk_fields = re.split(r'[`,\s]+', pk_fields_raw)
                pk_fields = [pk for pk in pk_fields if pk]
                for pk in pk_fields:
                    if pk not in schema[table_name]["primary_keys"]:
                        schema[table_name]["primary_keys"].append(pk)

            # Clave foránea
            fk_match = re.match(
                r'CONSTRAINT\s+`.*?`\s+FOREIGN KEY\s+\(`(\w+)`\)\s+REFERENCES\s+`(\w+)`\s+\(`(\w+)`\)',
                line, re.IGNORECASE
            )
            if fk_match:
                fk = {
                    "column": fk_match.group(1),
                    "references_table": fk_match.group(2),
                    "references_column": fk_match.group(3)
                }
                if fk not in schema[table_name]["foreign_keys"]:
                    schema[table_name]["foreign_keys"].append(fk)

    # 2. ALTER TABLE
    alter_blocks = re.findall(r'ALTER TABLE\s+`(\w+)`\s+(.*?);', sql, re.DOTALL | re.IGNORECASE)
    for table_name, block in alter_blocks:
        if table_name not in schema:
            schema[table_name] = {
                "columns": [],
                "primary_keys": [],
                "foreign_keys": [],
                "annotations": {}
            }

        lines = [line.strip().rstrip(',') for line in block.splitlines() if line.strip()]
        for line in lines:
            pk_match = re.match(r'ADD PRIMARY KEY\s*\((.*?)\)', line, re.IGNORECASE)
            if pk_match:
                pk_fields_raw = pk_match.group(1)
                pk_fields = re.split(r'[`,\s]+', pk_fields_raw)
                pk_fields = [pk for pk in pk_fields if pk]
                for pk in pk_fields:
                    if pk not in schema[table_name]["primary_keys"]:
                        schema[table_name]["primary_keys"].append(pk)

            fk_match = re.match(
                r'ADD CONSTRAINT\s+`.*?`\s+FOREIGN KEY\s+\(`(\w+)`\)\s+REFERENCES\s+`(\w+)`\s+\(`(\w+)`\)',
                line, re.IGNORECASE
            )
            if fk_match:
                fk = {
                    "column": fk_match.group(1),
                    "references_table": fk_match.group(2),
                    "references_column": fk_match.group(3)
                }
                if fk not in schema[table_name]["foreign_keys"]:
                    schema[table_name]["foreign_keys"].append(fk)

    # 3. Enriquecimiento semántico
    for table_name in schema:
        inferred_fks = enrich_semantic_relations(table_name, schema[table_name]["columns"])
        for fk in inferred_fks:
            if not any(fk["column"] == f["column"] for f in schema[table_name]["foreign_keys"]):
                schema[table_name]["foreign_keys"].append(fk)
        schema[table_name]["annotations"] = enrich_annotations(table_name, schema[table_name])

    # 4. Exportar JSON
    with open(output_path, "w", encoding="utf-8") as out:
        json.dump(schema, out, indent=2, ensure_ascii=False)

# Uso
extract_schema("./data.sql", "./sql_rdf/ontop-cli-5.3.0/archivos_generados/schema_metadata_enriched.json")
