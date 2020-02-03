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

  const createGame = async () => {
    const {
      data: { game }
    } = await fetchPost("/api/games");

    return game;
  };

  const updateGameResult = async (gameId, result) => {
    const {
      data: { game }
    } = await fetchPut(`/api/games/${gameId}/result`, {
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

  const listTransactions = async gameId => {
    const { data: transactions } = await get(`/api/games/${gameId}/payments`);

    return transactions;
  };

  return {
    createGame,
    updateGameResult,
    updateGamePlayerWallet,

    listTransactions
  };
})();
