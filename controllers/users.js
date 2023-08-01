const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const {
  handleFailError,
  handleCatchError,
  ERROR_CODES,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          const userData = user.toObject();
          delete userData.password;
          return res.status(201).send({ data: userData });
        })
        .catch((err) => {
          handleCatchError(res, err);
        });
    })
    .catch((err) => {
      handleCatchError(res, err);
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      handleFailError();
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      handleCatchError(err, res);
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      handleFailError();
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      handleCatchError(err, res);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(ERROR_CODES.Unauthorized)
      .send({ message: "You are not authorized to do this" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.name);
      handleError(err, res);
    });
};

module.exports = {
  getCurrentUser,
  // getUsers,
  createUser,
  login,
  updateUser,
};
