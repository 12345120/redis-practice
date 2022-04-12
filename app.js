const express = require("express");
const path = require("path");

const app = express();

app.use("/public", express.static("public"));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "index.html"));
});

app.listen(5000);
console.log("main server on 5000!");
