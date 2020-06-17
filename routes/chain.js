var express = require("express");
var router = express.Router();
const ForgeSDK = require("@arcblock/forge-sdk");

/* GET users listing. */
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
		})
	);
});

module.exports = router;
