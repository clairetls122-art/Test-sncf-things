export default async function handler(req, res) {
  try {
    const apiKey = process.env.SNCF_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: "Missing SNCF_API_KEY environment variable" });
      return;
    }

    const incoming = new URL(req.url, "http://localhost");
    const path = incoming.pathname.replace(/^\/api\/sncf/, "");
    const target = `https://api.sncf.com/v1/coverage/sncf${path}${incoming.search}`;

    const response = await fetch(target, {
      method: req.method,
      headers: {
        Authorization: "Basic " + Buffer.from(apiKey + ":").toString("base64"),
        Accept: "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "application/json";
    const body = await response.text();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }

    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).json({ error: err.message || String(err) });
  }
}
