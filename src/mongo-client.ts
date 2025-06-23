import { MongoClient, ServerApiVersion } from "mongodb";
const uri = "mongodb://mongodb";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const database = client.db("bookstore");
const collection = database.collection("books");
const orderCollection = database.collection("orders");
const shelfCollection = database.collection("shelves");

export { database, collection, orderCollection, shelfCollection, client };
