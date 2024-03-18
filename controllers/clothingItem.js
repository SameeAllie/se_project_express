const ClothingItem = require("../models/clothingItem");
const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => next(err));
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (String(item.owner) !== req.user._id) {
        throw new ForbiddenError(
          "You do not have permission to delete this item",
        );
      }
      item.deleteOne().then(() => {
        res
          .status(200)
          .send({ message: `The item has been successfully deleted.` });
      });
    })
    .catch((err) => next(err));
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((updatedItem) => {
      if (!updatedItem) {
        throw new NotFoundError("Item not found");
      }
      res.status(200).json(updatedItem);
    })
    .catch((err) => next(err));
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      res.status(200).send({ data: item });
    })
    .catch((err) => next(err));
};

// const updateItem = (req, res, next) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findOneAndUpdate(
//     { _id: itemId },
//     { $set: { imageUrl } },
//     { new: true },
//   )
//     .then((item) => {
//       if (!item) {
//         throw new NotFoundError("Item not found");
//       }
//       res.status(200).send({ data: item });
//     })
//     .catch((err) => next(err));
// };

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
  // updateItem,
};
