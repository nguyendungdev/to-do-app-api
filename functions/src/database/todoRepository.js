/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccont.json");

initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore().collection("todo");


async function getInfo(todoRef) {
  const addedTodo = (await todoRef.get()).data();
  return {
    id: todoRef.id,
    ...addedTodo,
    createAt: addedTodo.createAt.toDate()
  };
}


/**
 *
 * @param {[{name:string,createAt:Date,isCompleted:boolean}]} data
 * @returns
 */
async function addTodo(data) {
  const todoRef = await db.add(data);
  return getInfo(todoRef);
}


/**
 *
 * @param {string[]}query
 * @return {[{id:string ,name:string,createAt:Date,isCompleted:boolean}]}
 */
async function getAll(query) {
  let queryRef = db;
  const { limit, sort } = query;

  if (sort) {
    queryRef = queryRef.orderBy("createAt", sort);
  }
  if (limit) {
    queryRef = queryRef.limit(parseInt(limit));
  }
  const toDoDocs = (await queryRef.get()).docs;
  const toDoList = toDoDocs.map((doc) => {
    const data = doc.data();
    data.id = doc.id;
    data.createAt = data.createAt.toDate();
    return data;
  });

  return toDoList;
}

/**
 *
 * @param {string} id
 * @return {[{name:string,createAt:Date,isCompleted:boolean}]}
 */
async function getById(id) {
  const todo = await db.doc(id).get();
  const todoData = todo.data();
  if (!todoData) {
    return null;
  }
  return { id: todo.id, ...todoData, createAt: todoData.createAt.toDate() };
}

/**
 *
 * @param {string[]} ids
 */
async function updateStatus(ids) {
  const batch = getFirestore().batch();
  const updatePromises = ids.map(async (id) => {
    const todoRef = db.doc(id);
    const todo = await getInfo(todoRef);
    batch.update(todoRef, { isCompleted: !todo.isCompleted });
  });
  await Promise.all(updatePromises);
  return batch.commit();
}


/**
 * 
 * @param {string[]} ids 
 * @returns 
 */
async function deleteByIds(ids) {
  const batch = getFirestore().batch();
  ids.forEach((id) => {
    const todoRef = db.doc(id);
    batch.delete(todoRef);
  });
  return batch.commit();
}


module.exports = {
  getAll,
  getById,
  addTodo,
  updateStatus,
  deleteByIds,
};
