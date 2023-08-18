const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const { ERROR_CODES } = require("../utils/errors");
const clothingItem = require("./clothingItem");
const User = require("./users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItem);
router.use("/users", User);

router.use((req, res) => {
  res.status(ERROR_CODES.NotFound).send({
    message:
      "There is NO API with the requested path, or the request was sent to a non-existent address",
  });
});

module.exports = router;
