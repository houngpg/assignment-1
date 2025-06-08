import previous_assignment from "./assignment-3";

export type BookID = string;

export interface Book {
    id?: BookID;
    name: string;
    author: string;
    description: string;
    price: number;
    image: string;
    stock?: number;
}

export interface Filter {
    from?: number;
    to?: number;
    name?: string;
    author?: string;
}

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters?: Filter[]): Promise<Book[]> {
    let result;
    if (!filters || filters.length === 0) {
        result = await fetch(`http://localhost:3000/books`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return (await result.json()) as Book[];
    }

    // Filters through each filters then joins as queryString
    let queryArray = [] as Array<string>;
    let count = 0;
    for (const filter of filters) {
        if (filter.from) {
            queryArray = [...queryArray, `filters[${count}][from]=${filter.from}`];
        }
        if (filter.to) {
            queryArray = [...queryArray, `filters[${count}][to]=${filter.to}`];
        }
        if (filter.author) {
            queryArray = [
                ...queryArray,
                `filters[${count}][author]=${filter.author}`,
            ];
        }
        if (filter.name) {
            queryArray = [...queryArray, `filters[${count}][name]=${filter.name}`];
        }
        count++;
    }
    const queryString = queryArray.join("&");

    result = await fetch(`http://localhost:3000/books?${queryString}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const books = (await result.json()) as Book[];

    console.log(books)

    const booksWithStock: Book[] = [];
    for (let i = 0; i < books.length; i++) {
        const id: BookID = books[i].id;
        const bookOnShelf = await findBookOnShelf(id);
        booksWithStock.push({ ...books[i], stock: bookOnShelf[0].count })
    }


    return booksWithStock;
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    return await previous_assignment.createOrUpdateBook(book);
}

async function removeBook(book: BookID): Promise<void> {
    await previous_assignment.removeBook(book);
}

async function lookupBookById(book: BookID): Promise<Book> {
    const result = await fetch(`http://localhost:3000/books/${book}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (result.ok) {
        const res = (await result.json()) as Book;
        return res;
    } else {
        throw new Error("Failed to find book.");
    }
}

export type ShelfId = string;
export type OrderId = string;

async function placeBooksOnShelf(
    bookId: BookID,
    numberOfBooks: number,
    shelf: ShelfId,
): Promise<void> {
    await fetch(`http://localhost:3000/books`, {
        method: "POST",
        body: JSON.stringify({
            bookId,
            numberOfBooks,
            shelf,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
}

async function orderBooks(order: BookID[]): Promise<{ orderId: OrderId }> {
    const result = await fetch(`http://localhost:3000/orders`, {
        method: "POST",
        body: JSON.stringify({ books: order }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (result.ok) {
        const res = (await result.json()) as { orderId: OrderId };
        return res;
    } else {
        throw new Error("Failed to place order.");
    }
}

async function findBookOnShelf(
    book: BookID,
): Promise<Array<{ shelf: ShelfId; count: number }>> {
    const foundBook = await fetch(`http://localhost:3000/shelves/${book}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    if (foundBook.ok) {
        const res = (await foundBook.json()) as Array<{
            shelf: ShelfId;
            count: number;
        }>;
        return res;
    } else {
        throw new Error("Failed to find book on shelf.");
    }
}

async function fulfilOrder(
    order: OrderId,
    booksFulfilled: Array<{
        book: BookID;
        shelf: ShelfId;
        numberOfBooks: number;
    }>,
): Promise<void> {

    throw new Error("Todo");
}

async function listOrders(): Promise<
    Array<{ orderId: OrderId; books: Record<BookID, number> }>
> {
    const result = await fetch(`http://localhost:3000/orders`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (result.ok) {
        const res = (await result.json()) as Array<{
            orderId: OrderId;
            books: Record<BookID, number>;
        }>;
        return res;
    } else {
        throw new Error("Failed to list orders.");
    }

}

// [
//     {
//         orderId: "order-1",
//         book1: {
//             numberOfBooks: 2,
//         }
//         book2: {
//             numberOfBooks: 1,
//         }
//     }, {
//         orderId: "order-2",
//         book1: {
//             numberOfBooks: 1,
//         }
//         book2: {
//             numberOfBooks: 3,
//         }
// ]


const assignment = "assignment-4";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks,
    placeBooksOnShelf,
    orderBooks,
    findBookOnShelf,
    fulfilOrder,
    listOrders,
    lookupBookById,
};
