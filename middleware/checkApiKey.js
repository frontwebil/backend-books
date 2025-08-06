require("dotenv").config();

function checkApiKey(req, res, next) {
  const clientKey = req.headers["secret-api-key"];

  if (!clientKey || clientKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "⛔ Недійсний або відсутній API ключ" });
  }

  next();
}

module.exports = checkApiKey;