const Router = require("koa-router");
const todoController = require("../handlers/controllers/todoController");
const todoInputMiddleware = require("../middlewares/todoInputMiddleware");

const router = new Router({ prefix: "/api" });
router.get("/todo", todoController.getToDoList)
    .get("/todo/:id", todoController.getToDo)
    .post("/todo", todoInputMiddleware, todoController.save)
    .delete("/todo", todoController.deleteTodo)
    .patch("/todo", todoController.update);

module.exports = router;

