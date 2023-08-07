const ClothingItem = require("../models/clothingItem");
const {
  ERROR_CODES,
  handleCatchError,
  handleFailError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      handleCatchError(req, res, err);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      handleCatchError(req, res, err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const error = new Error("Item ID was not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        res.status(ERROR_CODES.Forbidden).send({
          message: "You do not have the authorization to delete this item",
        });
      } else {
        res
          .status(200)
          .send({ message: `The item has been successfully deleted.` });
      }
      return null; // Return a value to satisfy consistent-return rule
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(ERROR_CODES.NotFound).send({ message: "Item not found" });
      } else if (err.name === "CastError") {
        res
          .status(ERROR_CODES.BadRequest)
          .send({ message: "Bad Request and/or invalid input" });
      } else {
        res
          .status(ERROR_CODES.DefaultError)
          .send({ message: "Something went wrong" });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID was not found");
      error.statusCode = 404;
      throw error;
    })
    .then(() => {
      res.status(200).send({ message: "Item has been successfully liked" });
    })
    .catch((err) => {
      handleFailError(req, res, err);
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID was not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      handleFailError(req, res, err);
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findOneAndUpdate(
    { _id: itemId },
    { $set: { imageUrl } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID was not found");
      error.statusCode = 404;
      throw error;
    })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      handleCatchError(req, res, err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
  updateItem,
};
