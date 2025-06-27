import { beforeEach, afterEach } from 'vitest'
import { startServer } from '../src/launcher'
import { AddressInfo } from 'node:net'

type Close = () => void

export type Hooker = {
    address: string | AddressInfo | null
    close: Close
}

export async function hooker() {
    let server: any;
    let address: any;

    await beforeEach(async (context) => {
        server = await startServer();
        address = server.address();
    })

    await afterEach(async (context) => {
        await server.close()
    })


    return address
}
