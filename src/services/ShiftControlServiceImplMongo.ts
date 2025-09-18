import {ShiftControlService} from "./shiftControlService.js";
import {CorrectShift, CurrentCrewShift, Shift} from "../model/Shift.js";
import { EmployeeModel} from "../model/EmployeeMongooseModel.js";
import {CrewShiftModel} from "../model/ShiftMongooseModel.js"
import {HttpError} from "../errorHandler/HttpError.js";
import {logger} from "../Logger/winston.js";
import {checkBreak, checkUnusedBreak} from "../utils/tools.js";
import {configuration} from "../config/libConfig.js";


export class ShiftControlServiceImplMongo implements ShiftControlService {

    async startShift(table_num: string): Promise<Shift> {
        logger.info(`Service start to process request`)
        const tab_num = await EmployeeModel.findOne({table_num: table_num}).exec();
        if (!tab_num) {
            logger.warn(`[startShift] Employee with  ${table_num} not found`);
            throw new HttpError(404, "Employee not found");
        }
        const lastShift =
            await CrewShiftModel.findOne({table_num: table_num}).sort({startShift: -1}).exec();
        if (lastShift && lastShift.finishShift === null) {
            logger.warn(`[startShift] ${new Date().toISOString()} => Previous shift not closed, 409 Conflict`);
            throw new HttpError(409, "Forbidden to start shift");
        }
        if (lastShift && lastShift.finishShift) {
            const currTime = new Date().getTime();
            const different = currTime - lastShift.finishShift;
            if (different < configuration.durationOneShift) {
                logger.warn(`[startShift] Employee ${table_num}: Time between shifts less then 8 hours`)
                throw new HttpError(409, "Forbidden to start shift")
            }
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
        logger.info(`Employee ${table_num} started new shift at ${newShift.startShift}`);
        return {table_num, time: new Date(newShift.startShift).toTimeString()} as Shift;
    }

    async finishShift(table_num: string): Promise<Shift> {
        const tab_num = await EmployeeModel.findOne({table_num: table_num}).exec();
        if (!tab_num) {
            logger.warn(`[finishShift] Employee with  ${table_num} not found`);
            throw new HttpError(404, "Employee not found");
        }
        const lastShift =
            await CrewShiftModel.findOne({table_num: table_num}).sort({startShift: -1}).exec();
        if (!lastShift) {
            logger.warn(`[finishShift] Employee ${table_num}: all shifts are closed`)
            throw new HttpError(409, "Forbidden to finish shift");
        }
        if (lastShift && lastShift.finishShift !== null) {
            logger.warn(`[finishShift] Employee ${table_num} tried to finish a shift at ${new Date().toISOString()} but it was already closed`);
            throw new HttpError(409, "The shift has already been added.");
        }
        const minutes = 1000 * 60;
        lastShift.finishShift = Date.now();
        lastShift.shiftDuration = (lastShift.finishShift - lastShift.startShift) / minutes;
        lastShift.monthHours += lastShift.shiftDuration;

        const breakTime = checkUnusedBreak(lastShift.breaks, lastShift.shiftDuration);
        console.log(breakTime)
        lastShift.shiftDuration += breakTime;
        lastShift.monthHours += breakTime;
        await lastShift.save();
        logger.info(`Employee ${table_num} finished shift at ${lastShift.startShift}`);
        return {table_num, time: new Date(lastShift.finishShift).toTimeString()} as Shift;
    }


    async takeBreak(table_num: string, min: number): Promise<void> {
        const tab_num = await EmployeeModel.findOne({table_num: table_num}).exec();
        if (!tab_num) {
            logger.warn(`[takeBreak] Employee with  ${table_num} not found`);
            throw new HttpError(404, "Employee not found");
        }
        const shift =
            await CrewShiftModel.findOne({table_num: table_num}).sort({startShift: -1}).exec();
        if (!shift) {
            logger.warn(`[takeBreak] Forbidden to take break, shift not found`);
            throw new HttpError(409, "Forbidden to take break");
        }
        if (shift.finishShift !== null) {
            logger.warn(`[takeBreak] Cannot take break on closed shift`)
            throw new HttpError(409, "Cannot take break on closed shift");
        }
        const currentTime = Date.now();
        const minutes = 1000 * 60;
        const shiftDuration = (currentTime - shift.startShift) / minutes;

        const breakTime = checkBreak (shiftDuration);
        shift.breaks += breakTime;
        logger.info(`[takeBreak] Employee ${table_num} took ${min} minutes break`);
        await shift.save();
    }


    async correctShift(correctShift: CorrectShift): Promise<void> {
        const { table_num_crew, table_num_mng, start, finish, date} = correctShift;
        const shift =
            await CrewShiftModel.findOne({table_num: table_num_crew}).sort({startShift: -1}).exec();
        if (!shift) {
            logger.warn(`[correctShift] Employee ${table_num_crew} not found, mng: ${table_num_mng}`);
            throw new HttpError(404, "Shift not found");
        }
        const minutes = 1000 * 60;
        const difTime = (Date.parse(finish) - Date.parse(start)) / minutes;
        if (difTime > 8) {
            logger.warn(`[correctShift] Shift must not exceed more 8 hour, mng: ${table_num_mng}`)
            throw new HttpError(404, "Shift must not exceed more 8 hour");
        }
        shift.startShift = Date.parse(start);
        shift.finishShift = Date.parse(finish);
        shift.shiftDuration = (Date.parse(finish) - Date.parse(start)) / minutes;
        shift.monthHours += shift.shiftDuration;
        shift.correct = table_num_mng;
        shift.correctDate = Date.parse(date);

        shift.save();
        logger.info(`[correctShift] Shift of employee  ${table_num_crew} was changed by manager ${table_num_mng}`);
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