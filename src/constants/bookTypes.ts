export type BookID = string;

export interface Book {
    id?: BookID;
    name: string;
    author: string;
    description: string;
    price: number;
    image: string;
}

export type Filter = {
    from?: string;
    to?: string;
    author?: string;
    name?: string;
}