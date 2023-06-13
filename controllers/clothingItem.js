const { restart } = require("nodemon");
const ClothingItem = require("../../se_project_express/models/clothingItem");
const { ERROR_400, ERROR_404, ERROR_500 } = require("../../se_project_express/utils/errors");

function handleItemError(res, err) {
  if (err.name === "ValidationError" || err.name === "AssertionError") {
    return res.status(ERROR_400).send({
      message:
      "The methods for creating an item received invalid data, or an invalid ID was passed to the params.",
    });
  }
  if (err.name === "CastError") {
    return res.status(ERROR_400).send({
      message:
      "The requested clothing ID does not exist, or the request was sent to an invalid address.",
    });
  }
  return res.status(ERROR_500).send({
    message: "An error has occurred on the server.",
    err,
  });
}

function handleFindByIdItemError(req, res, err) {
  if (
    err.name === "CastError" ||
    err.name === "ValidationError" ||
    err.name === "AssertionError"
  ) {
    return res.status(ERROR_400).send({
      message:
      "The methods for creating an item received invalid data, or an invalid ID was passed to the params.",
    });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(ERROR_404).send({
      message:
        "The requested clothing ID does not exist, or the request was sent to an invalid address.",
    });
  }
  return res
    .status(ERROR_500)
    .send({ message: "An error has occurred on the server", err });
}

const createItem = (req, res) => {
  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL, owner: req.user_.id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      handleRegularItemError(req, res, err);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      handleRegularItemError(req, res, err);
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findOneAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      handleItemError(req, res, err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() =>
      res
        .status(200)
        .send({ message: `The item has been successfully deleted.` })
    )
    .catch((err) => {
      handleFindByIdItemError(req, res, err);
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user_.id } },
    { new: true }
  )
    .orFail()
    .then(() =>
      res.status(200).send({ message: "Item has been successfully liked" })
    )
    .catch((err) => {
      handleFindByIdItemError(req, res, err);
    });
};

function dislikeItem(req, res) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      handleFindByIdItemError(req, res, err);
    });
}

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};