const express = require("express");
const router = express.Router();
const qr = require("qrcode");

const { auth, isLogedIn } = require('../Midelwares/auth.js');

const Shop = require("../models/shop");
const User = require("../models/user");
const Product = require("../models/product");


router.get("/Dashboard", isLogedIn, auth, (req, res) => {


  Shop.findOne({ownerID: req.user._id}, (err, foundShop) => {
    if(err){
      res.redirect("/");
    }else{

      if(foundShop === undefined || foundShop == null || foundShop.length <= 0){
        res.redirect("/");
      }else{

        const host = req.get("host");
        const address = `https://${host}/shop/${foundShop._id}`;

        qr.toDataURL(address, (err, src) => {
          if (err) res.send("Error occured");

          res.render("shopDashboard", {isLogedIn: req.isLogedIn,
            isShopOwner: req.user.isShopOwner,
            shopDetails: foundShop,
            qrsrc:src
          });
        });

      }

    }

  });


});

router.get("/addproduct", (req, res) => {
  res.render('addproducts', {isLogedIn: req.isLogedIn,
    isShopOwner: req.user.isShopOwner
  });
});

// Product FUnctionalities
router.post("/addproduct", (req, res) => {
  const newProduct = new Product({
    adminID: req.user._id,
    title: req.body.title,
    des: req.body.des,
    price: Number(req.body.price),
    currStock: Number(req.body.stock)
  });

  newProduct.save();
  res.redirect("/shop/dashboard");

});

router.post("/delProduct", (req, res) => {
  const productIndex = req.body.delBtn;

  Shop.findOne({ownerID: req.user._id}, (err, foundShop) => {

    if(err){
      res.redirect("/shop/dashboard");
    }else{

      if(foundShop === undefined || foundShop == null || foundShop.length <= 0){
        res.redirect("/shop/dashboard");
      }else{

        foundShop.products.splice(productIndex, 1);
        foundShop.save();
        res.redirect("/shop/dashboard");

      }

    }

  });

});

router.post("/updStock", async (req, res) => {
  const productIndex = req.body.updStockBtn;
  const updStockVal = Number(req.body.updStockVal);

  await Shop.update(
     {
       ownerID: req.user._id,
     },
     { $set: { `products[${productIndex}].$.currStock` : updStockVal } }
  );
  res.redirect("/shop/dashboard");

  // Shop.findOne({ownerID: req.user._id}, (err, foundShop) => {
  //
  //   if(err){
  //     res.redirect("/shop/dashboard");
  //   }else{
  //
  //     if(foundShop === undefined || foundShop == null || foundShop.length <= 0){
  //       res.redirect("/shop/dashboard");
  //     }else{
  //
  //       console.log(foundShop.products[productIndex]);
  //
  //       foundShop.products[productIndex]["currStock"] = Number(updStockVal);
  //       foundShop.save((err) => {
  //         if(err){
  //           console.log(err);
  //         }else{
  //           res.redirect("/");
  //           console.log(foundShop.products[productIndex]);
  //           foundShop.markModified('products');
  //         }
  //
  //       });
  //     }
  //
  //   }
  //
  // });

});

router.get("/:shopCode", isLogedIn, auth, (req, res) => {
  res.send(`Shop Code: ${req.params.shopCode}`);
});

module.exports = router
