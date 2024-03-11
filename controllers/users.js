const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError("User not found");
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password) {
    return next(new BadRequestError("Password is required"));
  }

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userData = user.toObject();
        delete userData.password;
        return res.status(201).send({ data: userData });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError("Duplicate email"));
        } else if (err.name === "ValidationError") {
          return next(new BadRequestError("Invalid data"));
        } else {
          return next(err);
        }
      });
  });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFoundError("User not found"));
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      } else {
        return next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new UnauthorizedError("Email and password are required"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
