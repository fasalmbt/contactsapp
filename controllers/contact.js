const db = require("../config/connect");
const collection = require("../config/collection");
const { ObjectId } = require("mongodb");

module.exports = {
  addContact: (contactData) => {
    return new Promise(async (resolve, reject) => {
      let name = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .findOne({ username: contactData.name });
      let email = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .findOne({ email: contactData.email });
      if (!name && !email) {
        db.get()
          .collection(collection.CONTACT_COLLECTION)
          .insertOne(contactData)
          .then((data) => {
            resolve(data.ops);
          });
      } else {
        console.log("Contact name/Email already exists");
        resolve({ status: false, Errmsg: "Contact name/Email already exists" });
      }
    });
  },

  getContact: (conId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CONTACT_COLLECTION)
        .findOne({ _id: ObjectId(conId) })
        .then((contact) => {
          resolve(contact);
        });
    });
  },

  deleteContact: (conId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CONTACT_COLLECTION)
        .deleteOne({ _id: ObjectId(conId) })
        .then((response) => {
          resolve(response);
        });
    });
  },

  viewContact: () => {
    return new Promise(async (resolve, reject) => {
      let contacts = await db
        .get()
        .collection(collection.CONTACT_COLLECTION)
        .find()
        .toArray();
      resolve(contacts);
    });
  },

  updateContact: (contactId, contactData) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collection.CONTACT_COLLECTION)
        .updateOne(
          { _id: ObjectId(contactId) },
          {
            $set: {
              name: contactData.name,
              email: contactData.email,
              number: contactData.number,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
};
