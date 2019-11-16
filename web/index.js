const express = require("express");

const Game = require("./lib/game");
const Zen = require("./lib/zen");

const PORT = process.env.PORT || 5000;
const app = express();

// Set up middleware to handle request params
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public")); // Serve content from public folder

// Endpoint used to create a new game wallet
app.post("/api/wallets", async (req, res) => {
  const gameWallet = await Zen.getNewAddress();

  res.json({ data: { gameWallet } });
});

app.get("/api/wallets/:id/transactions", async (req, res) => {
  const params = Object.assign({}, req.body, req.params);
  const transactions = (await Zen.listAddressGroupings()) || [];

  res.json({ data: transactions });
});

// Endpoint used to register a game
app.post("/api/games", (req, res) => {
  const { gameWallet } = Object.assign({}, req.body, req.params);
  const game = Game.registerGame(gameWallet);

  res.json({ data: { game } });
});

// Endpoint used to update the result of a game
app.put("/api/games/:id/result", (req, res) => {
  const { id, gameWallet, result } = Object.assign({}, req.body, req.params);
  const game = Game.updateResult(id, result);

  res.json({ data: { game } });
});

// Endpoint used to update the player wallet to redeem the prize
app.put("/api/games/:id/playerWallet", (req, res) => {
  const { id, playerWallet } = Object.assign({}, req.body, req.params);
  const game = Game.updatePlayerWallet(id, playerWallet);

  if (game.result === Game.RESULT_WIN) {
    // TODO: transfer tokens to winner
    setTimeout(() => {
      game.transaction = {
        mocked: true,
        value: 10000
      };
      res.json({ data: { game } });
    }, 300);
  } else {
    res.json({ data: { game } });
  }
});

// Endpoint used to get a game
app.get("/api/games/:id", (req, res) => {
  const { id } = Object.assign({}, req.body, req.params);
  const game = Game.getGame(id);

  res.json({ data: { game } });
});

// Start server
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
