import { MongoClient, ServerApiVersion } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { describe, beforeAll, afterAll, afterEach, it, expect, vi } from "vitest";

let con: MongoClient;
let mongoServer: MongoMemoryServer;


describe('Warehouse Controller', () => {

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        con = await MongoClient.connect(mongoServer.getUri(), {});
        // Mock the MongoClient and shelfCollection
        vi.mock("../../mongo-client", () => ({
            client: new MongoClient(mongoServer.getUri(), {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true
                }
            }),
            shelfCollection: con.db(mongoServer.instanceInfo!.dbName).collection('shelves'),
        }));
    });

    afterAll(async () => {
        if (con) {
            await con.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    afterEach(async () => {
        const COLLECTIONS = ['shelves', 'test'];
        Promise.all(COLLECTIONS.map(c => con.db(mongoServer.instanceInfo!.dbName).collection(c).deleteMany({})));
    });

    it('should connect to the in-memory MongoDB', async () => {
        const db = con.db(mongoServer.instanceInfo!.dbName);
        expect(db).toBeDefined();
        const col = db.collection('test');
        const result = await col.insertMany([{ a: 1 }, { b: 1 }]);
        expect(result.insertedCount).toStrictEqual(2);
        expect(await col.countDocuments({})).toBe(2);
    });

    it('should create book stock in memory when shipment arrives', async () => {
        const db = con.db(mongoServer.instanceInfo!.dbName);
        const col = db.collection('shelves');
        const { createOrUpdateBookStock } = await import("../warehouse");


        const result = await createOrUpdateBookStock("fakeBookId1", 4, "553f8a4286f5c759f36f8e5b");
        expect(result).toBeDefined();
        expect(result).toBe("553f8a4286f5c759f36f8e5b");
        expect(await col.countDocuments({})).toBe(1);
    });

});