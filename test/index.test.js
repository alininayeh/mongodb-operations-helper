const chai = require("chai");
const should = chai.should();
const mongodb = require("mongo-mock");
mongodb.max_delay = 0;
const FakeMongoClient = mongodb.MongoClient;
const FakeObjectID = mongodb.ObjectID;
const database = require("../src/index");

describe("Database", () => {
    before(() => {
        database.dbname = "test";
        database.dbpath = "test";
        database.mongoClient = FakeMongoClient;
        database.objectId = FakeObjectID;
    });

    it ("should add an item, get it, edit it, get the newly created item, then delete it", async () => {
        // should add an item
        await database.add("test", {hello: "world"});

        // should get an item
        let results = await database.get("test");
        results.should.have.length.greaterThan(0);
        const resultId = results[0]["_id"];

        // should edit an item
        await database.edit("test", resultId, {hello: "edited"});

        // should get the edited item
        results = await database.get("test", {_id: resultId});
        results.should.have.length.greaterThan(0);
        results[0].should.deep.include({hello: "edited"});

        // should delete the item
        await database.delete("test", resultId);

        // should not find the edited item anymore
        results = await database.get("test", {_id: resultId});
        results.length.should.equal(0);
    });
});