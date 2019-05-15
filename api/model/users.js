const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const value = {
  name: String,
  email: String,
  mobile_no: Number,
  password: String,
  category: String,
  idProof: String,
  file: String
};

const UserModel = mongoose.model("User", value);

module.exports = UserModel;
