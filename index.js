require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
// Basic Configuration
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// ===================================================================
// Solution:
const originalsURLs = [];
// --------------------------
app.post("/api/shorturl", (req, res) => {
  function storeReducer(item, store = originalsURLs) {
    let itemIndex = store.indexOf(item);
    if (itemIndex === -1)
      return (
        originalsURLs.push(item),
        { original_url: item, short_url: store.length }
      );
    return { original_url: item, short_url: itemIndex + 1 };
  }

  function checkURL(inputURL) {
    let regEx = /^https?:\/\//;
    if (!regEx.test(inputURL)) return false;
    return true;
  }
  // -------------------------
  let originURL = req.body.url;
  res.json(
    checkURL(originURL) ? storeReducer(originURL) : { error: "invalid url" }
  );
});
app.get("/api/shorturl/:num", (req, res) => {
  let url = originalsURLs[req.params.num - 1];
  if (url === undefined) {
    return res.json({ error: "invalid url" });
  }
  res.redirect(originalsURLs[req.params.num - 1]);
});
// ===================================================================
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
