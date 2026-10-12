const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const actualToken = token.startsWith("Bearer ")
      ? token.slice(7, token.length)
      : token;
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
