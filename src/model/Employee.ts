
import {Roles} from "../utils/libTypes.js";

export type EmployeeDto = {
    id: string,
    firstName: string,
    lastName: string,
    password: string,
}

export type Employee ={
    _id: string,
    firstName: string,
    lastName: string,
    passHash: string,
    table_num: string,
    roles: Roles
}

// type WorkPeriod ={
//     hireDate: string,
//     fireDate: string
// }

export type SavedFiredEmployee = {
    _id: string,
    firstName: string,
    lastName: string,
    table_num: string,
    // birthdate: string,
    //workPeriods: WorkPeriod[];
    fireDate: string
}

export type UpdateEmployeeDto = {
    firstName: string,
    lastName: string,
}

