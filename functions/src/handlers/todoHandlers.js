/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import { getListTodo, addTodo, updateStatus, deleteByIds } from "../database/todoRepository.js"
import isWhitespaceString from "../utils/whitespaceUtils.js";

export async function getToDoList(ctx) {
  try {
    const query = ctx.query;
    const toDoList = await getListTodo(query);
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

export async function save(ctx) {
  try {
    const postData = ctx.request.body || ctx.req.body;
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

export async function deleteTodo(ctx) {
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

export async function update(ctx) {
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

