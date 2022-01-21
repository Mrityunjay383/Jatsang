const express = require("express");
const router = express.Router();

const { auth, isLogedIn } = require('../Midelwares/auth.js');

const Product = require("../models/product");
const Cart = require("../models/cart");

router.get("/", isLogedIn, auth, (req, res) => {

  Cart.findOne({userID: req.user._id}, (err, foundCart) => {
    res.render("cart", {isLogedIn: req.isLogedIn,
      isShopOwner: req.user.isShopOwner,
      products: foundCart.products
    });
  });
});

// Cart FUnctionality
router.post("/addToCart", auth, (req, res) => {
  const productID = req.body.addBtn;

  Cart.findOne({userID: req.user.id}, (err, foundCart) => {
    Product.findOne({_id: productID}, (err, foundProduct) => {
      foundCart.products.push(foundProduct);
      foundCart.save();

      res.redirect(`/shop${req.session.url}`);
    });
  });
});

router.post("/rmProduct", (req, res) => {
  const productID = req.body.rmBtn;

  Cart.findOne({userID: req.user.id}, (err, foundCart) => {
    for(let product of foundCart.products){
      if(product._id == productID){
        const index = foundCart.products.indexOf(product);
        foundCart.products.splice(index, 1);
        foundCart.save();
        break;
      }
    }
    res.redirect("/cart");
  });
});

module.exports = router
