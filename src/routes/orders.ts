import Router from 'koa-router';

const router = new Router();


// Define a route for getting orders
router.get('/', async (ctx) => {
    // Simulate fetching orders from a database
    const orders = [
        { id: 1, item: 'Laptop', quantity: 1 },
        { id: 2, item: 'Phone', quantity: 2 },
    ];

    // Respond with the orders
    ctx.body = {
        success: true,
        data: orders,
    };
});



export default router;