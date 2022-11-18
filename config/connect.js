const mongoClient = require("mongodb").MongoClient;
const dotenv = require('dotenv')
dotenv.config()
const state = {
  db: null,
};
module.exports.connect = function (done) {
  const url = "mongodb+srv://fasl:testerfasal@cluster0.lgacnfw.mongodb.net/";
  const dbname = "contactsapp";

  mongoClient.connect(url, (err, data) => {
    if (err) done(err);
    state.db = data.db(dbname);
    done();
  });
};

module.exports.get = function () {
  return state.db;
};


