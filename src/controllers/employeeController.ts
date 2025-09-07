import {Request, Response} from "express";

import {convertEmployeeDtoToEmployee} from "../utils/tools.js";
import { employeeServiceMongo as service} from "../services/EmployeeServiceImplMongo.js";
import {Employee, UpdateEmployeeDto} from "../model/Employee.js";



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


export const updateEmployee = async (req: Request, res: Response) => {
    const body = req.body;
    const _id = req.query.id as string;
    const result = await service.updateEmployee(_id, body as UpdateEmployeeDto);
    res.json(result);
}

export const changePassword= async (req: Request, res: Response) => {
    const {id, newPassword} = req.body;
    console.log("Controller " + id);
    console.log(" newPass " + newPassword)
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


export const setRole = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const newRoles = req.query.newRole as string;
    console.log("Controller " + id);
    console.log(" newRoles " + newRoles);
    const result = await service.setRole(id, newRoles);
    res.json(result);
}



// export const login = async (req: Request, res: Response) => {
//     const result = await service.login({userId: req.body.id, password: req.body.password});
//     res.json(result);
// }










