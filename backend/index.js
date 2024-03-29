const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const photoRoute = require("./routes/photo");
const commentRoute = require("./routes/comment");
dotenv.config();

// CONNECT DATABASE
mongoose.connect(process.env.MONGODB_URL).then((res) => {
  console.log("Connected to database", res);
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("common"));
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/v1/photo", photoRoute);
app.use("/v1/comment", commentRoute);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
