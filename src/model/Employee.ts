
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


export type CrewShift = {
    shiftId: number,
    role: Roles,
    startShift: number,
    finishShift: number|null,
    table_num: string,
    shiftDuration: number,
    breaks: number,
    correct: string|null,
    correctDate: number|null,
    monthHours: number
}


export type Shift ={
    table_num: string,
    time: number
}


export type CorrectShift = {
    table_num_crew: string,
    table_num_mng: string,
    start: string,
    finish: string,
    date: string
}

export type CurrentCrewShift = {
    shiftId: string,
    role: "crew",
    table_num: string,
    startShift: number,
    shiftDuration: number,
    breaks: number,
}