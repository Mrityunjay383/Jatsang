const mongoose = require('mongoose');

const Product = require("/product");

const orderSchema = new mongoose.Schema({
  attachedCusID: String,
  ShopID: String,
  products: [Product]
});

module.exports = mongoose.model("Order", productSchema);
