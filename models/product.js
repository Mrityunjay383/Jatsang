const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ownerID: String,
  title: String,
  des: String,
  price: Number,
  currStock: Number
});

module.exports = mongoose.model("Product", shopSchema);
