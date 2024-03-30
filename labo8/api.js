const express = require("express");
const path = require("path");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

const users = [];
const tokens = [];

app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.post("/users", (req, res) => {
  users.push({ username: req.body.username, password: req.body.password });

  res.sendStatus(201);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    res.sendStatus(401);
  } else {
    const token = crypto.randomUUID();
    tokens.push({ username: user.username, token: token });
    res.send({ token: token });
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies.user_cookie;
  const user = tokens.find((user) => user.token === token);

  if (!token || !user) {
    res.redirect("/login");
    return;
  } else {
    res.render("profile", { username: user.username });
  }
});

app.listen(PORT, (e) => {
  if (e) {
    console.log("Error while attempting to start server: ", e);
  } else {
    console.log(`Server is listening at http://localhost:${PORT}/`);
  }
});
