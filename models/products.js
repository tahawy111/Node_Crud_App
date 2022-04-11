const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  wholesale: Number,
  deller: Number,
  amount: Number,
  barcode: Number,
  category: String,
});

module.exports = mongoose.model("Product", ProductSchema);
