const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const multer = require("multer");

// Image upload
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("image");

// Insert Product Into Database Route
router.post("/add", upload, (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    image: req.file.filename,
    price: req.body.price,
    amount: req.body.amount,
    wholesale: req.body.wholesale,
    deller: req.body.deller,
    barcode: req.body.barcode,
    category: req.body.category,
  });
  product.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "Product Added Successfully!",
      };
      res.redirect("/");
    }
  });
});

// Get all products route
router.get("/", (req, res) => {
  Product.find().exec((err, products) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("index", {
        title: "Home",
        products: products,
      });
    }
  });
});
router.get("/add", (req, res) => {
  res.render("add_products", {
    title: "Add Products",
  });
});

module.exports = router;
