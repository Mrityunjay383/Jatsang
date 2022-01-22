const express = require("express");
const router = express.Router();
const qr = require("qrcode");

const { auth, isLogedIn } = require('../Midelwares/auth.js');

const Shop = require("../models/shop");
const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");



router.get("/Dashboard", isLogedIn, auth, (req, res) => {

  Shop.findOne({ownerID: req.user._id}, (err, foundShop) => {
    if(err){
      res.redirect("/");
    }else{

      if(foundShop === undefined || foundShop == null || foundShop.length <= 0){
        res.redirect("/");
      }else{
        req.session.owwnerShopID = foundShop._id;

        const host = req.get("host");
        const address = `https://${host}/shop/${foundShop._id}`;

        qr.toDataURL(address, (err, src) => {
          if (err) res.send("Error occured");

          Product.find({ownerID: req.user._id}, (err, foundProducts) => {
            res.render("shopDashboard", {isLogedIn: req.isLogedIn,
              isShopOwner: req.user.isShopOwner,
              shopDetails: foundShop,
              products: foundProducts,
              qrsrc:src
            });
          });
        });

      }

    }

  });


});

router.get("/addproduct",  auth, (req, res) => {
  res.render('addproducts', {isLogedIn: req.isLogedIn,
    isShopOwner: req.user.isShopOwner
  });
});

router.get("/orders", isLogedIn, auth, (req, res) => {
  Order.find({shopID: req.session.owwnerShopID}, (err, foundOrders) => {
    res.render("dashOrders", {isLogedIn: req.isLogedIn,
      isShopOwner: req.user.isShopOwner,
      orders: foundOrders
    })
  });
});

// Product FUnctionalities
router.post("/addproduct",  auth, (req, res) => {
  const newProduct = new Product({
    ownerID: req.user._id,
    title: req.body.title,
    des: req.body.des,
    price: Number(req.body.price),
    currStock: Number(req.body.stock)
  });

  newProduct.save();
  res.redirect("/shop/dashboard");

});

router.post("/delProduct",  auth, async (req, res) => {
  const productID = req.body.delBtn;

  await Product.deleteOne({ _id: productID });
  res.redirect("/shop/dashboard");

});

router.post("/updStock",  auth, async (req, res) => {
  const productID = req.body.updStockBtn;
  const updStockVal = Number(req.body.updStockVal);

  Product.findOne({_id: productID}, (err, foundProduct) => {
    foundProduct.currStock = updStockVal;
    foundProduct.save();
    res.redirect("/shop/dashboard");
  });

});

router.get("/:shopCode", isLogedIn, auth, (req, res) => {

  const shopCode = req.params.shopCode;
  req.session.url = req.url;

  Shop.findOne({_id: shopCode}, (err, foundShop) => {
    req.session.lastShopID = foundShop._id;
    Product.find({ownerID: foundShop.ownerID}, (err, foundProducts) => {
      res.render("indiShop", {isLogedIn: req.isLogedIn,
        isShopOwner: req.user.isShopOwner,
        shopDetails: foundShop,
        products: foundProducts
      })
    });
  });

});

module.exports = router
