import mongoose from "mongoose";
import {Roles} from "../utils/libTypes.js";

const CrewShiftMongooseSchema = new mongoose.Schema ({
    role: {type:String, enum: Roles, required: true},
    startShift: {type: Number, required: true},
    finishShift: {type: Number, default: null},
    table_num: {type: String, required: true},
    shiftDuration: {type: Number, required: true},
    breaks: {type: Number, required: true},
    correct: {type: String, default: null},
    correctDate: {type: Number, default: null},
    monthHours: {type: Number, required: true}
})


export const  CrewShiftModel = mongoose.model('CrewShift', CrewShiftMongooseSchema, "crewShift_collection");


