const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER, process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.j32tjfb.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const dbConnect = async () => {
  try {
    await client.connect();
    console.log('Database Connected!');
  } catch (error) {
    console.log(error.name, error.message);
  }
};
dbConnect();
const productCollection = client.db('productDB').collection('product');
const cartCollection = client.db('productDB').collection('cart');

app.get('/', (req, res) => {
  res.send('TechNest server is LOL!');
});

app.get('/products', async (req, res) => {
  const cursor = productCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productCollection.findOne(query);
  res.send(result);
});

app.post('/products', async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  const result = await productCollection.insertOne(newProduct);
  res.send(result);
});

app.put('/products/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updatedProduct = req.body;
  const product = {
    $set: {
      name: updatedProduct.name,
      brand: updatedProduct.brand,
      type: updatedProduct.type,
      price: updatedProduct.price,
      rating: updatedProduct.rating,
      image: updatedProduct.image,
    },
  };
  const result = await productCollection.updateOne(filter, product, options);
  res.send(result);
});

// cart related apis
app.post('/cart', async (req, res) => {
  const cart = req.body;
  console.log(cart);
  const result = await cartCollection.insertOne(cart);
  res.send(result);
});

app.listen(port, () => {
  console.log(`TechNest is running on port:${port}`);
});
