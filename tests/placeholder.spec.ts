import { hooker } from './serverhelper'
import { DefaultApi, Configuration } from '../client'
import { it, expect, beforeAll, beforeEach, afterEach, describe } from 'vitest'
import { startServer } from '../src/launcher';
let client: any;

let server: any;
let address: any;

beforeEach(async () => {
    server = await startServer();
    address = server.address();
    // close = server.close();

    client = new DefaultApi(new Configuration({ basePath: `http://localhost:${address.port}` }))
})

afterEach(async () => {
    await server.close()
})


describe("PLACEHOLDER TESTS", () => {
    it('should return a hello', async () => {
        // const client = new DefaultApi(new Configuration({ basePath: `http://localhost:${address.port}` }))
        const response = await client.getGreeting({ name: 'World' })
        expect(response).toBe('Hello, World!')
    })
})