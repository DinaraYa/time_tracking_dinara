import {Roles} from "../utils/libTypes.js";

export type CrewShift = {
    _id: string,
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
    time: string
}


export type CorrectShift = {
    table_num_crew: string,
    table_num_mng: string,
    start: string,
    finish: string,
    date: string
}

export type CurrentCrewShift = {
    _id: string,
    role: "crew",
    table_num: string,
    startShift: number,
    shiftDuration: number,
    breaks: number,
}