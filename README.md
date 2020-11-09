# mongodb-operations-helper
 You can use this helper to create a CRUD API using MongoDB
 
 # Documentation
 
 ## How to install
 
 ```
 npm install mongodb-operations-helper
 ```
 
 ## How to use
 
 ```
 // Import it
 const mongoDbOperationsHelper = require("mongodb-operations-helper");
 
 // Set the path to the database
 mongoDbOperationsHelper.dbpath = "YOUR_PATH_TO_THE_MONGO_DATABASE";
 
 // Set the name of the database
 mongoDbOperationsHelper.dbname = "YOUR_DATABASE_NAME";
 
 // You can use it now to make operations in the database.
 // Check the API reference below
 ```
 
 ## API reference:
 ```
 // mongoDbOperationsHelper.add(collection: string, data: object): Promise
 mongoDbOperationsHelper.add("cars", {color: "red", brand: "Toyota", type: "sedan", price: 20000});
 
 // mongoDbOperationsHelper.get(collection: string, [filter: object], [sort: object]): Promise<array>
 mongoDbOperationsHelper.get("cars", {type: "sedan"}, {price: 1});
 
 // mongoDbOperationsHelper.edit(collection: string, id: string, data: object): Promise
 mongoDbOperationsHelper.edit("cars", "5ed2abb7034d833ae0f280a9", {price: 19999});
 
 // mongoDbOperationsHelper.delete(collection: string, id: string): Promise
 mongoDbOperationsHelper.delete("cars", "5ed2abb7034d833ae0f280a9");
 ```
