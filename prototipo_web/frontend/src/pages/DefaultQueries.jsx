import React, { useState } from 'react';
import axios from 'axios';

const consultas = [
  // Tripletas útiles
  {
    titulo: "Tripletas relacionadas con ilustraciones",
    baseQuery: `
      SELECT ?s ?p ?o
      WHERE {
        ?s ?p ?o .
        FILTER(STRSTARTS(STR(?s), "http://bdovidiana.es/ilustracion/"))
      }
    `
  },
  {
    titulo: "Tripletas relacionadas con temas de ilustración",
    baseQuery: `
      SELECT ?s ?p ?o
      WHERE {
        ?s ?p ?o .
        FILTER(STRSTARTS(STR(?s), "http://bdovidiana.es/TemaIlustracion/"))
      }
    `
  },

  // Básicas e intermedias
  {
    titulo: "Ilustraciones y sus ediciones",
    baseQuery: `
      SELECT ?ilustracion ?edicion
      WHERE {
        ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
      }
    `
  },
  {
    titulo: "Temas de ilustración y las ilustraciones relacionadas",
    baseQuery: `
      SELECT ?tema ?ilustracion
      WHERE {
        ?tema <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
      }
    `
  },
  {
    titulo: "Recursos de tipo Temailustracion",
    baseQuery: `
      SELECT ?tema
      WHERE {
        ?tema a <http://bdovidiana.es/ontology/Temailustracion> .
      }
    `
  },
  {
    titulo: "Contenidos y ediciones relacionadas",
    baseQuery: `
      SELECT ?contenido ?edicion
      WHERE {
        ?contenido <http://bdovidiana.es/ontology/refToEdicion> ?edicion .
      }
    `
  },

  // Consultas de 3 tripletas
  {
    titulo: "Temas ilustrados y sus ediciones",
    baseQuery: `
      SELECT ?tema ?ilustracion ?edicion
      WHERE {
        ?tema <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
        ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
        ?tema a <http://bdovidiana.es/ontology/Temailustracion> .
      }
    `
  },
  {
    titulo: "Ilustraciones, su edición y tipo de recurso",
    baseQuery: `
      SELECT ?ilustracion ?edicion ?tipo
      WHERE {
        ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
        ?ilustracion a ?tipo .
        FILTER(STRSTARTS(STR(?ilustracion), "http://bdovidiana.es/ilustracion/"))
      }
    `
  },
  {
    titulo: "Temas, ilustraciones y tipos de tema",
    baseQuery: `
      SELECT ?tema ?ilustracion ?tipoTema
      WHERE {
        ?tema <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
        ?tema a ?tipoTema .
        FILTER(STRSTARTS(STR(?tema), "http://bdovidiana.es/TemaIlustracion/"))
      }
    `
  },

  // Consultas complejas para usuario final
  {
    titulo: "Ediciones con más ilustraciones",
    baseQuery: `
      SELECT ?edicion (COUNT(?ilustracion) AS ?totalIlustraciones)
      WHERE {
        ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
      }
      GROUP BY ?edicion
      ORDER BY DESC(?totalIlustraciones)
    `
  },
  {
    titulo: "Temas más frecuentes ilustrados en cada edición",
    baseQuery: `
      SELECT ?edicion ?tema (COUNT(?ilustracion) AS ?vecesIlustrado)
      WHERE {
        ?tema <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
        ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
      }
      GROUP BY ?edicion ?tema
      ORDER BY ?edicion DESC(?vecesIlustrado)
    `
  },
  {
    titulo: "Relación entre número de contenidos textuales y número de ilustraciones por edición",
    baseQuery: `
      SELECT ?edicion (COUNT(DISTINCT ?contenido) AS ?totalContenidos) (COUNT(DISTINCT ?ilustracion) AS ?totalIlustraciones)
      WHERE {
        {
          ?contenido <http://bdovidiana.es/ontology/refToEdicion> ?edicion .
        }
        UNION
        {
          ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
        }
      }
      GROUP BY ?edicion
      ORDER BY DESC(?totalIlustraciones)
    `
  },
  {
    titulo: "Ilustraciones con mayor densidad temática",
    baseQuery: `
      SELECT ?ilustracion ?edicion (COUNT(?tema) AS ?totalTemas)
      WHERE {
        ?tema <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
        ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
      }
      GROUP BY ?ilustracion ?edicion
      ORDER BY DESC(?totalTemas)
    `
  },
  {
    titulo: "Ediciones con más diversidad temática",
    baseQuery: `
      SELECT ?edicion (COUNT(DISTINCT ?tema) AS ?numTemasUnicos)
      WHERE {
        ?tema <http://bdovidiana.es/ontology/refToIlustracion> ?ilustracion .
        ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
      }
      GROUP BY ?edicion
      ORDER BY DESC(?numTemasUnicos)
    `
  },
  {
    titulo: "Ediciones que no tienen ilustraciones",
    baseQuery: `
      SELECT DISTINCT ?edicion
      WHERE {
        ?edicion a <http://bdovidiana.es/ontology/Edicion> .
        FILTER NOT EXISTS {
          ?ilustracion <http://bdovidiana.es/ontology/hasEdicionfk> ?edicion .
        }
      }
    `
  }
];



const ConsultasPorDefecto = () => {
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [limite, setLimite] = useState(50);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const ejecutarConsulta = async (baseQuery) => {
    setResultados([]);
    setError('');
    setLoading(true);

    const queryFinal = mostrarTodos ? baseQuery : `${baseQuery} LIMIT ${limite}`;

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL, { query: queryFinal });
      const data = response.data;

      if (data && data.results && data.results.bindings) {
        const encabezados = data.head.vars;
        const filas = data.results.bindings.map((row) =>
          encabezados.reduce((acc, varName) => {
            acc[varName] = row[varName]?.value || '';
            return acc;
          }, {})
        );
        setResultados(filas);
      } else {
        setError('Respuesta inesperada del servidor.');
      }
    } catch (err) {
      console.error('Error al ejecutar SPARQL:', err);
      setError('Error al ejecutar la consulta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Consultas por defecto</h1>

      <div className="flex items-center space-x-4 mb-6">
        <label className="font-medium">Límite:</label>
        <input
          type="number"
          min="1"
          value={limite}
          disabled={mostrarTodos}
          onChange={(e) => setLimite(e.target.value)}
          className="border px-2 py-1 w-24"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={mostrarTodos}
            onChange={() => setMostrarTodos(!mostrarTodos)}
          />
          <span>Mostrar todos</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {consultas.map((c, index) => (
          <button
            key={index}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => ejecutarConsulta(c.baseQuery)}
          >
            {c.titulo}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-600">Cargando resultados...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {resultados.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full mt-4 border text-sm">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(resultados[0]).map((col, index) => (
                  <th key={index} className="px-4 py-2 text-left border">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultados.map((fila, i) => (
                <tr key={i} className="border-t">
                  {Object.values(fila).map((valor, j) => (
                    <td key={j} className="px-4 py-2 border">{valor}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultasPorDefecto;
