import sys
import os
import unittest
import tempfile
import json

# Añadir la carpeta "scripts" al path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts')))

from generate_r2rml import semantic_predicate, triples_map_name, load_foreign_keys, generate_r2rml, ONTOLOGY_PREDICATES


class TestR2RMLGenerator(unittest.TestCase):

    def setUp(self):
        # Establece un valor predeterminado para ONTOLOGY_PREDICATES si es necesario
        ONTOLOGY_PREDICATES.clear()
        ONTOLOGY_PREDICATES.update({
            "nombre": "http://bdovidiana.es/ontology/hasNombre"
        })

    def test_semantic_predicate_found(self):
        self.assertEqual(
            semantic_predicate("nombre"),
            "http://bdovidiana.es/ontology/hasNombre"
        )

    def test_semantic_predicate_default(self):
        self.assertEqual(
            semantic_predicate("edad"),
            "http://bdovidiana.es/ontology/hasEdad"
        )

    def test_triples_map_name(self):
        self.assertEqual(
            triples_map_name("obra"),
            "<#ObraTriplesMap>"
        )

    def test_load_foreign_keys(self):
        with tempfile.NamedTemporaryFile("w+", delete=False) as tmp:
            json.dump({"obra|impresor": "http://bdovidiana.es/ontology/impresoPor"}, tmp)
            tmp_path = tmp.name

        result = load_foreign_keys(tmp_path)
        os.remove(tmp_path)
        self.assertIn(("obra", "impresor"), result)
        self.assertEqual(result[("obra", "impresor")], "http://bdovidiana.es/ontology/impresoPor")

    def test_generate_r2rml_file(self):
        fake_schema = {
            "obra": {
                "primary_keys": ["id"],
                "columns": ["id", "titulo"],
                "foreign_keys": []
            }
        }

        with tempfile.NamedTemporaryFile("w+", delete=False, suffix=".json") as schema_file:
            json.dump(fake_schema, schema_file)
            schema_path = schema_file.name

        output_path = schema_path.replace(".json", ".ttl")

        generate_r2rml(schema_path, output_path)

        with open(output_path, "r", encoding="utf-8") as f:
            content = f.read()

        os.remove(schema_path)
        os.remove(output_path)

        self.assertIn("@prefix rr:", content)
        self.assertIn("rr:subjectMap", content)
        self.assertIn("obra", content)

if __name__ == "__main__":
    unittest.main()
