const jwt = require("jsonwebtoken");
const { handleCatchError, ERROR_CODES } = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new Error("Authorization required");
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error("Authorization required");
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
