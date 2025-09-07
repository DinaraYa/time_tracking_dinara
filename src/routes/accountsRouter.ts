import express from "express";
import * as controller from "../controllers/employeeController.js"
import {validationBody} from "../validation/validation.js";
import {
    ChangePasswordDtoSchema,
    EmployeeDtoSchema,
    UpdateEmployeeDtoSchema
} from "../validation/joiSchemas.js";



export const accountsRouter = express.Router();


accountsRouter.post('/', validationBody(EmployeeDtoSchema), controller.hireEmployee);

accountsRouter.patch('/roles', controller.setRole);

accountsRouter.patch('/', validationBody(UpdateEmployeeDtoSchema), controller.updateEmployee);

accountsRouter.patch('/password', validationBody(ChangePasswordDtoSchema), controller.changePassword);


accountsRouter.delete('/', controller.fireEmployee)

accountsRouter.get('/employee', controller.getEmployeeById);

accountsRouter.get('/', controller.getAllEmployees);

//accountsRouter.post('/login', validationBody(LoginSchema), controller.login);





