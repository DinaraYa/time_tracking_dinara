import {ShiftControlService} from "./shiftControlService.js";
import {CorrectShift, CurrentCrewShift, Shift} from "../model/Employee.js";
import {CrewShiftModel, EmployeeModel} from "../model/EmployeeMongooseModel.js";
import {HttpError} from "../errorHandler/HttpError.js";
import {generateShiftId} from "../utils/tools.js"
import {logger} from "../Logger/winston.js";


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
        const time = 8 * 60 * 60 * 1000;
        if (lastShift && lastShift.finishShift) {
            const currTime = new Date().getTime();
            const different = currTime - lastShift.finishShift;
            if (different < time) throw new HttpError(409, "Forbidden to start shift")
        }
        const newShift = await CrewShiftModel.create({
            shiftId: generateShiftId(),
            role: "crew",
            startShift: Date.now(),
            finishShift: null,
            table_num: table_num,
            shiftDuration: 0,
            breaks: 0,
            correct: null,
            monthHours: lastShift ? lastShift.monthHours : 0
        });

        return {table_num, time: new Date(newShift.startShift).toISOString()} as Shift;
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
        const hour = 1000 * 60 * 60;
        lastShift.finishShift = Date.now();
        lastShift.shiftDuration = (lastShift.finishShift - lastShift.startShift) / hour;
        lastShift.monthHours += lastShift.shiftDuration;

        if (lastShift.breaks === 0 && lastShift.shiftDuration >= 6 && lastShift.shiftDuration <= 8) {
            lastShift.shiftDuration += 0.5
        } else if (lastShift.breaks === 0 && lastShift.shiftDuration >= 4 && lastShift.shiftDuration < 6) {
            lastShift.shiftDuration += 0.25
        } else if (lastShift.breaks === 0 && lastShift.shiftDuration < 4) {
            lastShift.shiftDuration += 0
        }

        await lastShift.save();
        return {table_num, time: new Date(lastShift.finishShift).toISOString()} as Shift;
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
        const hour = 1000 * 60 * 60;
        const shiftDuration = (currentTime - shift.startShift) / hour;

        if (shift && shift.finishShift === null) {
            if (shiftDuration < 4) throw new HttpError(409, "Forbidden to take break");
            else if (shiftDuration >= 4 && shiftDuration < 6) {
                shift.breaks += 0.25
            } else if (shiftDuration >= 6 && shiftDuration <= 8) {
                shift.breaks += 0.5
            }
        }
        await shift.save();
    }


    async correctShift(correctShift: CorrectShift): Promise<void> {
        const {table_num_crew, table_num_mng, start, finish, date} = correctShift;
        console.log("correctShift ", correctShift);
        const shift =
            await CrewShiftModel.findOne({table_num: table_num_crew}).sort({startShift: -1}).exec();
        console.log("shift ", shift);
        const hour = 1000 * 60 * 60;
        if (!shift) throw new HttpError(404, "Shift not found");
        const difTime = (Date.parse(finish) - Date.parse(start)) / hour;
        if (difTime > 8) throw new HttpError(404, "Shift must not exceed more 8 hour");
        shift.startShift = Date.parse(start);
        shift.finishShift = Date.parse(finish);
        shift.shiftDuration = (Date.parse(finish) - Date.parse(start)) / hour;
        shift.monthHours += shift.shiftDuration;
        shift.correct = table_num_mng;
        shift.correctDate = Date.parse(date);

        shift.save();
    }

    async getCurrentShiftStaff(): Promise<CurrentCrewShift[]> {
        const shifts =
            await CrewShiftModel.find({finishShift: null, role: "crew"})
                .select("shiftId startShift role table_num breaks").exec();

        const hour = 1000 * 60 * 60;
        const currentCrewShift: CurrentCrewShift[] = shifts.map(shift => ({
            shiftId: shift.shiftId,
            role: shift.role as "crew",
            table_num: shift.table_num,
            startShift: shift.startShift,
            shiftDuration: (Date.now() - shift.startShift) / hour,
            breaks: shift.breaks
        }));
        return currentCrewShift;
    }

}


export const startShiftControlMongo = new ShiftControlServiceImplMongo();