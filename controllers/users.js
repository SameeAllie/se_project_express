const { restart } = require("nodemon");
const User = require("../../se_project_express/models/users");
const { ERROR_400, ERROR_404, ERROR_500 } = require("../../se_project_express/utils/errors");

function handleCatchError(res, err) {
  if (err.name === "ValidationError" || err.name === "AssertionError") {
    return res.status(ERROR_400).send({
      message:
        "Invalid data passed to the methods for creating a user, or invalid ID passed to the params",
    });
  }
  if (err.name === "CastError") {
    return res.status(ERROR_400).send({
      message:
        "There is no user with the requested ID, or the request was sent to a non-existent address.",
    });
  }
  return res.status(ERROR_500).send({
    message: "An error has occurred on the server",
    err,
  });
}

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      handleCatchError(res, err);
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_404).send({
          message:
            "There is no user with the requested ID, or the request was sent to a non-existent address.",
        });
      }
      if (
        err.name === "ValidationError" ||
        err.name === "AssertionError" ||
        err.name === "CastError"
      ) {
        return res.status(ERROR_400).send({
          message:
            "Invalid data passed to the methods for creating a user, or invalid ID passed to the params",
        });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error has occurred on the server.", err });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      handleCatchError(res, err);
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
};