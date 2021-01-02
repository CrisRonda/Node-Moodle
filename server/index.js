const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const _ = require("lodash");
const fetch = require("node-fetch");
const app = express();
const baseURL = "http://localhost/";

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(parser.json());

// test server
app.get("/testing", function (req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ msj: "Exito" }));
});
// test webhooks
app.post("/test", function (req, res) {
  console.log("___________________BODY___________________");
  console.log(req.body);
  return res.end(JSON.stringify({ msj: "ok" }));
});

async function getCurrentUser({ token, username }) {
  const resp = await fetch(
    `${baseURL}webservice/rest/server.php?wstoken=${token}&wsfunction=core_user_get_users_by_field&field=username&values[0]=${username}&moodlewsrestformat=json`
  );
  const user = await resp.json();
  return user;
}
async function login({ username, password }) {
  const respAuth = await fetch(
    `${baseURL}login/token.php?username=${username}&password=${password}&service=moodle_mobile_app`
  );
  const data = await respAuth.json();
  const { token } = data;
  return { data, token };
}
app.post("/login", async function (req, res) {
  const { username, password } = req.body;
  if (username && password) {
    const { token, data } = await login({ username, password });
    const user = await getCurrentUser({ token, username });
    res.end(JSON.stringify({ data, user }));
  }
  return res.end(JSON.stringify({ msj: "send all fields" }));
});

app.listen(3001, () => {
  console.log("Server Listening on port 3001.....");
});
