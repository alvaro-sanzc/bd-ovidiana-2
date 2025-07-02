from rdflib import Graph, RDF, RDFS, OWL
import re
import json

# Ruta al archivo TTL
TTL_PATH = "./ovidius_pictus.ttl"  # Cambiar si está en otra ubicación

# Cargar la ontología
g = Graph()
g.parse(TTL_PATH, format="turtle")

# Función auxiliar: extraer el nombre local de una URI
def local_name(uri):
    return re.split(r'[\/#]', str(uri))[-1]

# === 1. Clases OWL → TABLE_TO_CLASS
classes = set(g.subjects(RDF.type, OWL.Class))
TABLE_TO_CLASS = {}
for c in classes:
    lname = local_name(c).lower()
    TABLE_TO_CLASS[lname] = str(c)

# === 2. Propiedades de datos → ONTOLOGY_PREDICATES
datatype_properties = set(g.subjects(RDF.type, OWL.DatatypeProperty))
ONTOLOGY_PREDICATES = {}
for prop in datatype_properties:
    lname = local_name(prop).lower()
    ONTOLOGY_PREDICATES[lname] = str(prop)

# === Guardar JSONs
output_dir = "./sql_rdf/ontop-cli-5.3.0/archivos_generados/"

with open(output_dir + "TABLE_TO_CLASS.json", "w", encoding="utf-8") as f:
    json.dump(TABLE_TO_CLASS, f, indent=2, ensure_ascii=False)

with open(output_dir + "ONTOLOGY_PREDICATES.json", "w", encoding="utf-8") as f:
    json.dump(ONTOLOGY_PREDICATES, f, indent=2, ensure_ascii=False)