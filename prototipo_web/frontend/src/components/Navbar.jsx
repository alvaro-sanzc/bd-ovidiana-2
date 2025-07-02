import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-slate-800 text-white shadow">
      <nav className="container mx-auto flex flex-wrap items-center justify-between px-4 py-4">
        <div className="text-2xl font-semibold tracking-wide text-cyan-400">
          BD Ovidiana
        </div>
        <div className="flex gap-6 mt-2 sm:mt-0 text-lg font-medium">
          <Link to="/" className="hover:text-cyan-400 transition">Inicio</Link>
          <Link to="/consultas-predefinidas" className="hover:text-cyan-400 transition">Consultas Predefinidas</Link>
          <Link to="/sparql" className="hover:text-cyan-400 transition">Consultas SPARQL</Link>
          <Link to="/visualizador" className="hover:text-cyan-400 transition">Visualizador RDF</Link>
          <Link to="/guia-sparql" className="hover:text-cyan-400 transition">Formato SPARQL</Link>
        </div>
      </nav>
    </header>
  );
}
