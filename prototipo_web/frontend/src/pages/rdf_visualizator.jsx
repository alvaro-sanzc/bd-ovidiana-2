import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';

export default function Visualizator() {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    console.log('✅ Visualizator montado');

    const nodes = [
      { id: 1, label: 'Ilustración' },
      { id: 2, label: 'Edición' },
      { id: 3, label: 'Tema' },
      { id: 4, label: 'Contenido' },
      { id: 5, label: 'Ejemplar' }
    ];

    const edges = [
      { from: 1, to: 2, label: 'hasEdicionfk', arrows: 'to' },
      { from: 3, to: 1, label: 'refToIlustracion', arrows: 'to' },
      { from: 4, to: 2, label: 'refToEdicion', arrows: 'to' },
      { from: 5, to: 2, label: 'refToEdicion', arrows: 'to' }
    ];

    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: { size: 14 },
        color: { background: '#acf', border: '#555' }
      },
      edges: {
        arrows: 'to',
        font: { align: 'middle' },
        smooth: true
      },
      interaction: {
        hover: true,
        tooltipDelay: 200
      },
      physics: {
        stabilization: true
      }
    };

    networkRef.current = new Network(containerRef.current, data, options);

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Visualizador de RDF</h2>
      <div
        ref={containerRef}
        style={{ height: '600px', border: '1px solid #ccc', borderRadius: '8px' }}
      />
    </div>
  );
}
