import * as mongoose from "mongoose";
import {Roles} from "../utils/libTypes.js";

const EmployeeMongooseSchema = new mongoose.Schema({
    _id: {type: String, length: 9, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    table_num:{type:String, required: true},
    roles:{type:String, enum: Roles, required: true},
    passHash: { type: String, required: true }
}, {versionKey:false});

export const EmployeeModel = mongoose.model('Employee', EmployeeMongooseSchema ,"employee_collection");


// const WorkPeriod = new mongoose.Schema({
//     hireDate: {type: String, required: true},
//     fireDate: {type:String, required: true}
// })


const firedEmployeeMongooseSchema = new mongoose.Schema({
    _id: {type: String, length: 9, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    table_num:{type:String, required: true},
    passHash: { type: String, required: true },
    fireDate: {type:String, required: true}
    // birthdate: { type: String, required: true },
    // workPeriods: {type: [WorkPeriod], default:[]}
}, {versionKey:false});

export const firedEmployeeModel = mongoose.model('Fired Employee', firedEmployeeMongooseSchema,"firedEmployee_collection");



