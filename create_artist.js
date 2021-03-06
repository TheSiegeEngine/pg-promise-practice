const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const promise = require("bluebird");

const initOptions = {
  promiseLib: promise
};

const pgp = require("pg-promise")(initOptions);

const config = {
  host: "localhost",
  port: 5432,
  database: "musical_db",
  user: "postgres"
};

const db = pgp(config);

var co = require("co");
var prompt = require("prompt-promise");

var biz = { name: "" };
const q = "INSERT INTO artists VALUES (default, ${name})";
const r = "SELECT id FROM artists WHERE name = ${name}";

prompt("Artist name? ")
  .then(value => {
    biz.name = value;
    db.result(q, biz).then(res => {
      db.any(r, biz)
        .then(function(results) {
          console.log(`Created artist with ID ${results[0].id}`);
        })
        .then(res => {
          pgp.end();
          prompt.done();
        });
    });
  })
  .catch(function rejected(err) {
    console.log("error:", err.stack);
    pgp.end();
    prompt.finish();
  });
