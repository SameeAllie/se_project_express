const express = require("express");
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

const routes = require("./routes");

app.use((req, res, next) => {
  req.user = { _id: '62d13fc58fbff2a798c368f7' };
  next();
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`);
  });