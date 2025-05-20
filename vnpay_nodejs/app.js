var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var order = require("./routes/order");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");

var app = express();

// Kết nối MongoDB
mongoose.connect("mongodb://localhost:27017/phone_store", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Kết nối MongoDB thành công"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Cấu hình session
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/order", order);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;