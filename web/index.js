const express = require("express");

const Game = require("./lib/game");
const Zen = require("./lib/zen");

const PORT = process.env.PORT || 5000;
const ZEN_PONG_ADDRESS =
  process.env.ZEN_PONG_ADDRESS || "znYsZa8ugtWRnYZ1Qecvh5c8NowMrrnnYuQ";

const app = express();

// Set up middleware to handle request params
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public")); // Serve content from public folder

// Endpoint used to create a new game wallet
app.post("/api/wallets", async (req, res) => {
  res.json({ data: { gameWallet: ZEN_PONG_ADDRESS } });
});

app.get("/api/wallets/:address/transactions", async (req, res) => {
  const { address, gameId, all = false } = Object.assign(
    {},
    req.body,
    req.params,
    req.query
  );

  try {
    const game = Game.getGame(gameId);
    const wallet = game && game.gameWallet ? game.gameWallet : address;
    const timestamp =
      game && game.createdAt ? game.createdAt : Math.ceil(Date.now() / 1000);

    let transactions =
      (await Zen.getTransactions(wallet)).items.filter(t => {
        const isConfirmed = t.confirmations > 0;
        const toAddresses = t.vin.map(v => v.addr);
        const isToPongWallet = toAddresses.some(addr => addr === address);
        const isRecent = t.time >= timestamp;

        console.log(
          JSON.stringify(
            {
              t: [t.txid, t.time],
              toAddresses,
              address,
              gameId,
              all,
              game: game || "NULL",
              wallet,
              timestamp,
              isConfirmed,
              isToPongWallet,
              isRecent
            },
            null,
            2
          )
        );

        return all || (isConfirmed && isToPongWallet && isRecent);
      }) || [];
    res.json({ data: transactions });
  } catch (_) {
    res.json({ data: [] });
  }
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
app.put("/api/games/:id/playerWallet", async (req, res) => {
  const { id, playerWallet } = Object.assign({}, req.body, req.params);
  const game = Game.updatePlayerWallet(id, playerWallet);

  if (game.result === Game.RESULT_WIN) {
    const tx = await Zen.createTransaction(playerWallet);

    game.transaction = tx;

    res.json({ data: { game } });
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
