const express = require("express");
const cors = require("cors");

const { PORT = 3001 } = process.env;

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// Add the crash-test route before the signin and signup routes
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

const routes = require("./routes");

app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
