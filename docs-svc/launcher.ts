import { Server, IncomingMessage, ServerResponse } from 'http';
import { app } from './app';

export async function startServer(PORT: number = 0): Promise<Server<typeof IncomingMessage, typeof ServerResponse>> {
    return app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    })
}