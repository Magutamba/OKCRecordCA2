//import mongoose package
const mongoose = require("mongoose");

//import record model
const Records = require("./models/records");
  //create asynchronous function
  (async () => {
    try {
      //connect to recordb database
      await mongoose.connect("mongodb://localhost:27017/recordDB");
      //delete all data in records collection
      await Records.deleteMany({});
      //add six records to the database
      const realRecords = [
        { year: "2019-2020", wins: 44, losses: 28, seed: 5, playoffFinish: "First Round", expectedW_L: "41-31" },
        { year: "2020-2021", wins: 22, losses: 50, seed: 14, playoffFinish: "Did not qualify", expectedW_L: "15-57" },
        { year: "2021-2022", wins: 21, losses: 61, seed: 14, playoffFinish: "Did not qualify", expectedW_L: "15-57" },
        { year: "2022-2023", wins: 40, losses: 42, seed: 10, playoffFinish: "Did not qualify", expectedW_L: "44-38" },
        { year: "2023-2024", wins: 57, losses: 15, seed: 1, playoffFinish: "Conference semifinals", expectedW_L: "58-24" },
        { year: "2024-2025", wins: 68, losses: 14, seed: 1, playoffFinish: "NBA champions", expectedW_L: "68-14" }
      ];
      await Records.insertMany(realRecords);
      //log successful
      console.log("Seed Successful");
      process.exit(0);//exits node with no errors
    } catch (e) {
      console.error(e);//print error message
      process.exit(1);
    }
  })();

  