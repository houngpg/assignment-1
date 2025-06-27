import { Controller, Get, Path, Route, Request } from "tsoa";
import { type ParameterizedContext, type DefaultContext, type Request as KoaRequest } from 'koa'

import { getAllOrders } from '../controllers/orders'; // Import the controller function to get all orders
import { BookID } from '../constants/bookTypes';
const srcPrefix = 'src.routes';

@Route('orders')
export class OrderRoutes extends Controller {
    @Get()
    public async getOrders(@Request() request: KoaRequest) {
        const ctx: ParameterizedContext<AppOrderDatabaseState, DefaultContext> = request.ctx;
        const data = ctx.state.order

        try {

            const orders = await getAllOrders();

            if (!orders) {
                ctx.status = 200
                ctx.body = []
            }

            const resultArr = []
            for (let i = 0; i < orders.length; i++) {
                const orderBooks = orders[i].books;
                const obj: any = { orderId: orders[i]._id.toHexString() };
                const books: Record<BookID, number> = {};
                for (let j = 0; j < orderBooks.length; j++) {
                    const idx: BookID = orderBooks[j].bookId.toHexString();
                    books[idx] = orderBooks[j].quantity;
                }

                resultArr.push({ ...obj, books })
            }

            ctx.status = 200;
            ctx.body = resultArr;

        } catch (err) {
            console.error('Error fetching orders:', { err, src: `${srcPrefix}.orders.get` });

            ctx.status = 500;
            ctx.body = { error: 'Internal Server Error' };
        }

    }




}