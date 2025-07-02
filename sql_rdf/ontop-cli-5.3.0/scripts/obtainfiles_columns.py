import re

def extraer_tablas_y_columnas(sql_file):
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()

    tablas = re.findall(r'CREATE TABLE\s+`?(\w+)`?\s*\((.*?)\)\s*ENGINE=', content, re.DOTALL | re.IGNORECASE)
    
    esquema = {}
    for nombre_tabla, cuerpo in tablas:
        columnas = []
        lineas = cuerpo.splitlines()
        for linea in lineas:
            linea = linea.strip().rstrip(',')
            if linea.upper().startswith(('PRIMARY', 'FOREIGN', 'UNIQUE', 'KEY', 'CONSTRAINT')):
                continue
            match = re.match(r'`(\w+)`\s+([^\s,]+)', linea)
            if match:
                nombre_columna = match.group(1)
                tipo_columna = match.group(2)
                columnas.append((nombre_columna, tipo_columna))
        esquema[nombre_tabla] = columnas
    return esquema

if __name__ == '__main__':
    archivo_sql = './data.sql'
    resultado = extraer_tablas_y_columnas(archivo_sql)
    
    for tabla, columnas in resultado.items():
        print(f"\n📘 Clase: {tabla}")
        for col, tipo in columnas:
            print(f"   - {col} : {tipo}")
