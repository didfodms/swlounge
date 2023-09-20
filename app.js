require("dotenv").config({ path: "./.env" });

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const registerRouter = require("./routes/register");
const logoutRouter = require("./routes/logout");

// user
const widgetRouter = require("./routes/user/widget");
const userIndexRouter = require("./routes/user/index");
const userAboutRouter = require("./routes/user/about");
const userLoginRouter = require("./routes/user/login");
const userBlogSingleRouter = require("./routes/user/blog-single");
const userOnlineMentoringRouter = require("./routes/user/online-mentoring");

// admin 
const dashboardRouter = require("./routes/admin/dashboard");

const app = express();

// session middleware
const session = require("express-session");
const fileStore = require("session-file-store")(session);
const threeHours = 1000 * 60 * 60 * 3;

app.use(cookieParser());

app.use(
  session({
    HttpOnly: true,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // maxAge: threeHours,
      maxAge: null,
      httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함
      Secure: true,
    },
    store: new fileStore(), // sessions 폴더에 session record 저장
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// basic
app.use("/", userIndexRouter);
app.use("/users", usersRouter);
app.use("/register", registerRouter);
app.use("/logout", logoutRouter);

// admin
app.use("/dashboard", dashboardRouter);

// user
app.use("/login", userLoginRouter);
app.use("/index", userIndexRouter);
app.use("/about", userAboutRouter);
app.use("/widget", widgetRouter);
app.use("/blog-single", userBlogSingleRouter);
app.use("/online-mentoring", userOnlineMentoringRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
