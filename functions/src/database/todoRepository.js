/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import admin from "firebase-admin";
import serviceAccount from "./serviceAccont.json" assert {type: "json"};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const todoRef = admin.firestore().collection("todo");

/**
 *
 * @param {[{name:string,createAt:Date,isCompleted:boolean}]} data
 * @returns
 */
export async function addTodo(data) {
  const addedTodo = await todoRef.add(data);
  return { id: addedTodo.id, ...data };
}

/**
 *
 * @param {string[]}query
 * @return {[{id:string ,name:string,createAt:Date,isCompleted:boolean}]}
 */
export async function getListTodo(query) {
  let queryRef = todoRef;
  const { limit, sort } = query;

  if (sort) {
    queryRef = queryRef.orderBy("createAt", sort);
  }
  if (limit) {
    queryRef = queryRef.limit(parseInt(limit));
  }

  const toDoList = (await queryRef.get()).docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return toDoList;
}

/**
 *
 * @param {string[]} ids
 */
export async function updateStatus(ids) {
  const batch = admin.firestore().batch();
  const updatePromises = ids.map(async (id) => {
    const { isCompleted } = (await todoRef.doc(`${id}`).get()).data();
    batch.update(todoRef.doc(id), { isCompleted: !isCompleted });
  });
  return Promise.all(updatePromises);
}

/**
 * 
 * @param {string[]} ids 
 * @returns 
 */
export async function deleteByIds(ids) {
  const batch = admin.firestore().batch();
  ids.map((id) => {
    batch.delete(todoRef.doc(id));
  });
  return batch.commit();
}

