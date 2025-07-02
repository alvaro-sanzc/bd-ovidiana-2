const { executeQuery } = require('./graphdbClient');

async function handleQuery(req, res) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Falta la consulta SPARQL' });
  }

  try {
    const result = await executeQuery(query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error al ejecutar la consulta SPARQL' });
  }
}

module.exports = { handleQuery };
