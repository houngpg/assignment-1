import Router from 'koa-router';
import ordersRouter from './orders';
import warehouseRouter from './warehouse';

const router = new Router();

router.use('/orders', ordersRouter.routes(), ordersRouter.allowedMethods());
router.use('/warehouse', warehouseRouter.routes(), warehouseRouter.allowedMethods());

export default router;