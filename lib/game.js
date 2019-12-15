const RESULT_WIN = 0;
const RESULT_LOSS = 1;
const GAMES = {};

const getTimestamp = () => Date.now() / 1000;

const registerGame = gameWallet => {
  const id = Object.keys(GAMES).length + 1;

  const game = {
    id,
    createdAt: getTimestamp(),
    gameWallet,
    playerWallet: null,
    result: null
  };

  GAMES[id] = game;

  return game;
};

const updateResult = (gameId, result) => {
  const game = GAMES[gameId];

  if (!game) {
    return;
  }

  if (game.result === null) {
    game.result = result;
    game.finishedAt = getTimestamp();
  }

  return game;
};

const updatePlayerWallet = (gameId, playerWallet) => {
  const game = GAMES[gameId];

  if (!game) {
    return;
  }

  if (game.playerWallet === null) {
    game.playerWallet = playerWallet;
    game.finishedAt = getTimestamp();
  }

  return game;
};

const getGame = gameId => GAMES[gameId];

module.exports = {
  RESULT_LOSS,
  RESULT_WIN,

  getGame,
  registerGame,
  updateResult,
  updatePlayerWallet
};
