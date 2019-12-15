const axios = require("axios");
const zencashjs = require("zencashjs");

const ZEN_EXPLORER_API_URL =
  process.env.ZEN_EXPLORER_API_URL ||
  "https://explorer.zensystem.io/insight-api";

const ZEN_PONG_ADDRESS =
  process.env.ZEN_PONG_ADDRESS || "znYsZa8ugtWRnYZ1Qecvh5c8NowMrrnnYuQ";
const ZEN_PONG_WALLET_PRIVATE_KEY = process.env.ZEN_PONG_WALLET_PRIVATE_KEY;

const getExplorerApiUrl = (endpoint, queryParams = {}) => {
  var queryString = !!Object.keys(queryParams).length
    ? Object.keys(queryParams)
        .map(key => key + "=" + queryParams[key])
        .join("&")
    : null;

  const url = `${ZEN_EXPLORER_API_URL}${endpoint}`;

  return queryString ? `${url}?${queryString}` : url;
};

const post = async (url, params) => {
  const { data } = await axios.post(url, params);

  return data;
};

const get = async (url, params) => {
  const { data } = await axios.get(url, params);

  return data;
};

const getTransactions = async (
  address,
  params = {
    to: ZEN_PONG_ADDRESS
  }
) => {
  const url = getExplorerApiUrl(`/addrs/${address}/txs`, params);
  console.log("Getting transactions", url);

  const result = await get(url);
  return result;
};

const getBlocks = async (limit = 1) => {
  const url = getExplorerApiUrl(`/blocks`, { limit });
  const result = await get(url);
  return result;
};

const getBlock = async blockHeight => {
  const url = getExplorerApiUrl(`/block-index/${blockHeight}`);

  console.log("GETTING BLOCK", url);
  const result = await get(url);
  return result;
};

const createTransaction = async address => {
  const priv = zencashjs.address.mkPrivKey(ZEN_PONG_WALLET_PRIVATE_KEY);
  const privWIF = zencashjs.address.privKeyToWIF(priv);
  const pubKey = zencashjs.address.privKeyToPubKey(priv, true); // generate compressed pubKey
  const zAddr = zencashjs.address.pubKeyToAddr(pubKey);

  // It is imperative that the block used for bip115BlockHeight and bip115BlockHash has a sufficient number of
  // confirmations (recommded values: 150 to 600 blocks older than current BLOCKHEIGHT). If the block used for
  // the replay protection should get orphaned the transaction will be unspendable for at least 52596 blocks.
  // For details on the replay protection please see: https://github.com/bitcoin/bips/blob/master/bip-0115.mediawiki

  const { blocks } = await getBlocks();

  console.log({ blocks });

  const lastBlock = blocks[0];
  const bip115BlockHeight = lastBlock.height - 150; // Chaintip - 150 blocks, the block used for the replay protection needs a sufficient number of
  const bip115Block = await getBlock(bip115BlockHeight);

  console.log({ bip115Block });

  // To create and sign a raw transaction at BLOCKHEIGHT with BIP115BLOCKHEIGHT and BIP115BLOCKHASH
  const bip115BlockHash = bip115Block.blockHash; // Blockhash of block -150

  const { items: transactions = [] } = await getTransactions(address, {});

  console.log({ transactions });

  var txobj = zencashjs.transaction.createRawTx(
    transactions.map(t => ({ txid: t.txid, scriptPubKey: pubKey })),
    [
      { address, satoshis: 1000 },
      { address: undefined, data: "hello world", satoshis: 900 }
    ],
    bip115BlockHeight,
    bip115BlockHash
  );
  var tx0 = await zencashjs.transaction.signTx(txobj, 0, priv, true); // The final argument sets the `compressPubKey` boolean. It is `false` by default.
  const rawtx = zencashjs.transaction.serializeTx(tx0);

  const params = { rawtx };
  const url = getExplorerApiUrl(`/tx/send`);

  try {
    var tx = await post(url, params);
  } catch (error) {
    var tx = null;
    console.error(error);
  }

  console.log(
    JSON.stringify(
      {
        ZEN_PONG_WALLET_PRIVATE_KEY,
        priv,
        privWIF,
        pubKey,
        zAddr
        // txobj,
        // tx0,
        // tx
      },
      null,
      2
    )
  );

  return tx;
};

module.exports = {
  getTransactions,
  createTransaction
};
