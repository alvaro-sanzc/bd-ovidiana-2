import subprocess
import os

# Archivos a eliminar en caso de que se hayan creado
archivos = [
    ".\\sql_rdf\\ontop-cli-5.3.0\\archivos_generados\\TABLE_TO_CLASS.json",
    ".\\sql_rdf\\ontop-cli-5.3.0\\archivos_generados\\ONTOLOGY_PREDICATES.json",
    ".\\sql_rdf\\ontop-cli-5.3.0\\archivos_generados\\FOREIGN_KEY_PREDICATES.json",
    ".\\sql_rdf\\ontop-cli-5.3.0\\archivos_generados\\r2rml-mapping-semantic.ttl",
    ".\\sql_rdf\\ontop-cli-5.3.0\\archivos_generados\\r2rml-mapping-semantic-clean.ttl",
    ".\\sql_rdf\\ontop-cli-5.3.0\\archivos_generados\\schema_metadata_enriched.json",
    ".\\prototipo_web\\rdf\\data_rdf.rdf"
]

# Eliminar archivos si existen
for archivo in archivos:
    if os.path.exists(archivo):
        try:
            os.remove(archivo)
            print(f"Eliminado: {archivo}")
        except Exception as e:
            print(f"[ERROR] No se pudo eliminar {archivo}: {e}")
    else:
        print(f"No existe (omitido): {archivo}")

# Comandos a ejecutar
comandos = [
    ['py', '.\\sql_rdf\\ontop-cli-5.3.0\\scripts\\extract_schema_json.py'],
    ['py', '.\\sql_rdf\\ontop-cli-5.3.0\\scripts\\create_foreign_key_predicates.py'],
    ['py', '.\\sql_rdf\\ontop-cli-5.3.0\\scripts\\ontology.py'],
    ['py', '.\\sql_rdf\\ontop-cli-5.3.0\\scripts\\generate_r2rml.py'],
    ['py', '.\\sql_rdf\\ontop-cli-5.3.0\\scripts\\clean.py'],
    ['.\sql_rdf\ontop-cli-5.3.0\ontop.bat', 'materialize', '-m', './sql_rdf/ontop-cli-5.3.0/archivos_generados/r2rml-mapping-semantic-clean.ttl', '-p', './sql_rdf/ontop-cli-5.3.0/conexion.properties', '-o', './prototipo_web/rdf/data_rdf.rdf']
]

# Ejecutar comandos
for cmd in comandos:
    print(f"\nEjecutando: {' '.join(cmd)}")
    try:
        resultado = subprocess.run(cmd, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        #print(resultado.stdout)
    except subprocess.CalledProcessError as e:
        print(f"[ERROR] Falló el comando: {' '.join(cmd)}")
        print(e.stderr)
        break
