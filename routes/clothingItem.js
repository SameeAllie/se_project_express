const { createItem, updateItem, getItems, deleteItem, dislikeItem, likeItem } = require("../controllers/clothingItem");
const router = require("express").Router();

router.post("/", createItem);
router.get("/", getItems);
router.put("/items/:itemId/likes", likeItem);
router.put("/:itemId", updateItem);
router.delete("/items/:itemId", deleteItem);
router.delete("/items/:itemId/likes", dislikeItem);

module.exports = router;