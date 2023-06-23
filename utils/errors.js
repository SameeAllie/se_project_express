const ERROR_CODES = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  AlreadyExistsError: 409,
  DefaultError: 500,
  MongoError: 11000,
};
module.exports = {
  ERROR_CODES,
  handleCatchError,
  handleFailError
};

const handleFailError = () => {
  const error = new Error("No item found");
  error.statusCode = 404;
  throw error;
};

const handleCatchError = (err, res) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res
      .status(ERROR_CODES.BadRequest)
      .send({ message: "Bad Request, Invalid input" });
  } else if (err.message === "Incorrect email or password") {
    res
      .status(ERROR_CODES.Unauthorized)
      .send({ message: "You are not authorized to do this" });
  } else if (err.statusCode === 404) {
    res.status(ERROR_CODES.NotFound).send({ message: "Item not found" });
  } else if (err.code === 11000) {
    res
      .status(ERROR_CODES.AlreadyExistsError)
      .send({
        message:
          "Email address is already being used, please try another email.",
      });
  } else {
    res
      .status(ERROR_CODES.DefaultError)
      .send({ message: "Something went wrong" });
  }
};

// function handleCatchError(res, err) {
//   if (err.name === "ValidationError") {
//     return res.status(ERROR_400).send({
//       message:
//         "Invalid data passed to the methods for creating a user, or invalid ID passed to the params",
//     });
//   }
//   if (err.name === "CastError") {
//     return res.status(ERROR_400).send({
//       message:
//         "There is no user with the requested ID, or the request was sent to a non-existent address.",
//     });
//   }
//   return res.status(ERROR_500).send({
//     message: "An error has occurred on the server",
//   });
// }