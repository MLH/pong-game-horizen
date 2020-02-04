const axios = require("axios");
const zencashjs = require("zencashjs");

const ZEN_EXPLORER_API_URL =
  process.env.ZEN_EXPLORER_API_URL ||
  "https://explorer.zensystem.io/insight-api";

const stringifyParams = object =>
  Object.keys(object)
    .map(key => key + "=" + object[key])
    .join("&");

const getInsightApiUrl = (endpoint, queryParams = {}) => {
  var queryString = !!Object.keys(queryParams).length
    ? stringifyParams(queryParams)
    : null;

  const url = `${ZEN_EXPLORER_API_URL}${endpoint}`;
  const finalUrl = queryString ? `${url}?${queryString}` : url;

  return finalUrl;
};

const post = async (url, params) => {
  const { data } = await axios.post(url, params);

  return data;
};

const get = async (url, params) => {
  const { data } = await axios.get(url, params);

  return data;
};

const getTransactions = async (address, params = { to: null, from: null }) => {
  const url = getInsightApiUrl(`/addrs/${address}/txs`, params);
  const result = await get(url);

  return result;
};

const getUtxo = async address => {
  const url = getInsightApiUrl(`/addrs/${address}/utxo`);
  const result = await get(url);

  return result;
};

const getBlocks = async (limit = 1) => {
  const url = getInsightApiUrl(`/blocks`, { limit });
  const result = await get(url);

  return result;
};

const getBlock = async blockHeight => {
  const url = getInsightApiUrl(`/block-index/${blockHeight}`);
  const result = await get(url);

  return result;
};

const broadcastTransaction = async rawtx => {
  const params = { rawtx };
  const url = getInsightApiUrl(`/tx/send`);

  try {
    var tx = await post(url, params);
  } catch (error) {
    var tx = null;
    const {
      response: { status, statusText, headers, data }
    } = error;
    console.error({ status, statusText, headers, data });
  }

  return tx;
};

module.exports = {
  getBlock,
  getBlocks,

  broadcastTransaction,
  getTransactions,
  getUtxo
};
