import previous_assignment from "./assignment-2";

export type BookID = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
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

  return (await result.json()) as Book[];
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book);
}

async function removeBook(book: BookID): Promise<void> {
  await previous_assignment.removeBook(book);
}

const assignment = "assignment-3";

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
};
