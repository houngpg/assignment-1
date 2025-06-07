import Router from "koa-router";
import { getAllBooks, createOrUpdateBook, deleteBook } from "./controllers/books";

const router = new Router();

router.get("/books", async (ctx) => {
  // Added querying for author and book title (name)
  const filters = ctx.query.filters as Array<{
    from?: string;
    to?: string;
    author?: string;
    name?: string;
  }>;

  // Added validation to filters
  if (!validateFilters(filters)) {
    ctx.status = 400;
    ctx.body = { error: `Bad request.` };
  }

  try {
    const result = await getAllBooks(filters)
    ctx.body = result
    // Moved to ./controllers/books.ts
    // await client.connect();

    // let books = [] as Array<Book>;
    // if (!filters || filters.length === 0) {
    //   ctx.body = await collection.find({}).toArray();
    //   return;
    // }

    // for (const filter of filters) {
    //   const query = {} as {
    //     price: { $gte?: number; $lte?: number };
    //     author: string;
    //     name: string;
    //   };
    //   const price = {} as { $gte?: number; $lte?: number };
    //   // Checks if the price from and to are valid, then adds it to the query
    //   if (filter.from) {
    //     price["$gte"] = parseFloat(filter.from);
    //   }
    //   if (filter.to) {
    //     price["$lte"] = parseFloat(filter.to);
    //   }
    //   if (Object.keys(price).length !== 0) {
    //     query.price = price;
    //   }
    //   // Adds author and name to query
    //   if (filter.author) {
    //     query.author = filter.author;
    //   }
    //   if (filter.name) {
    //     query.name = filter.name;
    //   }
    //   console.log(query);

    //   const result = await collection
    //     .find(query)
    //     .map((doc) => {
    //       const book: Book = {
    //         id: doc._id.toHexString(),
    //         name: doc.name,
    //         image: doc.image,
    //         price: doc.price,
    //         author: doc.author,
    //         description: doc.description,
    //       };
    //       return book;
    //     })
    //     .toArray();
    //   books = [...books, ...result];
    // }

    // await client.close();
    // ctx.body = books;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: `Failed to fetch books due to: ${error}` };
  }
});

// Create or update books
router.post("/books", async (ctx) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const book: any = ctx.request.body;
  if (
    !book.name ||
    !book.author ||
    !book.description ||
    !book.price ||
    !book.image
  ) {
    ctx.status = 400;
  }
  try {
    const result = await createOrUpdateBook(book);
    // Moved to ./controllers/books.ts
    // await client.connect();
    // let result;
    // if (!book.id) {
    //   result = await collection.insertOne(book);
    // } else {
    //   const replacementDocument = {
    //     ...book,
    //     id: book.id,
    //   };
    //   result = await collection.replaceOne(
    //     { _id: { $eq: ObjectId.createFromHexString(book.id) } },
    //     replacementDocument,
    //   );
    // }
    // await client.close();
    ctx.status = 201;
    ctx.body = `Book created/updated: ${result}`;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    ctx.body = { error: `Failed to create/update book.` };
  }
});

// Delete book by ID
router.delete("/books/:id", async (ctx) => {
  const id = ctx.params.id;
  if (!id) {
    ctx.status = 400;
  }
  try {
    await deleteBook(id);
    // Moved to ./controllers/books.ts

    // await client.connect();
    // const bookId = ObjectId.createFromHexString(id);
    // const deleteByID = {
    //   _id: { $eq: bookId },
    // };
    // const deletedBook = await collection.deleteOne(deleteByID);
    // if (deletedBook.deletedCount === 0) {
    //   throw new Error("Failed to delete book.");
    // }
    // await client.close();
    ctx.status = 204;
  } catch (error) {
    ctx.status = 500;
    console.log(error);
    ctx.body = { error: `Failed to delete book.` };
  }
});

/* eslint-disable @typescript-eslint/no-explicit-any */
function validateFilters(filters: any): boolean {
  // Check if filters exist and are an array
  if (!filters || !Array.isArray(filters)) {
    return false;
  }

  // Check each filter object in the array
  return filters.every((filter) => {
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
