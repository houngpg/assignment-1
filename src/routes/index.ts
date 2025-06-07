import Router from 'koa-router';
import ordersRouter from './orders';


const router = new Router();



router.use('/orders', ordersRouter.routes(), ordersRouter.allowedMethods());


export default router;