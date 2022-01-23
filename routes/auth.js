const express = require("express");
const router = express.Router();
const session = require('express-session');
const passport = require('passport');

const { auth, isLogedIn } = require('../Midelwares/auth.js');

const User = require("../models/user");
const Shop = require("../models/shop");
const Cart = require("../models/cart");

router.get("/",isLogedIn, (req, res) => {

    res.render("register");
});


router.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, (err) => {
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, () => {
          res.redirect("/");
      });
    }
  });
});

router.post("/register", (req, res) => {

  const reqUser = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    isShopOwner: (req.body.type == 'on')? true : false
  }

  User.register({username: reqUser.username}, reqUser.password, (err, user) => {
    if(err){
      console.log(err);
      res.redirect("/auth");
    }else{
      user.name = reqUser.name;
      user.isShopOwner = reqUser.isShopOwner;
      user.save();

      if(reqUser.isShopOwner){
        const newShop = new Shop({
          ownerID: user._id,
          ownerName: user.name,
          shopName: req.body.shopName,
          locatedAt: req.body.locatedAt,
        });

        newShop.save();
      }else{
        const newCart = new Cart({
          userID: user._id,
          index: 0,
          product: []
        });
        newCart.save();
      }

      passport.authenticate("local")(req, res, () => {
          res.redirect("/");
      });
    }
  });
});

module.exports = router;
