const API = (() => {
  const makeRequest = async (url, method = "GET", data = {}, headers = {}) => {
    const response = await fetch(url, {
      method,
      headers: Object.assign(
        {
          "Content-Type": "application/json"
        },
        headers
      ),
      body: method !== "GET" ? JSON.stringify(data) : null
    });

    return await response.json();
  };
  const fetchPost = async (url, data = {}) =>
    await makeRequest(url, "POST", data);

  const fetchPut = async (url, data = {}) =>
    await makeRequest(url, "PUT", data);

  const get = async (url, data) => await makeRequest(url);

  const createWallet = async () => {
    const {
      data: { gameWallet }
    } = await fetchPost("/api/wallets");

    return gameWallet;
  };

  const createGame = async gameWallet => {
    const {
      data: { game }
    } = await fetchPost("/api/games", {
      gameWallet
    });

    return game;
  };

  const updateGameResult = async (gameId, gameWallet, result) => {
    const {
      data: { game }
    } = await fetchPut(`/api/games/${gameId}/result`, {
      gameWallet,
      result
    });

    return game;
  };

  const updateGamePlayerWallet = async (gameId, playerWallet) => {
    const {
      data: { game }
    } = await fetchPut(`/api/games/${gameId}/playerWallet`, {
      playerWallet
    });

    return game;
  };

  const listTransactions = async gameWallet => {
    const {
      data: { transactions }
    } = await get(`/api/wallets/${gameWallet}/transactions`);

    return transactions;
  };

  return {
    createGame,
    updateGameResult,
    updateGamePlayerWallet,

    createWallet,
    listTransactions
  };
})();
