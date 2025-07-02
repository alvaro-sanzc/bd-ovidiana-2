from rdflib import Graph, URIRef, Literal, Namespace
from rdflib.namespace import RDF


g = Graph()
g.parse("datos_enriquecidos.ttl", format="ttl")


ex = Namespace("http://example.org/")
g.bind("ex", ex)


relaciones = [
    (ex.ContenidoFK, ex.contenido),
    (ex.EjemplarFK, ex.ejemplar),
    (ex.ObraFK, ex.obra),
    (ex.BibliotecaFK, ex.biblioteca),
    (ex.TemaFK, ex.tema),
    (ex.IlustracionFK, ex.ilustracionejemplar)
]


nuevos_triples = []
triples_a_eliminar = []

for s, p, o in g:
    for predicado, base_uri in relaciones:
        if p == predicado and isinstance(o, Literal) and o.datatype is None:
            try:
                nuevo_obj = URIRef(f"{base_uri}/{int(o)}")
                nuevos_triples.append((s, p, nuevo_obj))
                triples_a_eliminar.append((s, p, o))
            except ValueError:
                continue

for t in triples_a_eliminar:
    g.remove(t)
for t in nuevos_triples:
    g.add(t)

g.serialize("datos_enriquecidos_URIs.ttl", format="turtle")
print("Archivo actualizado guardado como datos_enriquecidos_URIs.ttl")
