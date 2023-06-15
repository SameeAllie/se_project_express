const { createItem, getItems, deleteItem, dislikeItem, likeItem } = require("../controllers/clothingItem");
const router = require("express").Router();

router.post("/", createItem);
router.get("/", getItems);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;