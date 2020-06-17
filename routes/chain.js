var express = require("express");
var router = express.Router();
const ForgeSDK = require("@arcblock/forge-sdk");
const GraphqlClient = require("@arcblock/graphql-client");
const { fromPublicKey, fromSecretKey } = require("@arcblock/forge-wallet");
const { toBase58, toBase64, fromBase64, fromBase58 } = require("@arcblock/forge-util");

const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout));

// declare wallet
router.get("/", async (req, res, next) => {
  ForgeSDK.connect("http://127.0.0.1:8211/api", { name: "nate" });
  var wallet = ForgeSDK.Wallet.fromRandom();
  var result = await ForgeSDK.sendDeclareTx({
    tx: { itx: { moniker: "abcd222" } },
    wallet: wallet,
  });
  console.log("****start****");
  console.log(result);
  console.log("****end****");
  res.send(
    JSON.stringify({
      code: 0,
      msg: "declare success",
      content: wallet,
    }),
  );
});

// create asset
router.get("/create_asset", async (req, res, next) => {
  const client = new GraphqlClient("http://127.0.0.1:8211/api");
  // TODO: get the wallet pk from req
  const walletSk =
    "0x9533af13d7fdfe94b74550a8058c80a7b73e93065abe0efe105ed759dd36572948fee575f889f462b41abbd06bb3b7a450eccb470ceb2aa73ccc28443c65dc6c";
  const wallet = fromSecretKey(walletSk);
  // 1. create asset for owner
  let assetAddress;
  [hash, assetAddress] = await client.createAsset({
    moniker: "asset",
    readonly: false, // if we want to update the asset, we should set this to false
    transferrable: false,
    data: {
      typeUrl: "json",
      value: {
        key: "value",
        sn: Math.random(),
      },
    },
    wallet: wallet,
  });
  console.log("assetAddress=》", assetAddress);
  res.send(
    JSON.stringify({
      code: 0,
      msg: "create asset success",
      content: { assetAddress: assetAddress },
    }),
  );
});

// create asset
router.get("/get_asset", async (req, res, next) => {
  const client = new GraphqlClient("http://127.0.0.1:8211/api");
  // TODO: get the asset address from req
  const assetAddress = "zjdxyYUjVCe12wiPvGgeBDBsAY9GvcancoiJ";
  // 3. read asset
  const { state } = await client.getAssetState({ address: assetAddress });
  console.log("asset state", state);
  res.send(
    JSON.stringify({
      code: 0,
      msg: "get asset success",
      content: state,
    }),
  );
});

module.exports = router;
