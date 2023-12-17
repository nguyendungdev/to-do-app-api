/* eslint-disable require-jsdoc */
const yup = require("yup");

async function toDoInputMiddleware(ctx, next) {
  try {
    const postData = ctx.request.body||ctx.req.body;
    const schema = yup.object().shape({
      name: yup.string().required(),
    });
    await schema.validate(postData);
    await next();
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: e.errors,
      errorName: e.name,
    };
  }
}

module.exports = toDoInputMiddleware;
