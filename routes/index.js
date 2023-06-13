const router = require("express").Router();
const clothingItem = require("./clothingItem");
const User = require("./users");

router.use("/items", clothingItem);
router.use("/user", User);

router.use((req, res) => {
  res.status(400).send({
    message:
      "There is NO API with the requested path, or the request was sent to a non-existent address",
  });
});

module.exports = router;