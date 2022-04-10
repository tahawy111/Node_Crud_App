const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: String,
  price: String,
  wholesale: String,
  deller: String,
  barcode: String,
  category: String,
  image: String,
  created: Date.now(),
});

module.exports = mongoose.model("Product", ProductSchema);
