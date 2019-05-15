const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cat = {
  cid: String,
  category: String
};
const catModel = mongoose.model("cat", cat);

module.exports = catModel;

