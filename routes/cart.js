const express = require("express");
const router = express.Router();

const { auth, isLogedIn } = require('../Midelwares/auth.js');

router.get("/", isLogedIn, auth, (req, res) => {
  res.send("Cart Page");
});

// Cart FUnctionality
router.post("/addToCart", (req, res) => {
  const productID = req.body.addBtn;

  Cart.findOne({userID: req.user.id}, (err, foundCart) => {
    Product.findOne({_id: productID}, (err, foundProduct) => {
      foundCart.products.push(foundProduct);
      foundCart.save();

      console.log(req.session.url);
      res.redirect(`/shop${req.session.url}`);
    });
  });
});

module.exports = router
