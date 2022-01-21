const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
  userID: String,
  index: Number,
  products: [Object]
});

module.exports = mongoose.model("Cart", cartSchema);
