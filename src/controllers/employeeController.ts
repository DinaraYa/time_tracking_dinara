import {Request, Response} from "express";

import {checkReaderId, convertEmployeeDtoToEmployee} from "../utils/tools.js";
import { employeeServiceMongo as service} from "../services/EmployeeServiceImplMongo.js";
import {Roles} from "../utils/libTypes.js";
import {Employee, EmployeeDto} from "../model/Employee.js";



export const hireEmployee = async (req: Request, res: Response) => {
    const body = req.body;
    const employee: Employee = convertEmployeeDtoToEmployee(body);
    await service.hireEmployee(employee)
    res.status(201).send("Account created")
}


export const fireEmployee = async (req: Request, res: Response) => {
    const id = req.query.id;
    const employee = await service.fireEmployee(id as string);
    res.status(200).send(employee);

}


// export const updateEmployee = async (req: Request, res: Response) => {
//     const body = req.body;
//     const _id = checkReaderId(req.query.id as string)
//     const dto:EmployeeDto = {...body, id: _id, password:""};
//     const updEmployee = convertEmployeeDtoToEmployee(dto);
//     const updAccount = await service.updateEmployee(_id, updEmployee);
//     res.json(updAccount);
// }

export const changePassword= async (req: Request, res: Response) => {
    const {id, newPassword} = req.body;
    console.log("Controller " + id);
    console.log(" newPass " + newPassword)
    const _id = checkReaderId(id);
    console.log("Controller " + _id );
    await service.changePassword(id, newPassword);
    res.send("Password changed");
}

export const getEmployeeById= async (req: Request, res: Response) => {
    const id = req.query.id;
    console.log("READER_ID " + id);
    const employee = await service.getEmployeeById(id as string);
    console.log("READER controller " + employee);
    res.status(200).json(employee);
}

export const getAllEmployees= async (req: Request, res: Response) => {
   const result = await service.getAllEmployees();
   res.json(result);
}


// export const setRole = async (req: Request, res: Response) => {
//     const id = checkReaderId(req.query.id as string);
//     const newRoles = req.body as Roles[];
//     const employeeWithNewRoles = await service.setRole(id, newRoles);
//     res.json(employeeWithNewRoles)
// }



export const login = async (req: Request, res: Response) => {
    const result = await service.login({userId: String(checkReaderId(req.body.id)), password: req.body.password});
    res.json(result);
}










