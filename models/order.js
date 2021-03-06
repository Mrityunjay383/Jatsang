const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  userID: String,
  shopOwnerID: String,
  products: [Object],
  totalVal: Number,
  status: String
});

module.exports = mongoose.model("Order", orderSchema);
