export default async function handler(req, res) {
  const API_KEY = process.env.SNCF_API_KEY;

  try {
    // 🔥 reconstruction propre de l'URL
    const path = req.url.replace('/api/sncf', '');
    const url = `https://api.sncf.com/v1/coverage/sncf${path}`;

    const response = await fetch(url, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(API_KEY + ":").toString("base64"),
      },
    });

    const text = await response.text();

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/json"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
