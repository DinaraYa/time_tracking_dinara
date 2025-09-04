import {launchServer} from "./server.ts"
import * as mongoose from "mongoose";
import {configuration} from "./config/libConfig.ts";

console.log("Connecting to MongoDB URI:", process.env.MONGO_URI);

mongoose.connect(configuration.mongoUri)
    .then(() => {
        console.log("MongoDB successfully connected");
        launchServer();
    })
    .catch((e) => {
        console.log("Something went wrong", e);
    });