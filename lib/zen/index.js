const axios = require("axios");
const zencashjs = require("zencashjs");
const bip39 = require("bip39");
const bitcoinjs = require("bitcoinjs-lib");
const bip32utils = require("bip32-utils");

const InsightApi = require("./insightApi");

const ZEN_PONG_WALLET_PRIVATE_KEY = process.env.ZEN_PONG_WALLET_PRIVATE_KEY;

const getWalletAddresses = () => {
  const seed = ZEN_PONG_WALLET_PRIVATE_KEY;
  const seedHex = bip39
    .mnemonicToSeedSync(seed.toLowerCase(), "")
    .toString("hex");
  const hdNode = bitcoinjs.HDNode.fromSeedHex(seedHex);
  var chain = new bip32utils.Chain(hdNode);

  // Creates 3 address from the same chain
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
      privWIF: pkWIF,
      privateKey: privKey,
      pubKey
      // privateKey: pkWIF
    };
  });
};

const getUtxo = async address => {
  const history = await InsightApi.getUtxo(address);
  return history[0];
};

// Based on https://github.com/ZencashOfficial/zencashjs#example-usage-transparent-address
const createTransaction = async (gameAddress, address) => {
  // Retrieve full wallet
  const addresses = getWalletAddresses();
  const gameWallet = addresses.find(addr => addr.address === gameAddress);
  const { privWIF, privateKey, pubKey, address: zAddr } = gameWallet;

  console.log({ gameWallet, address });

  // It is imperative that the block used for bip115BlockHeight and bip115BlockHash has a sufficient number of
  // confirmations (recommded values: 150 to 600 blocks older than current BLOCKHEIGHT). If the block used for
  // the replay protection should get orphaned the transaction will be unspendable for at least 52596 blocks.
  // For details on the replay protection please see: https://github.com/bitcoin/bips/blob/master/bip-0115.mediawiki

  // To create and sign a raw transaction at BLOCKHEIGHT with BIP115BLOCKHEIGHT and BIP115BLOCKHASH
  const blockHeight = 450150;
  const bip115BlockHeight = blockHeight - 150;
  const bip115BlockHash =
    "0000000007844e62d471b966cc5926bd92e56a27d2c6a6ac8f90d34e11d3028d";

  // Retrieve UTXO
  const utxo = await getUtxo(gameWallet.address);
  const transactionDetails = [{ address, satoshis: utxo.satoshis }];

  // Create Raw Transaction
  let rawTx = zencashjs.transaction.createRawTx(
    [utxo],
    transactionDetails,
    bip115BlockHeight,
    bip115BlockHash
  );

  // Sign Transaction
  const signedTx = await zencashjs.transaction.signTx(
    rawTx,
    0,
    privateKey,
    true
  );
  const serializedTx = zencashjs.transaction.serializeTx(signedTx);

  const broadcastedTx = await InsightApi.broadcastTransaction(serializedTx);

  return broadcastedTx;
};

module.exports = {
  getTransactions: InsightApi.getTransactions,
  getWalletAddresses,
  createTransaction
};
