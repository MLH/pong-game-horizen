const express = require("express");

const Game = require("./lib/game");
const Zen = require("./lib/zen");

const PORT = process.env.PORT || 5000;

const app = express();

function wrapAsync(fn) {
  return function(req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}

// Set up middleware to handle request params
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public")); // Serve content from public folder

// Simplify access to params that come from different parts of the request
const paramsFromReq = req => Object.assign({}, req.body, req.params, req.query);

// Endpoint used to register a game
app.post(
  "/api/games",
  wrapAsync(async (req, res) => {
    // Fetch first available address to set as the game's wallet
    const addresses = await Zen.getWalletAddresses();
    const firstAddress = addresses[0];
    const { address: gameWallet } = firstAddress;

    // Creates a new Game in memory
    const game = Game.registerGame(gameWallet);

    res.json({ data: { game } });
  })
);

// Endpoint used to update the result of a game
app.put("/api/games/:id/result", (req, res) => {
  const { id, result } = paramsFromReq(req);

  // Update result of the Game
  const game = Game.updateResult(id, result);

  res.json({ data: { game } });
});

// Endpoint used to update the player wallet to redeem the prize
app.put(
  "/api/games/:id/playerWallet",
  wrapAsync(async (req, res) => {
    const { id, playerWallet } = paramsFromReq(req);

    // Update game object with wallet to redeem the prize
    const game = Game.updatePlayerWallet(id, playerWallet);

    // Minimal sanity check to ensure the game ended and the player won
    if (game.result === Game.RESULT_WIN) {
      const { gameWallet } = game;

      // Create transaction for the winner's prize
      const tx = await Zen.createTransaction(gameWallet, playerWallet);

      // Add transaction info to the game object
      game.transaction = tx;

      res.json({ data: { game } });
    } else {
      res.json({ data: { game } });
    }
  })
);

// Endpoint used to get a game
app.get("/api/games/:id", (req, res) => {
  const { id } = paramsFromReq(req);

  // Retrieve game from the memory
  const game = Game.getGame(id);

  res.json({ data: { game } });
});

// Endpoint used to get a game
app.get(
  "/api/games/:id/payments",
  wrapAsync(async (req, res) => {
    const { id: gameId, all = false } = paramsFromReq(req);

    // Retrieve game from the memory
    const game = Game.getGame(gameId);
    const { gameWallet, playerWallet } = game;
    const wallet = game.gameWallet;
    // Fetch a timestamp to filter recent transactions
    const timestamp =
      game && game.createdAt ? game.createdAt : Math.ceil(Date.now() / 1000);

    // A payment is only valid if the transaction has the player's wallet address and happened after the game started
    let transactions =
      (await Zen.getTransactions(wallet, { from: playerWallet })).items.filter(
        t => {
          const toAddresses = t.vin.map(v => v.addr);
          const isRecent = t.time >= timestamp;

          return all || isRecent;
        }
      ) || [];
    res.json({ data: transactions });
  })
);

// Log errors to facilitate debugging
app.use(function logError(err, req, res, next) {
  console.error(err);
  next(err, req, res, next);
});

// Catch all errors
app.use(function errorHandler(err, req, res, next) {
  res.status(500);
  res.json({ error: err.message });
});

// Start server
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
