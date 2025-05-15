const mongoose = require ("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"


main()
.then((res) =>{
    console.log("connecte to db");
   
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}  
  
const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: "681df8b49f2a1f57d4b053d4"
        }));
        console.log(initData.data);
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Failed to initialize data:", err);
    }
};
initDB();