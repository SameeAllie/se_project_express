const router = require("express").Router();
const clothingItem = require("./clothingItem");
const User = require("./users");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../utils/errors/NotFoundError");
const { validateAuthentication } = require("../middlewares/validation");

router.post("/signup", validateAuthentication, createUser);
router.post("/signin", validateAuthentication, login);
router.use("/items", clothingItem);
router.use("/users", User);

router.use((req, res, next) => {
  next(new NotFoundError("Request resource was not found"));
});

module.exports = router;
