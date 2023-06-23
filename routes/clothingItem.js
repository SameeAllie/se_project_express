const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  dislikeItem,
  likeItem,
  updateItem,
} = require("../controllers/clothingItem");

router.post("/", auth, createItem);

router.get("/", getItems);

router.put("/:itemId/likes", auth, likeItem);
router.put("/:itemId", auth, updateItem)

router.delete("/:itemId", auth, deleteItem);
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
