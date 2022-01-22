const express = require("express");
const router = express.Router();

const { auth, isLogedIn } = require('../Midelwares/auth.js');

const Shop = require("../models/shop");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

router.get("/", isLogedIn, auth, (req, res) => {
  Order.find({userID: req.user._id}, (err, foundOrders) => {
    res.render("myOrders", {isLogedIn: req.isLogedIn,
      isShopOwner: req.user.isShopOwner,
      orders: foundOrders
    });
  });
});

router.post("/addNew", async (req, res) => {


  await Cart.findOne({userID: req.user._id}, (err, foundCart) => {

    const newOrder = new Order({
      userID: req.user._id,
      shopID: req.session.lastShopID,
      products: foundCart.products,
      totalVal: req.body.ordBtn,
      status: "pending"
    });

    newOrder.save();

    foundCart.products = [];
    foundCart.save();
    res.redirect("/order");
  });
});

module.exports = router
