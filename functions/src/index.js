const {onRequest} = require("firebase-functions/v2/https");
const apiHandle = require("./handlers/api");


exports.api = onRequest(apiHandle.callback());

