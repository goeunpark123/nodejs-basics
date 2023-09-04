const MongoClient = require("mongodb").MongoClient;
//password: 7dnNvfFyvD5EK1Rc
const url =
  "mongodb+srv://goeunpark21:7dnNvfFyvD5EK1Rc@cluster0.au2vqpa.mongodb.net/products?retryWrites=true&w=majority";

const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price,
  };

  const client = new MongoClient(url);

  try {
    await client.connect();

    const db = client.db();
    const result = db.collection("products").insertOne(newProduct);
  } catch (error) {
    return res.json({ message: "Fail to store data." });
  }

  res.json(newProduct);
};

const getProducts = async (req, res, next) => {
  const client = new MongoClient(url);
  let products;

  try {
    await client.connect();

    const db = client.db();
    products = await db.collection("products").find().toArray();
  } catch (error) {
    return res.json({ message: "Fail to load data." });
  }

  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
