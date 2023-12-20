import routes from "./routes/routes.js";
import Koa from "koa";
import cors from "@koa/cors";
import { onRequest } from "firebase-functions/v2/https";

const app = new Koa();
app.use(cors());
app.use(routes.routes());
app.use(routes.allowedMethods());

export const api = onRequest(app.callback());

