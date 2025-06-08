import { client, shelfCollection } from "../mongo-client";
import { BookID } from "../constants/bookTypes";
import { ShelfId } from "../constants/warehouseTypes";
import { ObjectId } from "mongodb";

const createOrUpdateBookStock = async (bookId: BookID, numberOfBooks: number, shelf: ShelfId) => {
    await client.connect();

    const bookStock = {
        bookId: bookId,
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

    const bookOnShelf = await shelfCollection.findOne({ bookId: bookId });

    await client.close();

    if (!bookOnShelf) {
        return [];
    }

    return [{
        shelf: bookOnShelf._id.toHexString(),
        quantity: bookOnShelf.quantity,
    }];
}



export { createOrUpdateBookStock, findBookOnShelf };