import Koa from "koa";
import bodyParser from "koa-bodyparser";
import qs from "koa-qs";
import routes from "./routes";
import router from './routes/index';

const app = new Koa();
qs(app);

app.use(bodyParser());
app.use(routes.allowedMethods());
app.use(routes.routes());

// register the orders routes
app.use(router.allowedMethods());
app.use(router.routes());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
