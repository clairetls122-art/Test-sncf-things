module.exports = async function handler(req, res) {
  const apiKey = process.env.SNCF_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'Missing SNCF_API_KEY' });
    return;
  }

  const target = req.query.url;
  if (!target) {
    res.status(400).json({ error: 'Missing url query parameter' });
    return;
  }

  try {
    const response = await fetch(target, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
      },
    });

    const body = await response.text();

    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
};
