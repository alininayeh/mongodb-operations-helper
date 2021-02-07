const { ObjectID } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

const createEditData = (data, incrementData) => {
    const editData = {};

    if (Object.keys(data).length) {
        editData.$set = data;
    }

    if (Object.keys(incrementData).length) {
        editData.$inc = incrementData;
    }

    return editData;
};

const Database = {
    dbname: "",
    dbpath: "",
    mongoClient: MongoClient,
    objectId: ObjectID,

    async connect() {
        return new Promise((resolve, reject) => {
            this.mongoClient.connect(this.dbpath, { useUnifiedTopology: true }, (err, client) => {
                if (err) reject(err);
                resolve(client.db(this.dbname));
            });
        })
    },

    async add(collection, data) {
        const db = await this.connect();

        return new Promise((resolve, reject) => {
            db.collection(collection).insertOne(data, (err, res) => {
                if (err) reject(err);
                resolve(res.ops[0]);
            });
        });
    },

    async get(collection, filter = {}, sort = {}) {
        const db = await this.connect();

        return new Promise((resolve, reject) => {
            if (typeof filter === "string") {
                db.collection(collection).find({"_id": ObjectID(filter)}).sort(sort).toArray((err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            } else {
                db.collection(collection).find(filter).sort(sort).toArray((err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            }
        });
    },

    async edit(collection, id, data, incrementData = {}) {
        const db = await this.connect();

        return new Promise((resolve, reject) => {
            db.collection(collection).updateOne({_id: this.objectId(id)}, createEditData(data, incrementData),  (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    },

    async delete(collection, id) {
        const db = await this.connect();

        return new Promise((resolve, reject) => {
            db.collection(collection).deleteOne({_id: this.objectId(id)}, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    },

    async batchEdit(collection, filter, data, incrementData = {}) {
        const db = await this.connect();

        return new Promise((resolve, reject) => {
            db.collection(collection).updateMany(filter, createEditData(data, incrementData), (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    },
    
    async batchDelete(collection, filter) {
        const db = await this.connect();

        return new Promise((resolve, reject) => {
            db.collection(collection).deleteMany(filter, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    }
};

module.exports = Database;