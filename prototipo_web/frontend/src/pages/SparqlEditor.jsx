import { useState } from 'react';
import GuideSection from '../components/Guide';

export default function SparqlEditor() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleQuery = async () => {
    setError(null);
    setResults(null);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Error en la ejecución del servidor');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Error al ejecutar la consulta: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Editor SPARQL</h2>

      <textarea
        placeholder="Escribe tu consulta SPARQL aquí..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={10}
        className="w-full p-4 border border-gray-300 rounded font-mono bg-white text-gray-900"
      />

      <button
        onClick={handleQuery}
        className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Ejecutar
      </button>

      {error && (
        <div className="mt-4 text-red-600 font-semibold">
          {error}
        </div>
      )}

      {results && results.results && results.results.bindings && (
        <div className="mt-8 overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Resultados:</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                {results.head.vars.map((varName) => (
                  <th key={varName} className="p-2 border-b border-gray-300">{varName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.results.bindings.map((row, idx) => (
                <tr key={idx} className="border-t border-gray-200">
                  {results.head.vars.map((varName) => (
                    <td key={varName} className="p-2 border-b border-gray-200">
                      {row[varName]?.value || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <GuideSection />
    </div>
  );
}
