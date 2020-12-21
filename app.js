require('rootpath')();//
const cors = require('cors');//
const jwt = require('helpers/jwt');//
const errorHandler = require('helpers/error-handler');//

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 4000;

const history = [{ id: 1, process: "plus", num1: 4, num2: 5, result: 9, datetime: "Fri Dec 18 2020 13:57:45" }];

app.use(bodyParser.urlencoded({ extended: true }));//was true
app.use(bodyParser.json());
app.use(cors());//
app.use(jwt());//
app.use('/user', require('./user/user.controller'));//
app.use('/contacts', require('./contacts/contacts.controller'));//2
app.use(errorHandler);//

app.get("/", (req, res) => {
  res.json({ message: "Express API v1.0" });
});

app.get("/history/", (req, res) => {
  res.json(history);
});

app.get("/history/:id", (req, res) => {
    const result = history.find((item) => item.id === parseInt(req.params.id));
    result ? res.json(result) : res.status(404).json({ message: "History not found." });
});

app.post("/calc/plus", (req, res) => {
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  const sum = num1 + num2;

  history.push({ id: Math.max.apply(Math, history.map(function(o) { return o.id; })) + 1, process: "plus", num1: num1, num2: num2, result: sum, datetime: new Date().toString().substring(0, 24)});

  res.json({ result: sum, params: req.body });
});

app.post("/calc/minus", (req, res) => {
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  const sum = num1 - num2;

  history.push({ id: Math.max.apply(Math, history.map(function(o) { return o.id; })) + 1, process: "minus", num1: num1, num2: num2, result: sum, datetime: new Date().toString().substring(0, 24) });

  res.json({ result: sum, params: req.body });
});

app.post("/calc/divide", (req, res) => {
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  const sum = num2 !== 0 ? num1 / num2 : 0;

  history.push({ id: Math.max.apply(Math, history.map(function(o) { return o.id; })) + 1, process: "divide", num1: num1, num2: num2, result: sum, datetime: new Date().toString().substring(0, 24) });

  num2 === 0
    ? res.status(404).json({ message: "Number can not be divided to zero." })
    : res.json({ result: sum, params: req.body });
});

app.post("/calc/multiply", (req, res) => {
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  const sum = num1 * num2;

  history.push({id: Math.max.apply(Math, history.map(function(o) { return o.id; })) + 1, process: "multiply", num1: num1, num2: num2, result: sum, datetime: new Date().toString().substring(0, 24) });

  res.json({ result: sum, params: req.body });
});

app.listen(port, () => {
  console.log("server is running on port: " + port);
});
