import express, {Response} from "express";
import * as controller from "../controllers/employeeController.js"
import {validationBody} from "../validation/validation.js";
import {
    ChangePasswordDtoSchema,
    ChangeRolesSchema, EmployeeDtoSchema, LoginSchema,
    UpdateEmployeeDtoSchema
} from "../validation/joiSchemas.js";



export const employeeRouter = express.Router();


employeeRouter.post('/', validationBody(EmployeeDtoSchema), controller.hireEmployee);

//employeeRouter.put('/roles', validationBody(ChangeRolesSchema), controller.setRole);



//employeeRouter.patch('/', validationBody(UpdateEmployeeDtoSchema), controller.updateEmployee);

employeeRouter.patch('/password', validationBody(ChangePasswordDtoSchema), controller.changePassword);

employeeRouter.patch('/fired_employee', controller.fireEmployee)

employeeRouter.get('/employee_id', controller.getEmployeeById);

employeeRouter.get('/employees', controller.getAllEmployees);

employeeRouter.post('/login', validationBody(LoginSchema), controller.login);





