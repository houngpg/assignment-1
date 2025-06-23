import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";
const mockConnect = vi.fn();
const mockClose = vi.fn();
const mockFind = vi.fn();
const mockToArray = vi.fn();
const mockMap = vi.fn();

vi.mock("../../mongo-client", () => ({
    client: { connect: mockConnect, close: mockClose },
    collection: { find: mockFind }
}));

beforeEach(() => {
    mockConnect.mockClear();
    mockFind.mockClear();
    mockMap.mockClear();
    mockToArray.mockClear();
    mockFind.mockImplementation(() => ({ map: mockMap, toArray: mockToArray }));
    mockMap.mockImplementation(() => ({ toArray: mockToArray }));
});

describe("getAllBooks", () => {

    it("returns all books when no filters are provided", async () => {
        const books = [{ name: "Book1" }, { name: "Book2" }];
        mockToArray.mockResolvedValueOnce(books);
        const { getAllBooks } = await import("../books");

        const result = await getAllBooks([]);
        expect(mockConnect).toHaveBeenCalled();
        expect(mockFind).toHaveBeenCalledWith({});
        expect(result).toEqual(books);
    });

    it("returns filtered books by price range", async () => {
        const filters = [{ from: "10", to: "20" }];
        const books = [{ name: "Book3", price: 15 }];
        mockToArray.mockResolvedValueOnce(books);
        const { getAllBooks } = await import("../books");

        const result = await getAllBooks(filters);
        expect(mockFind).toHaveBeenCalledWith({ price: { $gte: 10, $lte: 20 } });
        expect(result).toEqual(books);
    });

    it("returns filtered books by author", async () => {
        const filters = [{ author: "Author1" }];
        const books = [{ name: "Book4", author: "Author1" }];
        mockToArray.mockResolvedValueOnce(books);
        const { getAllBooks } = await import("../books");

        const result = await getAllBooks(filters);
        expect(mockFind).toHaveBeenCalledWith({ author: "Author1" });
        expect(result).toEqual(books);
    });

    it("returns filtered books by name", async () => {
        const filters = [{ name: "Book5" }];
        const books = [{ name: "Book5" }];
        mockToArray.mockResolvedValueOnce(books);
        const { getAllBooks } = await import("../books");

        const result = await getAllBooks(filters);
        expect(mockFind).toHaveBeenCalledWith({ name: "Book5" });
        expect(result).toEqual(books);
    });

    it("handles multiple filters and aggregates results", async () => {
        const filters = [
            { author: "Author2" },
            { from: "5", to: "15" }
        ];
        const books1 = [{ name: "Book6", author: "Author2" }];
        const books2 = [{ name: "Book7", price: 10 }];
        mockToArray
            .mockResolvedValueOnce(books1)
            .mockResolvedValueOnce(books2);
        const { getAllBooks } = await import("../books");

        const result = await getAllBooks(filters);
        expect(mockFind).toHaveBeenNthCalledWith(1, { author: "Author2" });
        expect(mockFind).toHaveBeenNthCalledWith(2, { price: { $gte: 5, $lte: 15 } });
        expect(result).toEqual([...books1, ...books2]);
    });
});