const express = require("express");
const jwt = require("jsonwebtoken");
const exjwt = require('express-jwt');
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const secretkey = "My superKey";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-control-Allow-Headers", "Content-type,authorization");
  next();
});

const port = 3000;
const jwtmw = exjwt({
  secret: secretkey,
  algorithms: ["HS256"],
});
let users = [
  {
    id: 1,
    username: "Ramya",
    password: "123",
  },
  {
    id: 2,
    username: "Jampani",
    password: "456",
  },
];
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  for (let user of users) {
    if (username == user.username && password == user.password) {
      let token = jwt.sign(
        { id: user.id, username: user, username },
        secretkey,
        { expiresIn: "180s" }
      );
      res.json({
        success: true,
        err: null,
        token,
      });
      break;
    } else {
      res.status(401).json({
        success: false,
        token: null,
        err: "UserName or Password is Incorrect",
      });
    }
  }
});

app.get("/api/dashboard", jwtmw, (req, res) => {
  res.json({
    success: true,
    myContent: "Secret Content that only log ppl can see",
  });
});

app.get("/api/price", jwtmw, (req, res) => {
  res.json({
    success: true,
    myContent: "This app price is $3",
  });
});

app.get("/api/settings", jwtmw, (req, res) => {
  res.json({
    myContent: "This is settings Page",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      success: false,
      officialError: err,
      err: "username or password is wrong",
    });
  } else {
    next(err);
  }
});
app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});