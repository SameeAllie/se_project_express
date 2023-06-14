const { createItem, getItems} = require("../controllers/clothingItem");
const router = require("express").Router();

router.post("/", createItem);
router.get("/", getItems);

module.exports = router;