import { ObjectId } from "mongodb";
import { BookID } from "../constants/bookTypes";
import { client, orderCollection } from "../../shared-utils/mongo-client";


const getAllOrders = async () => {
    await client.connect();

    const result = await orderCollection.find({}).toArray();

    await client.close();
    return result;
}

const orderBooks = async (order: BookID[]) => {
    await client.connect();
    const bookIds = order.map(id => ObjectId.createFromHexString(id));

    const books = [];
    for (let i = 0; i < bookIds.length; i++) {
        books.push({ bookId: bookIds[i], quantity: 1 })
    }

    const orders = await orderCollection.insertOne({ books: books });
    await client.close();

    return orders.insertedId.toHexString();

};

export { getAllOrders, orderBooks }