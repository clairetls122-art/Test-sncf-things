export default async function handler(req, res) {
  const API_KEY = process.env.SNCF_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "Missing SNCF_API_KEY in Vercel environment variables",
    });
  }

  try {
    // 🔥 Récupère uniquement le chemin + query proprement
    const urlObj = new URL(req.url, `http://${req.headers.host}`);

    // enlève /api/sncf du chemin
    const path = urlObj.pathname.replace("/api/sncf", "");

    // reconstruit l’URL SNCF
    const targetUrl =
      "https://api.sncf.com/v1/coverage/sncf" +
      path +
      urlObj.search;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization:
          "Basic " + Buffer.from(API_KEY + ":").toString("base64"),
        Accept: "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "application/json";
    const data = await response.text();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

    // gestion OPTIONS (important pour Vercel / navigateur)
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
