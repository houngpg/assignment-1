import { client, shelfCollection, orderCollection } from "../mongo-client";
import { BookID } from "../constants/bookTypes";
import { ShelfId, OrderId } from "../constants/warehouseTypes";
import { ObjectId } from "mongodb";

const createOrUpdateBookStock = async (bookId: BookID, numberOfBooks: number, shelf: ShelfId) => {
    await client.connect();

    const bookStock = {
        bookId: ObjectId.createFromHexString(bookId),
        quantity: numberOfBooks,
    };

    const result = await shelfCollection.updateOne(
        { _id: ObjectId.createFromHexString(shelf) },
        { $set: bookStock },
        { upsert: true }
    );

    await client.close();
    return result.upsertedId ? result.upsertedId.toHexString() : shelf;

}

const findBookOnShelf = async (bookId: BookID) => {
    await client.connect();

    const bookOnShelf = await shelfCollection.find({ bookId: ObjectId.createFromHexString(bookId) }).toArray();
    console.log(bookOnShelf)

    await client.close();

    if (!bookOnShelf) {
        return [];
    }

    return [{
        shelf: bookOnShelf[0]._id.toHexString(),
        quantity: bookOnShelf[0].quantity,
    }];
}


const fulfillOrder = async (fulfillBody: Array<{
    book: BookID;
    shelf: ShelfId;
    numberOfBooks: number;
}>, orderId: OrderId) => {

    await client.connect();


    // loop through fulfillBody 
    for (const fulfillment of fulfillBody) {
        const shelfId = ObjectId.createFromHexString(fulfillment.shelf.trim())
        const bookId = ObjectId.createFromHexString(fulfillment.book.trim())

        console.log(shelfId)
        console.log(bookId)
        const bookOnShelf = await shelfCollection.find(
            {
                _id: shelfId,
                bookId: bookId
            }
        ).toArray()

        console.log(bookOnShelf)
        await shelfCollection.updateOne({
            _id: { $eq: shelfId },
            bookId: bookId
        }, {
            $set: { bookId: bookId, quantity: bookOnShelf[0].quantity - fulfillment.numberOfBooks }
        }, { upsert: true })

    }

    await orderCollection.updateOne(
        { _id: { $eq: ObjectId.createFromHexString(orderId.trim()) } },
        { $set: { fulfilled: true } }
    )

    await client.close()

}


export { createOrUpdateBookStock, findBookOnShelf, fulfillOrder };