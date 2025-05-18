import assignment1 from "./assignment-1";

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{ from?: number, to?: number }>): Promise<Book[]> {
    return assignment1.listBooks(filters);
};

async function createOrUpdateBook(book: Book): Promise<BookID> {
    // API request for creating or updating a book
    let result = await fetch('http://localhost:3000/books', {
        method: "POST",
        body: JSON.stringify(book),
        headers: {
            "Content-Type": "application/json"
        }
    });
    // Response handling for the request
    if (result.ok) {
        let res = await result.json() as { id: BookID };
        return res.id;
    }
    // Error handling
    else {
        throw new Error("Failed to create/update book.")
    }
};

async function removeBook(book: BookID): Promise<void> {
    // API request for deleting a book
    let result = await fetch('http://localhost:3000/books/${book}', {
        method: "DELETE"
    });
    // Error handling for the request (Error)
    if (!result.ok) {
        throw new Error("Failed to delete book.")
    }
};

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};