const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  ownerID: String,
  ownerName: String,
  shopName: String,
  locatedAt: String,
})

module.exports = mongoose.model("Shop", shopSchema);
