import React from 'react';

const GuideSection = () => {
  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-bold mb-4">Guía rápida de SPARQL</h2>

      <p className="mb-4 text-sm">
        SPARQL es el lenguaje para consultar datos RDF (triples). Cada triple tiene sujeto, predicado y objeto. Aquí tienes ejemplos reales basados en el RDF de la BD Ovidiana.
      </p>

      {/* Ejemplo 1: Ilustraciones y Ediciones */}
      <h3 className="text-lg font-semibold mt-6 mb-2">1. Ilustraciones y su edición asociada</h3>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`SELECT ?ilustracion ?edicion WHERE {
  ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
}`}
      </pre>
      <ul className="text-sm list-disc ml-5 mb-4">
        <li>Se recuperan ilustraciones con su edición correspondiente.</li>
        <li>Usa una propiedad real: <code>hasEdicionfk</code>.</li>
      </ul>

      {/* Ejemplo 2: Temas vinculados a ilustraciones */}
      <h3 className="text-lg font-semibold mt-6 mb-2">2. Temas representados en ilustraciones</h3>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`SELECT ?tema ?ilustracion WHERE {
  ?relacion <http://bdovidiana.es/ontology/refToTema> ?tema .
  ?relacion <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
}`}
      </pre>
      <ul className="text-sm list-disc ml-5 mb-4">
        <li>Consulta relaciones intermedias que conectan temas e ilustraciones.</li>
        <li>Refleja cómo están modeladas en tu RDF.</li>
      </ul>

      {/* Ejemplo 3: Consulta compleja con propiedades múltiples */}
      <h3 className="text-lg font-semibold mt-6 mb-2">3. Consulta compleja: contenidos, ilustraciones, ediciones</h3>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`SELECT ?contenido ?ilustracion ?edicion WHERE {
  ?contenido <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
  ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
}`}
      </pre>
      <ul className="text-sm list-disc ml-5 mb-4">
        <li>Encadena relaciones entre contenidos, ilustraciones y ediciones.</li>
        <li>Útil para analizar ilustraciones derivadas de un contenido concreto.</li>
      </ul>
      <p className="text-sm mt-6">
        Más información en la especificación oficial de SPARQL:&nbsp;
        <a
          href="https://www.w3.org/TR/rdf-sparql-query/"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.w3.org/TR/rdf-sparql-query/
        </a>
      </p>
    </div>
  );
};

export default GuideSection;
