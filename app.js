const express = require("express");
const cors = require("cors");

const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
// mongoose.connect("mongodb://localhost:27017");
const routes = require("./routes");

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
