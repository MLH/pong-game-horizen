// content of index.js
const http = require("http");
const port = 3000;

const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

// Set up middleware to handle request params
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Endpoint used to register a game
app.post("/api/games", (req, res) => {
  // TODO: Implement communication with Horizen
  const params = req.body;

  setTimeout(() => {
    res.json({ data: { params } });
  }, 300);
});

// Endpoint used to register a game result
app.post("/api/results", (req, res) => {
  // TODO: Implement communication with Horizen
  const params = req.body;

  setTimeout(() => {
    res.json({ data: { winner: "Winner", params } });
  }, 300);
});

// Serve content from public folder
app.use(express.static("public"));

// Start server
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
