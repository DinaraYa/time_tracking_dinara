import express from "express";
import {validationBody} from "../validation/validation.js";
import {CorrectShiftDtoSchema} from "../validation/joiSchemas.js";
import * as controller from "../controllers/shiftControlController.js"


export const shiftsRouter = express.Router();

shiftsRouter.post('/', controller.startShift);

shiftsRouter.patch('/', controller.finishShift);

shiftsRouter.patch('/break', controller.takeBreak);

shiftsRouter.patch('/correct', validationBody(CorrectShiftDtoSchema), controller.correctShift);

shiftsRouter.get('/current', controller.getCurrentShiftStaff)


