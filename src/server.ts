import Koa from "koa";
import bodyParser from "koa-bodyparser";
import qs from "koa-qs";
import routes from "./routes";
import router from './routes/index';
import { RegisterRoutes } from "../build/routes";

const app = new Koa();
qs(app);

RegisterRoutes(router);

app.use(bodyParser());
app.use(routes.allowedMethods());
app.use(routes.routes());

app.use(router.allowedMethods());
app.use(router.routes());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
