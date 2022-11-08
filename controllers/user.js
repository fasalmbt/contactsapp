const collection = require("../config/collection");
const db = require("../config/connect");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

module.exports = {
  register: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      let username = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ username: userData.username });
      let email = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (!username && !email) {
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne(userData)
          .then((data) => {
            resolve(data.ops);
          });
      } else {
        console.log("Username/Email already exists");
        resolve({ status: false, Errmsg: "Username/Email already exists" });
      }
    });
  },

  login: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ username: userData.username });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log("Login success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Incorrect password!");
            resolve({ status: false, Errmsg: "Incorrect password!" });
          }
        });
      } else {
        console.log("Account does not exist.");
        resolve({ status: false, Errmsg: "Account does not exist" });
      }
    });
  },

  updateCredentials: (userId, userData) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: ObjectId(userId) },
          {
            $set: {
              username: userData.username,
              email: userData.email,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
};
