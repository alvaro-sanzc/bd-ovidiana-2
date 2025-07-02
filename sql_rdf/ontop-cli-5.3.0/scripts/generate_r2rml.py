import json


TABLE_TO_CLASS = {}
ONTOLOGY_PREDICATES = {}
FOREIGN_KEY_PREDICATES = {}

def load_foreign_keys(path):
    with open(path, "r", encoding="utf-8") as f:
        raw = json.load(f)
    return {tuple(k.split("|")): v for k, v in raw.items()}

def initialize_globals():
    global TABLE_TO_CLASS, ONTOLOGY_PREDICATES, FOREIGN_KEY_PREDICATES

    with open("./sql_rdf/ontop-cli-5.3.0/archivos_generados/TABLE_TO_CLASS.json", "r", encoding="utf-8") as f:
        TABLE_TO_CLASS = json.load(f)

    with open("./sql_rdf/ontop-cli-5.3.0/archivos_generados/ONTOLOGY_PREDICATES.json", "r", encoding="utf-8") as f:
        ONTOLOGY_PREDICATES = json.load(f)

    FOREIGN_KEY_PREDICATES = load_foreign_keys(
        "./sql_rdf/ontop-cli-5.3.0/archivos_generados/FOREIGN_KEY_PREDICATES.json"
    )


def semantic_predicate(column_name):
    return ONTOLOGY_PREDICATES.get(
        column_name.lower(),
        f"http://bdovidiana.es/ontology/has{column_name.capitalize()}"
    )

def triples_map_name(table):
    return f"<#{table.capitalize()}TriplesMap>"

# === Generador R2RML ===
def generate_r2rml(json_path, output_ttl):
    with open(json_path, 'r', encoding='utf-8') as f:
        schema = json.load(f)

    prefixes = """
@prefix rr: <http://www.w3.org/ns/r2rml#> .
@prefix ex: <http://bdovidiana.es/> .
@prefix bdo: <http://bdovidiana.es/ontology/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dbpedia: <http://dbpedia.org/ontology/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

"""

    triples_maps = []

    for table_name, info in schema.items():
        pk = info['primary_keys']
        subject_template = (
            f"http://bdovidiana.es/{table_name}/{'-'.join(['{' + k + '}' for k in pk])}"
            if pk else f"_:blank_{table_name}"
        )
        tm_uri = triples_map_name(table_name)
        class_uri = TABLE_TO_CLASS.get(
            table_name.lower(),
            f"http://bdovidiana.es/ontology/{table_name.capitalize()}"
        )

        triples = f"{tm_uri}\n"
        triples += f"  rr:logicalTable [ rr:tableName \"{table_name}\" ; rr:sqlVersion \"SQL2008\" ];\n"
        triples += f"  rr:subjectMap [ rr:template \"{subject_template}\" ; rr:class <{class_uri}> ] ;\n"

        for column in info["columns"]:
            predicate = semantic_predicate(column)
            triples += "  rr:predicateObjectMap [\n"
            triples += f"    rr:predicate <{predicate}> ;\n"
            triples += f"    rr:objectMap [ rr:column \"{column}\" ] ;\n"
            triples += "  ] ;\n"

        for fk in info.get("foreign_keys", []):
            key = (table_name.lower(), fk["references_table"].lower())
            predicate = FOREIGN_KEY_PREDICATES.get(
                key,
                f"http://bdovidiana.es/ontology/refTo{fk['references_table'].capitalize()}"
            )
            ref_tm = triples_map_name(fk["references_table"])

            triples += "  rr:predicateObjectMap [\n"
            triples += f"    rr:predicate <{predicate}> ;\n"
            triples += "    rr:objectMap [\n"
            triples += f"      rr:parentTriplesMap {ref_tm} ;\n"
            triples += f"      rr:joinCondition [ rr:child \"{fk['column']}\" ; rr:parent \"{fk['references_column']}\" ]\n"
            triples += "    ] ;\n"
            triples += "  ] ;\n"

        triples += ".\n"
        triples_maps.append(triples)

    with open(output_ttl, "w", encoding="utf-8") as out:
        out.write(prefixes)
        out.write("\n".join(triples_maps))

# === Ejecución directa ===
if __name__ == "__main__":
    initialize_globals()
    generate_r2rml(
        "./sql_rdf/ontop-cli-5.3.0/archivos_generados/schema_metadata_enriched.json",
        "./sql_rdf/ontop-cli-5.3.0/archivos_generados/r2rml-mapping-semantic.ttl"
    )
