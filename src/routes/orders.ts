import Router from 'koa-router';
import { BookID } from '../constants/bookTypes';

import { getAllOrders, orderBooks } from '../controllers/orders'; // Import the controller function to get all orders

const router = new Router();

const srcPrefix = 'src.routes';


// Define a route for getting orders
router.get('/', async (ctx) => {
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
});

router.post('/', async (ctx) => {
    try {
        const order: any = ctx.request.body;
        const orderId = await orderBooks(order.books);
        ctx.status = 200;
        ctx.body = { orderId };
    } catch (err) {
        console.error('Error creating order:', { err, src: `${srcPrefix}.orders.post` });
        ctx.status = 500;
        ctx.body = { error: 'Internal Server Error' };
    }
});


export default router;