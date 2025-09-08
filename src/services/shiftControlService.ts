import {CorrectShift, CurrentCrewShift, Shift} from "../model/Employee.js";


export interface ShiftControlService {

    startShift: (table_num:string) => Promise<Shift>;
    finishShift: (table_num:string) => Promise<Shift>;
    takeBreak: (table_num:string, min:number) => Promise<void>;
    correctShift: (correctShift: CorrectShift) => Promise<void>;
    getCurrentShiftStaff:() => Promise<CurrentCrewShift[]>;

}
