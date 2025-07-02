
# REPOSITORIO DEL TFG
## Descripción de componentes

- **diagrama/**: Contiene modelos visuales como diagramas UML, de flujo de datos, o de casos de uso que documentan la arquitectura y procesos del sistema.

- **projectLibre/**: Planificación del proyecto gestionada con ProjectLibre. Incluye cronogramas, tareas, recursos, y dependencias.

- **prototipo_web/**: Aplicación web que permite visualizar y consultar los datos RDF. El cliente está desarrollado en React y el servidor en Node.js con Express.

- **sql_rdf/**: Scripts que transforman la base de datos relacional (`data.sql`) en un modelo RDF conforme con los estándares del W3C. Utiliza mapeos y posiblemente herramientas como R2RML o scripts personalizados en Python.

- **comandos_scripts.py**: Script que automatiza tareas como carga de datos, ejecución de transformaciones, limpieza de archivos, etc.

- **data.sql**: Archivo que contiene los datos relacionales originales, listos para ser importados en un sistema de gestión de bases de datos relacional como PostgreSQL o MySQL.

- **ovidius_pictus.ttl**: Archivo RDF resultante en formato Turtle. Representa el conocimiento extraído y transformado desde el modelo relacional, incluyendo entidades, relaciones y anotaciones semánticas.

## Requisitos

- Node.js y npm (para el prototipo web)
- Python 3.x (para scripts de automatización)
- PostgreSQL o MySQL (para cargar `data.sql`)
- RDF toolkit o librerías como `rdflib` para procesamiento RDF
- Docker instalado
## Uso

1. Cargar scripts sql a RDF
   py .\comandos_scripts.py
2. Docker - IMPORTANTE:
   cd .\prototipo_web\
   docker compose up --build
   Accede a http://localhost:5173/