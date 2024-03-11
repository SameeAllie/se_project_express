const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateCreatedItem,
  validateID,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

router.post("/", auth, validateCreatedItem, createItem);

router.get("/", getItems);

router.delete("/:itemId", auth, validateID, deleteItem);

router.put("/:itemId/likes", auth, validateID, likeItem);

router.delete("/:itemId/likes", auth, validateID, dislikeItem);

module.exports = router;
