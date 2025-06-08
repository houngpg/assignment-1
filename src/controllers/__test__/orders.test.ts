import { MongoClient, ServerApiVersion } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { describe, beforeAll, afterAll, afterEach, it, expect, vi } from "vitest";

let con: MongoClient;
let mongoServer: MongoMemoryServer;

describe('Orders Controller', () => {


    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        con = await MongoClient.connect(mongoServer.getUri(), {});
        // Mock the MongoClient and orderCollection
        vi.mock("../../mongo-client", () => ({
            client: new MongoClient(mongoServer.getUri(), {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true
                }
            }),
            orderCollection: con.db(mongoServer.instanceInfo!.dbName).collection('orders'),
        }));
    })

    afterAll(async () => {
        if (con) {
            await con.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    afterEach(async () => {
        const COLLECTIONS = ['orders', 'test'];
        Promise.all(COLLECTIONS.map(c => con.db(mongoServer.instanceInfo!.dbName).collection(c).deleteMany({})));
    })


    it('should connect to the in-memory MongoDB', async () => {
        const db = con.db(mongoServer.instanceInfo!.dbName);

        expect(db).toBeDefined();
        const col = db.collection('test');
        const result = await col.insertMany([{ a: 1 }, { b: 1 }]);
        expect(result.insertedCount).toStrictEqual(2);
        expect(await col.countDocuments({})).toBe(2);

    });


    it('should getAllOrders from the in-memory MongoDB', async () => {
        const db = con.db(mongoServer.instanceInfo!.dbName);
        const col = db.collection('orders');
        await col.insertMany([{ bookID: "fakeBook1", quantity: 5 }, { bookID: "fakeBook2", quantity: 3 }]);

        const { getAllOrders } = await import("../orders");
        const orders = await getAllOrders();
        console.log(orders);

        expect(orders).toBeDefined();
        expect(orders.length).toBeGreaterThanOrEqual(2);
        expect(orders[0].bookID).toBeDefined();

    })

    it('should create an order in the in-memory MongoDB', async () => {
        const db = con.db(mongoServer.instanceInfo!.dbName);
        const col = db.collection('orders');

        const { createOrder } = await import("../orders");
        const order = await createOrder(["fakeBook1"]);

        expect(order).toBeDefined();
        expect(order.length).toBeGreaterThanOrEqual(1);
        expect(order[0].bookID).toBeDefined();
    });
});