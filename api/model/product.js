const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = {
  productDetail: String,
  productTitle: String,
  productPrice: Number,
  productSellingPrice: Number,
  file: String,
  cId:String
};

const ProductModel = mongoose.model("product", Product);

module.exports = ProductModel;
