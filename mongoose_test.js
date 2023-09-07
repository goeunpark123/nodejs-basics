const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect(
    "mongodb+srv://goeunpark21:7dnNvfFyvD5EK1Rc@cluster0.au2vqpa.mongodb.net/products?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Fail to connect!");
  });

const createProduct = async (req, res, next) => {
  const createProduct = new Product({
    name: req.body.name,
    price: req.body.price,
  });

  const result = await createProduct.save();

  res.json(result);
};

const getProducts = async (req, res, next) => {
  const products = await Product.find().exec();

  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
