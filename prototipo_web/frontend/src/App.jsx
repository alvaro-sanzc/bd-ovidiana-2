import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import DefaultQueries from './pages/DefaultQueries';
import SparqlEditor from './pages/SparqlEditor';
import GuiadaSPARQL from './pages/GuideSparQL';
import RDFGraphViewer from './pages/rdf_visualizator';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="py-10 px-4 bg-gray-100 min-h-screen">
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/consultas-predefinidas" element={<DefaultQueries />} />
            <Route path="/sparql" element={<SparqlEditor />} />
            <Route path="/guia-sparql" element={<GuiadaSPARQL />} />
            <Route path="/visualizador" element={<RDFGraphViewer  />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;

