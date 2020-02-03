const express = require("express");

const Game = require("./lib/game");
const Zen = require("./lib/zen");

const PORT = process.env.PORT || 5000;

const app = express();

// Set up middleware to handle request params
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public")); // Serve content from public folder

// Endpoint used to register a game
app.post("/api/games", async (req, res) => {
  const addresses = await Zen.getWalletAddresses();
  const firstAddress = addresses[0];

  const { address: gameWallet } = firstAddress;
  const game = Game.registerGame(gameWallet);

  res.json({ data: { game } });
});

// Endpoint used to update the result of a game
app.put("/api/games/:id/result", (req, res) => {
  const { id, result } = Object.assign({}, req.body, req.params);
  const game = Game.updateResult(id, result);
  const { gameWallet } = game;

  res.json({ data: { game } });
});

// Endpoint used to update the player wallet to redeem the prize
app.put("/api/games/:id/playerWallet", async (req, res) => {
  const { id, playerWallet } = Object.assign({}, req.body, req.params);
  const game = Game.updatePlayerWallet(id, playerWallet);
  const { gameWallet } = game;
  console.log({ id, playerWallet, game, gameWallet });

  if (game.result === Game.RESULT_WIN) {
    const tx = await Zen.createTransaction(gameWallet, playerWallet);

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

// Endpoint used to get a game
app.get("/api/games/:id/payments", async (req, res) => {
  const { id: gameId, all = false } = Object.assign(
    {},
    req.body,
    req.params,
    req.query
  );

  try {
    const game = Game.getGame(gameId);
    const { gameWallet, playerWallet } = game;

    console.log({ game, gameId, gameWallet });

    const wallet = game.gameWallet;
    const timestamp =
      game && game.createdAt ? game.createdAt : Math.ceil(Date.now() / 1000);

    console.log({ game, wallet });

    let transactions =
      (await Zen.getTransactions(wallet, { from: playerWallet })).items.filter(
        t => {
          const isConfirmed = t.confirmations > 0;
          const toAddresses = t.vin.map(v => v.addr);
          const isRecent = t.time >= timestamp;

          // TODO: Remove mock
          return all || (isConfirmed && isRecent);
        }
      ) || [];
    res.json({ data: transactions });
  } catch (error) {
    console.error({ error });
    res.json({ data: [], error });
  }
});

// Start server
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
