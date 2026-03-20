const { model, Schema } = require("mongoose");

const blacklist = new Schema({
	userId: String,
	reason: String,
});

module.exports = model("blacklist", blacklist);
