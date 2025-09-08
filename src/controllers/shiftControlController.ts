import {CurrentCrewShift, Shift} from "../model/Employee.js";
import e, {Request, Response} from "express";
import {HttpError} from "../errorHandler/HttpError.js";
import {startShiftControlMongo, startShiftControlMongo as service} from "../services/ShiftControlServiceImplMongo.js";

export const startShift = async (req: Request, res: Response) => {
    const table_num = req.query.table_num
    if(!table_num || typeof table_num !== 'string' || table_num.trim() === '') throw new HttpError(404, `Employee with ${table_num} doesn't exist`);
    const result = await service.startShift(table_num as string);
    return res.json(result);
}


export const finishShift = async (req: Request, res: Response) => {
    const table_num = req.query.table_num;
    if (!table_num || typeof table_num !== 'string' || table_num.trim() === '') throw new HttpError(404, `Employee with ${table_num} doesn't exists`);
    const result = await service.finishShift(table_num as string);
    return res.json(result);
}

export const takeBreak = async (req: Request, res: Response) => {
    const table_num = req.query.table_num;
    const min = req.query.min;
    if (!table_num || typeof table_num !== 'string' || table_num.trim() === '') throw new HttpError(404, `Employee with ${table_num} doesn't exists`);
    const minNum = Number(min);
    if (isNaN(minNum)) throw new HttpError(404, "Minutes have to be a number");
    const result = await  service.takeBreak(table_num, minNum);
    return res.json(result);
}

export const correctShift = async (req: Request, res: Response) => {
    const body = req.body;
    await service.correctShift(body);
    return res.status(200).send({ message: "Shift corrected successfully" });
}

export const getCurrentShiftStaff = async (req: Request, res: Response) => {
    const result = await service.getCurrentShiftStaff();
    return res.json(result);
}