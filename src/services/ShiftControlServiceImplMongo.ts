import {ShiftControlService} from "./shiftControlService.js";
import {CorrectShift, CurrentCrewShift, Shift} from "../model/Shift.js";
import { EmployeeModel} from "../model/EmployeeMongooseModel.js";
import {CrewShiftModel} from "../model/ShiftMongooseModel.js"
import {HttpError} from "../errorHandler/HttpError.js";
import {logger} from "../Logger/winston.js";
import {checkBreak, checkUnusedBreak} from "../utils/tools.js";


export class ShiftControlServiceImplMongo implements ShiftControlService {

    async startShift(table_num: string): Promise<Shift> {
        const tab_num = await EmployeeModel.findOne({table_num: table_num}).exec();
        if (!tab_num) {
            throw new HttpError(404, "Employee not found");
        }
        const lastShift =
            await CrewShiftModel.findOne({table_num: table_num}).sort({startShift: -1}).exec();
        if (lastShift && lastShift.finishShift === null) {
            logger.error(`${new Date().toISOString()} => Previous shift not closed, 409 Conflict`);
            throw new HttpError(409, "Forbidden to start shift");
        }
        const time = 8 * 60 * 1000;
        if (lastShift && lastShift.finishShift) {
            const currTime = new Date().getTime();
            const different = currTime - lastShift.finishShift;
            if (different < time) throw new HttpError(409, "Forbidden to start shift")
        }
        const newShift = await CrewShiftModel.create({
            role: "crew",
            startShift: Date.now(),
            finishShift: null,
            table_num: table_num,
            shiftDuration: 0,
            breaks: 0,
            correct: null,
            monthHours: lastShift ? lastShift.monthHours : 0
        });
        return {table_num, time: new Date(newShift.startShift).toTimeString()} as Shift;
    }

    async finishShift(table_num: string): Promise<Shift> {
        const tab_num = await EmployeeModel.findOne({table_num: table_num}).exec();
        if (!tab_num) {
            throw new HttpError(404, "Employee not found");
        }
        const lastShift =
            await CrewShiftModel.findOne({table_num: table_num}).sort({startShift: -1}).exec();
        if (!lastShift) throw new HttpError(409, "Forbidden to finish shift");
        if (lastShift && lastShift.finishShift !== null) throw new HttpError(409, "The shift has already been added.");
        const minutes = 1000 * 60;
        lastShift.finishShift = Date.now();
        lastShift.shiftDuration = (lastShift.finishShift - lastShift.startShift) / minutes;
        lastShift.monthHours += lastShift.shiftDuration;

        const breakTime = checkUnusedBreak(lastShift.breaks, lastShift.shiftDuration);
        console.log(breakTime)
        lastShift.shiftDuration += breakTime;
        lastShift.monthHours += breakTime;
        await lastShift.save();
        return {table_num, time: new Date(lastShift.finishShift).toTimeString()} as Shift;
    }


    async takeBreak(table_num: string, min: number): Promise<void> {
        const tab_num = await EmployeeModel.findOne({table_num: table_num}).exec();
        if (!tab_num) {
            throw new HttpError(404, "Employee not found");
        }
        const shift =
            await CrewShiftModel.findOne({table_num: table_num}).sort({startShift: -1}).exec();
        if (!shift) throw new HttpError(409, "Forbidden to take break");

        const currentTime = Date.now();
        const minutes = 1000 * 60;
        const shiftDuration = (currentTime - shift.startShift) / minutes;

        if (!shift || shift.finishShift !== null) {
            throw new HttpError(409, "Cannot take break on closed shift");
        }
        const breakTime = checkBreak (shiftDuration);
        shift.breaks += breakTime;
        await shift.save();
    }


    async correctShift(correctShift: CorrectShift): Promise<void> {
        const {table_num_crew, table_num_mng, start, finish, date} = correctShift;
        console.log("correctShift ", correctShift);
        const shift =
            await CrewShiftModel.findOne({table_num: table_num_crew}).sort({startShift: -1}).exec();
        console.log("shift ", shift);
        const minutes = 1000 * 60;
        if (!shift) throw new HttpError(404, "Shift not found");
        const difTime = (Date.parse(finish) - Date.parse(start)) / minutes;
        if (difTime > 8) throw new HttpError(404, "Shift must not exceed more 8 hour");
        shift.startShift = Date.parse(start);
        shift.finishShift = Date.parse(finish);
        shift.shiftDuration = (Date.parse(finish) - Date.parse(start)) / minutes;
        shift.monthHours += shift.shiftDuration;
        shift.correct = table_num_mng;
        shift.correctDate = Date.parse(date);

        shift.save();
    }

    async getCurrentShiftStaff(): Promise<CurrentCrewShift[]> {
        const shifts =
            await CrewShiftModel.find({finishShift: null, role: "crew"})
                .select("_id startShift role table_num breaks").exec();

        const minutes = 1000 * 60;
        const currentCrewShift: CurrentCrewShift[] = shifts.map(shift => ({
            _id: shift.id,
            role: shift.role as "crew",
            table_num: shift.table_num,
            startShift: shift.startShift,
            shiftDuration: (Date.now() - shift.startShift) / minutes,
            breaks: shift.breaks
        }));
        return currentCrewShift;
    }
}


export const startShiftControlMongo = new ShiftControlServiceImplMongo();