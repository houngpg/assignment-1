import Router from 'koa-router';
import adapter from '../adapter';
import { client, collection } from "../src/mongo-client";
import { ObjectId } from 'mongodb';

const router = new Router();

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

router.get('/books', async (ctx) => {
    const filters = ctx.query.filters as Array<{ from?: number, to?: number }>;
    // Added validation to filters
    if (!validateFilters(filters)) {
        ctx.status = 400;
        ctx.body = { error: `Bad request.` };
    }
    try {
        const books = await adapter.listBooks(filters);
        ctx.body = books;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Failed to fetch books due to: ${error}` };
    }
});

// Create or update books
router.post('/books', async (ctx) => {
    const book: any = ctx.request.body;
    if (!book.name || !book.author || !book.description || !book.price || !book.image) {
        ctx.status = 400;
    }
    try {
        await client.connect();
        let result
        if (!book.id) {
            result = await collection.insertOne(book)
        }
        else {
            const replacementDocument = {
                ...book,
                id: book.id
            }
            result = await collection.replaceOne({ _id: { $eq: ObjectId.createFromHexString(book.id) } }, replacementDocument)
        }
        await client.close();
        ctx.status = 201;
        ctx.body = result.id;
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: `Failed to create/update book.` }
    }
});

// Delete book by ID
router.delete('/books/:id', async (ctx) => {
    const id = ctx.params.id;
    if (!id) {
        ctx.status = 400;
    }
    try {
        await client.connect();
        const bookId = ObjectId.createFromHexString(id)
        const deleteByID = {
            _id: { $eq: bookId }
        }
        const deletedBook = await collection.deleteOne(deleteByID);
        if (deletedBook.deletedCount === 0) {
            throw new Error("Failed to delete book.")
        }
        await client.close();
        ctx.status = 204;
    } catch (error) {
        ctx.status = 500;
        console.log(error)
        ctx.body = { error: `Failed to delete book.` };
    }
});

function validateFilters(filters: any): boolean {
    // Check if filters exist and are an array
    if (!filters || !Array.isArray(filters)) {
        return false;
    }

    // Check each filter object in the array
    return filters.every(filter => {
        const from = parseFloat(filter.from);
        const to = parseFloat(filter.to);

        // Validate that 'from' and 'to' are numbers
        if (isNaN(from) || isNaN(to)) {
            return false;
        }

        // Validate that 'from' is less than or equal to 'to'
        return from <= to;
    });
}


export default router;
