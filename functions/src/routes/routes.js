import Router from "koa-router";
import * as todosHandler from "../handlers/todoHandlers.js";
import todoInputMiddleware from "../middlewares/todoInputMiddleware.js"
const router = new Router({ prefix: "/api" });
router.get("/todo", todosHandler.getToDoList)
    .post("/todo", todoInputMiddleware, todosHandler.save)
    .delete("/todo", todosHandler.deleteTodo)
    .patch("/todo", todosHandler.update);

export default router;

