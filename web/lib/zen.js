const axios = require("axios");

const post = async (url, params) => {
  const { data } = await axios.post(url, params, {
    auth: {
      username: ZEN_RPC_USERNAME,
      password: ZEN_RPC_PASSWORD
    }
  });

  return data;
};

// Create a new address
// curl --user myusername --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getnewaddress", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:8232/
const getNewAddress = async () => {
  const { result } = await post(ZEN_RPC_URL, {
    jsonrpc: "1.0",
    id: "curltest",
    method: "getnewaddress",
    params: []
  });

  return result;
};

// Lists groups of addresses which have had their common ownership made public by common use as inputs or as the resulting change in past transactions
// curl --user myusername --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "listaddressgroupings", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:8232/
const listAddressGroupings = async () => {
  const result = await post(ZEN_RPC_URL, {
    jsonrpc: "1.0",
    id: "curltest",
    method: "listaddressgroupings",
    params: []
  });

  return result;
};

const ZEN_RPC_URL = process.env.ZEN_RPC_URL || "http://127.0.0.1:8232/";
const ZEN_RPC_USERNAME = process.env.ZEN_RPC_USERNAME || "myusername";
const ZEN_RPC_PASSWORD = process.env.ZEN_RPC_PASSWORD || "password";

module.exports = {
  getNewAddress,
  listAddressGroupings
};
