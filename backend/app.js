const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const authRouter = require("./routes/auth"); // wherever your route file is
const chatsRouter = require("./routes/chat");
const allChatsRouter = require("./routes/allchats");
const quizRouter = require("./routes/quiz");
const config = require("./utils/config");
const middleWare = require("./utils/middleware");

// Middlewares
app.use(express.json());
app.use(cors());



mongoose
  .connect(config.MONGODB_URL)
  .then((result) => {
    console.log("Connected to mongoDB");
  })
  .catch((error) => {
    console.log(error, "error on mongoDB connection");
  });


app.use(middleWare.requestLogger);
app.use("/api/auth", authRouter); // prefix all routes in authRouter with /api/auth
app.use("/api/chat", chatsRouter);
app.use("/api/user", allChatsRouter);
app.use("/api/quiz", quizRouter);
//Global error handler
app.use(middleWare.errorhandler);
app.use(middleWare.unknownEndpoint);


module.exports = app;