export default function Inicio() {
  return (
    <section className="bg-white shadow-lg rounded-2xl p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">
        Bienvenido a <span className="text-indigo-600">BD Ovidiana</span>
      </h1>
      <p className="text-xl text-slate-700">
        Explora las ilustraciones de la obra <strong>"<span className="text-slate-900">Ovidius Pictus</span>"</strong> mediante consultas <em>SPARQL</em> o consultas guiadas.
      </p>
    </section>
  );
}
