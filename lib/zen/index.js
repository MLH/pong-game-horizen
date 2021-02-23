require("dotenv").config();

const axios = require("axios");
const zencashjs = require("zencashjs");
const bip39 = require("bip39");
const bitcoinjs = require("bitcoinjs-lib");
const bip32utils = require("bip32-utils");

const InsightApi = require("./insightApi");

const ZEN_PONG_WALLET_SEED = process.env.ZEN_PONG_WALLET_SEED;

// Fetches wallet addresses from the wallet seed
const getWalletAddresses = () => {
  // Fetch Game Wallet Seed
  const seed = ZEN_PONG_WALLET_SEED;
  const seedHex = bip39
    .mnemonicToSeedSync(seed.toLowerCase(), "")
    .toString("hex");
  const hdNode = bitcoinjs.HDNode.fromSeedHex(seedHex);
  var chain = new bip32utils.Chain(hdNode);

  // Creates address from the same chain
  for (var k = 0; k < 10; k++) {
    chain.next();
  }

  // Get private keys from them
  return chain.getAll().map(function(x) {
    // Get private key (WIF)
    const pkWIF = chain.derive(x).keyPair.toWIF();

    // Private key
    const privKey = zencashjs.address.WIFToPrivKey(pkWIF);

    // Public key
    const pubKey = zencashjs.address.privKeyToPubKey(privKey, true);

    // Address
    const address = zencashjs.address.pubKeyToAddr(pubKey);

    return {
      address,
      privateKey: privKey,
      pubKey
    };
  });
};

// Get unspent transaction to build a new one
const getUtxo = async address => {
  const history = await InsightApi.getUtxo(address);
  return history[0];
};

// Based on https://github.com/ZencashOfficial/zencashjs#example-usage-transparent-address
const createTransaction = async (gameAddress, address) => {
  // Retrieve full wallet
  const addresses = getWalletAddresses();
  const gameWallet = addresses.find(addr => addr.address === gameAddress);
  const { privateKey } = gameWallet;

  // To create and sign a raw transaction at BLOCKHEIGHT with BIP115BLOCKHEIGHT and BIP115BLOCKHASH https://github.com/bitcoin/bips/blob/master/bip-0115.mediawiki
  const blockHeight = 450150;
  const bip115BlockHeight = blockHeight - 150;
  const bip115BlockHash =
    "0000000007844e62d471b966cc5926bd92e56a27d2c6a6ac8f90d34e11d3028d";

  // Retrieve UTXO
  
  // Create Raw Transaction

  // Sign Transaction

  // Serialize Transaction

  // Broadcast Transaction
  
};

module.exports = {
  getTransactions: InsightApi.getTransactions,
  getWalletAddresses,
  createTransaction
};
