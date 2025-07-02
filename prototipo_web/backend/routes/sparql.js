const express = require('express');
const router = express.Router();
const axios = require('axios');

const SPARQL_ENDPOINT = process.env.SPARQL_ENDPOINT;

router.post('/', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios.post(
      SPARQL_ENDPOINT,
      `query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/sparql-results+json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error al ejecutar SPARQL:', error.message);
    res.status(500).json({ error: 'Error al ejecutar SPARQL' });
  }
});

module.exports = router;

