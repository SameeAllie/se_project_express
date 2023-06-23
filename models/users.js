const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")

const user = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Field required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [30, "Name must not exceed 30 characters"],
    role: { type: String, default: "Elise Bouer" },
  },
  avatar: {
    type: String,
    // required: [true, "Field required"],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "You must enter a valid email",
    },
    role: {
      type: String,
      default:
        "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/wtwr-project/Elise.png",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

user.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((endUser) => {
      if (!endUser) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, endUser.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return endUser;
      });
    });
};

module.exports = mongoose.model("user", user);
