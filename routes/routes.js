const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const multer = require("multer");
const fs = require("fs");

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
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) {
      res.redirect("/");
    } else {
      if (product == null) {
        res.redirect("/");
      } else {
        res.render("edit_products", {
          title: "Edit Product",
          product: product,
        });
      }
    }
  });
});

router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  Product.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      image: new_image,
      price: req.body.price,
      amount: req.body.amount,
      wholesale: req.body.wholesale,
      deller: req.body.deller,
      barcode: req.body.barcode,
      category: req.body.category,
    },
    (err, result) => {
      if (err) {
        result.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "Product Updated Successfully",
        };
        res.redirect("/");
      }
    }
  );
});

// Delete Product Route

router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  Product.findByIdAndRemove(id, (err, result) => {
    if (req.image != "") {
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "Product Deleted Successfully",
      };
      res.redirect("/");
    }
  });
});

module.exports = router;
