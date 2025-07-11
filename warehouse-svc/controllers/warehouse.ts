import { client, shelfCollection, orderCollection } from "../../shared-utils/mongo-client";
import { BookID } from "../constants/bookTypes";
import { ShelfId, OrderId } from "../constants/warehouseTypes";
import { ObjectId } from "mongodb";
import amqp from 'amqplib/callback_api';

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

const sendMessage = (message: string) => {
    amqp.connect('amqp://rabbitmq:5672', function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            const queue = 'fulfill_order_queue';

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(message));
            console.log(" [x] Sent %s", message);
        });
        setTimeout(function () {
            connection.close();
        }, 500);
    });
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

    sendMessage(JSON.stringify({
        orderId: orderId,
        fulfilled: true
    }))

    await client.close()

}


export { createOrUpdateBookStock, findBookOnShelf, fulfillOrder };