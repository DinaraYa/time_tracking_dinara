
import {Roles} from "../utils/libTypes.js";

export type EmployeeDto = {
    id: string,
    firstName: string,
    lastName: string,
    password: string,
    //roles: string,
    birthdate: string,
    hireDate: string,
    fireDate: null
}

export type Employee ={
    _id: string,
    firstName: string,
    lastName: string,
    passHash: string,
    roles: Roles[],
    birthdate: string,
    hireDate: string,
    fireDate: null
}

type WorkPeriod ={
    hireDate: string,
    fireDate: string
}

export type SavedFiredEmployee = {
    _id: string,
    firstName: string,
    lastName: string,
    passHash: string,
    roles: Roles[],
    birthdate: string,
    workPeriods: WorkPeriod[];
}