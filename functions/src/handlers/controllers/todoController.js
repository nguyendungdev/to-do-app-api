/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const {
  getAll,
  getById,
  addTodo,
  updateStatus,
  deleteByIds,
} = require("../../database/todoRepository");
const { isWhitespaceString } = require('../../utils/whitespaceUtils');

async function getToDoList(ctx) {
  try {
    const query = ctx.query;
    const toDoList = await getAll(query);
    ctx.status = 200;
    return ctx.body = toDoList;
  } catch (e) {
    ctx.status = 404;
    return ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

async function getToDo(ctx) {
  try {
    const { id } = ctx.params;
    const toDo = await getById(id);
    if (!toDo) {
      throw new Error("No to do Found with the given id!");
    }
    ctx.status = 200;
    return ctx.body = {
      data: toDo,
    };
  } catch (e) {
    ctx.status = 404;
    return ctx.body = {
      data: {},
      success: false,
      error: e.message,
    };
  }
}

async function save(ctx) {
  try {
    const postData = ctx.request.body || ctx.req.body;
    console.log(postData)
    if (isWhitespaceString(postData.name)) {
      {
        ctx.status = 400;
        return ctx.body = {
          success: false,
          error: 'Todo text cannot be a whitespace string.',
        };
      }
    };
    const newTodo = await addTodo(
      {
        ...postData,
        createAt: new Date(),
        isCompleted: false,
      });
    ctx.status = 201;
    return ctx.body = {
      success: true,
      data: newTodo,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: e.message,
    };

    return ctx.body;
  }
}

async function deleteTodo(ctx) {
  try {
    const { ids } = ctx.query;
    const idList = ids.split(",");
    await deleteByIds(idList);
    ctx.status = 200;
    return ctx.body = {
      success: true,
    };
  } catch (e) {
    ctx.status = 404;
    return ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

async function update(ctx) {
  try {
    const { ids } = ctx.query;
    const idList = ids.split(",");
    await updateStatus(idList);
    ctx.status = 200;
    return ctx.body = {
      success: true,
    };
  } catch (e) {
    ctx.status = 404;
    return ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }

}

module.exports = {

  deleteTodo,
  save,
  update,
  getToDo,
  getToDoList,
};

