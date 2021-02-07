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

        // should get an item by its ID
        results = await database.get("test", resultId);
        results.length.should.equal(1);

        // should edit an item
        await database.edit("test", resultId, {hello: "edited", index: 100});

        // should increment a field for an item
        await database.edit("test", resultId, {}, {index: 1});

        // should get the edited item
        results = await database.get("test", {_id: resultId});
        results.should.have.length.greaterThan(0);
        results[0].should.deep.include({hello: "edited"});
        results[0].should.deep.include({index: 101});

        // should delete the item
        await database.delete("test", resultId);

        // should not find the edited item anymore
        results = await database.get("test", {_id: resultId});
        results.length.should.equal(0);
    });

    it("should handle batch operations", async () => {
        await database.add("test", {hello: "world-to-be-edited", index: 0});
        await database.add("test", {hello: "world-to-be-edited", index: 1});
        await database.add("test", {hello: "world-to-be-edited", index: 2});

        let results = await database.get("test", {hello: /world-to-be-edited/});
        
        await database.batchEdit("test", {hello: /world-to-be-edited/}, {hello: "world"}, {index: 1});

        results = await database.get("test", {hello: /world/});
        results.length.should.equal(3);
        results[0].should.deep.include({hello: "world"});
        results[0].should.deep.include({index: 1});
        results[1].should.deep.include({index: 2});
        results[2].should.deep.include({index: 3});

        await database.batchDelete("test", {hello: "world"});

        results = await database.get("test", {hello: /world/});
        results.length.should.equal(0);
    });
});