import json


with open("./sql_rdf/ontop-cli-5.3.0/archivos_generados/schema_metadata_enriched.json", encoding="utf-8") as f:
    schema = json.load(f)


foreign_key_predicates = {}


for table_name, info in schema.items():
    for fk in info.get("foreign_keys", []):
        key = (table_name, fk["references_table"])
        predicate_uri = f"http://bdovidiana.es/ontology/refTo{fk['references_table'].capitalize()}"
        foreign_key_predicates[key] = predicate_uri


with open("./sql_rdf/ontop-cli-5.3.0/archivos_generados/FOREIGN_KEY_PREDICATES.json", "w", encoding="utf-8") as f:
    json.dump(
        {f"{k[0]}->{k[1]}": v for k, v in foreign_key_predicates.items()},
        f, indent=2, ensure_ascii=False
    )

print("FOREIGN_KEY_PREDICATES.json generado correctamente.")
