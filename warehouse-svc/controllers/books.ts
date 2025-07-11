import { client, collection } from "../../shared-utils/mongo-client";
import { ObjectId } from "mongodb";
import { BookID, Book, Filter } from "../constants/bookTypes"

const getAllBooks = async (filters: Array<Filter>) => {
    await client.connect();

    let books = [] as Array<Book>;
    if (!filters || filters.length === 0) {
        return await collection.find({}).toArray();
    }

    for (const filter of filters) {
        const query = {} as {
            price: { $gte?: number; $lte?: number };
            author: string;
            name: string;
        };
        const price = {} as { $gte?: number; $lte?: number };
        // Checks if the price from and to are valid, then adds it to the query
        if (filter.from) {
            price["$gte"] = parseFloat(filter.from);
        }
        if (filter.to) {
            price["$lte"] = parseFloat(filter.to);
        }
        if (Object.keys(price).length !== 0) {
            query.price = price;
        }
        // Adds author and name to query
        if (filter.author) {
            query.author = filter.author;
        }
        if (filter.name) {
            query.name = filter.name;
        }

        const result = await collection
            .find(query)
            .map((doc) => {
                const book: Book = {
                    id: doc._id.toHexString(),
                    name: doc.name,
                    image: doc.image,
                    price: doc.price,
                    author: doc.author,
                    description: doc.description
                };
                return book;
            })
            .toArray();
        books = [...books, ...result];
    }
    await client.close();
    return books;
}

const getBookById = async (id: BookID) => {
    await client.connect();
    const bookId = ObjectId.createFromHexString(id);
    const book = await collection.find({ _id: { $eq: bookId } }).toArray();

    await client.close();
    return book;
}


const createOrUpdateBook = async (book: Book) => {
    await client.connect();
    let result;
    if (!book.id) {
        // condition where we are creating a book
        result = await collection.insertOne(book);
    } else {
        // condition where we are updating a book
        const replacementDocument = {
            ...book,
            id: book.id,
        };
        result = await collection.replaceOne(
            { _id: { $eq: ObjectId.createFromHexString(book.id) } },
            replacementDocument,
        );
    }
    await client.close();
    return result;
}

const deleteBook = async (id: BookID) => {
    await client.connect();
    const bookId = ObjectId.createFromHexString(id);
    const deleteByID = {
        _id: { $eq: bookId },
    };
    const deletedBook = await collection.deleteOne(deleteByID);
    if (deletedBook.deletedCount === 0) {
        throw new Error("Failed to delete book.");
    }
    await client.close();
}


export { getAllBooks, createOrUpdateBook, deleteBook, getBookById };