import React from 'react';

const Guide = () => {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Guía de la Base de Datos RDF – BD Ovidiana</h1>

      {/* 1. Visión general */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Visión general del grafo</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li><strong>Grafo usado:</strong> Se ha añadido el grafo al por defecto </li>
          <li><strong>Clases principales:</strong> 12</li>
          <li><strong>Propiedades distintas:</strong> 88</li>
          <li><strong>Total de triples:</strong> ~48,000</li>
          <li><strong>Tripletas complejas (tipo triplex):</strong> 9,392</li>
        </ul>
      </section>

      {/* 2. Entidades clave */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Entidades principales</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li><code>ex:Ejemplar</code>: representa un ejemplar físico o digital</li>
          <li><code>ex:Obra</code>: obra literaria a la que pertenece el ejemplar</li>
          <li><code>ex:Ilustracionejemplar</code>: ilustración asociada a un ejemplar</li>
          <li><code>ex:Biblioteca</code>: institución depositaria</li>
          <li><code>ex:ComentarioContenido</code>: anotaciones sobre el contenido</li>
          <li><code>dc:Noticia</code>: información relacionada a publicaciones</li>
        </ul>
      </section>

      {/* 3. Relaciones clave */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Relaciones importantes</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li><code>ex:ObraFK</code>: conecta un ejemplar con su obra</li>
          <li><code>bdovidiana:hasIllustration</code>: conecta ejemplar con su ilustración</li>
          <li><code>ex:BibliotecaFK</code>: conecta ejemplar con una biblioteca</li>
          <li><code>ex:Signatura</code>, <code>ex:Codigo</code>: propiedades descriptivas</li>
          <li><code>dc:title</code>, <code>dc:description</code>: metadatos generales</li>
        </ul>
      </section>

      {/* 4. Recomendaciones */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Recomendaciones para consultas SPARQL</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>No uses cláusulas <code>GRAPH &lt;...&gt;</code>, ya que los datos están en el grafo por defecto</li>
          <li>Utiliza prefijos: <code>ex:</code>, <code>bdovidiana:</code>, <code>dc:</code></li>
          <li>Comienza con entidades sencillas como <code>Ejemplar</code> o <code>Ilustración</code></li>
          <li>Utiliza <code>OPTIONAL</code> o <code>FILTER NOT EXISTS</code> para filtrar información parcial</li>
        </ul>
      </section>

      {/* 5. Ejemplos prácticos */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Ejemplos de consultas SPARQL</h2>

        <pre className="bg-gray-100 text-sm p-4 rounded overflow-x-auto mb-4">
{`# Ejemplares con ilustraciones y su archivo
SELECT ?edicion ?lugar ?nombreLugar WHERE {
  ?edicion <http://bdovidiana.es/ontology/refToLugarpublicacion> ?lugar .
  ?lugar <http://bdovidiana.es/ontology/hasLugar> ?nombreLugar .
}
LIMIT 20`}
        </pre>

        <pre className="bg-gray-100 text-sm p-4 rounded overflow-x-auto mb-4">
{`# Obras con título
SELECT DISTINCT ?titulo WHERE {
  ?obra <http://bdovidiana.es/ontology/hasTitulo> ?titulo .
} LIMIT 10
`}
        </pre>

        <pre className="bg-gray-100 text-sm p-4 rounded overflow-x-auto">
{`# Ilustraciones con su edición
SELECT ?contenido ?ilustracion ?edicion WHERE {
  ?contenido <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
  ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
}
LIMIT 10`}
        </pre>
      </section>
    </div>
  );
};

export default Guide;
