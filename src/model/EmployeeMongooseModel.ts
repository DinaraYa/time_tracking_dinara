import * as mongoose from "mongoose";
import {Roles} from "../utils/libTypes.js";

const employeeMongooseSchema = new mongoose.Schema({
    _id: {type: String, length: 9, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    passHash: { type: String, required: true },
    //roles: {type: [String], enum: Roles, required: true},
    birthdate: { type: String, required: true },
    hireDate: { type: String, required: true },
    fireDate: { type: String, default: null }
});

export const EmployeeModel = mongoose.model('Employee', employeeMongooseSchema ,"employee_collection");


const WorkPeriod = new mongoose.Schema({
    hireDate: {type: String, required: true},
    fireDate: {type:String, required: true}
})


const firedEmployeeMongooseSchema = new mongoose.Schema({
    _id: {type: String, length: 9, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    passHash: { type: String, required: true },
    roles: {type: [String], enum: Roles, required: true},
    birthdate: { type: String, required: true },
    workPeriods: {type: [WorkPeriod], default:[]}
});

export const firedEmployeeModel = mongoose.model('Fired Employee', firedEmployeeMongooseSchema,"firedEmployee_collection");



