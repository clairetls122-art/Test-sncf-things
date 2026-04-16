export default async function handler(req, res) {
  const API_KEY = process.env.SNCF_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing SNCF_API_KEY" });
  }

  try {
    const incomingUrl = new URL(req.url, `http://${req.headers.host}`);

    // ⚡ NE GARDER QUE CE QUI EST APRÈS /api/sncf
    const path = req.url.split('/api/sncf')[1] || '';

    const targetUrl =
      `https://api.sncf.com/v1/coverage/sncf${path}${incomingUrl.search}`;

    console.log("➡️ SNCF URL:", targetUrl);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: "Basic " + Buffer.from(API_KEY + ":").toString("base64"),
        Accept: "application/json",
      },
    });

    const data = await response.text();

    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    return res.status(response.status).send(data);
  } catch (err) {
    return res.status(500).json({
      error: "Proxy error",
      details: err.message,
    });
  }
}
