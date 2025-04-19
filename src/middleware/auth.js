const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const user = jwt.verify(token, secret);
    req.user = user;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

module.exports = authenticate;
