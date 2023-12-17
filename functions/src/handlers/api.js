const routes = require("../routes/routes");
const Koa = require("koa");
const app = new Koa();
const cors = require("@koa/cors");

app.use(cors());
app.use(routes.routes());
app.use(routes.allowedMethods());
module.exports = app;
