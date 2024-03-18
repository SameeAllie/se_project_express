const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization required");
    }

    const token = authorization.replace("Bearer ", "");
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedError("Authorization required");
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
