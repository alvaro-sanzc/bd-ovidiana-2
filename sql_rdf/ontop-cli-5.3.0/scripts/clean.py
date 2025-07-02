import re

def limpiar_tripmaps_duplicados(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        ttl_content = f.read()

    bloques = re.findall(r'(<#.+?TriplesMap>.*?\n\.)', ttl_content, re.DOTALL)

    vistos = set()
    limpios = []

    for bloque in bloques:
        match = re.match(r'<#(.+?)TriplesMap>', bloque)
        if match:
            nombre = match.group(1)
            if nombre not in vistos:
                vistos.add(nombre)
                limpios.append(bloque)
            else:
                print(f"Eliminado duplicado: <#{nombre}TriplesMap>")

    header = ""
    resto = ttl_content
    if bloques:
        primer_inicio = ttl_content.find(bloques[0])
        header = ttl_content[:primer_inicio]

    contenido_final = header + "\n\n".join(limpios)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(contenido_final)

limpiar_tripmaps_duplicados(
    './sql_rdf/ontop-cli-5.3.0/archivos_generados/r2rml-mapping-semantic.ttl',
    './sql_rdf/ontop-cli-5.3.0/archivos_generados/r2rml-mapping-semantic-clean.ttl'
)
