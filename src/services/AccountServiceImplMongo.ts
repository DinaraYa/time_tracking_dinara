import {AccountService} from "./accountService.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcrypt";
import {Employee, SavedFiredEmployee, UpdateEmployeeDto} from "../model/Employee.js";
import {EmployeeModel, FiredEmployeeModel} from "../model/EmployeeMongooseModel.js";
// import {LoginPassType, Roles} from "../utils/libTypes.js";
import {checkFiredEmployee, checkRole, convertEmployeeToFiredEmployee} from "../utils/tools.js";
import {logger} from "../Logger/winston.js";


export class AccountServiceImplMongo implements AccountService {

    async hireEmployee(employee: Employee): Promise<Employee> {
        const isExist = await EmployeeModel.findById(employee._id);
        if (isExist) {
            logger.warn(`[hireEmployee] Employee with  ${employee._id} already exists`)
            throw new HttpError(409, `Employee with id ${employee._id} already exists`);
        }
        await checkFiredEmployee(employee._id);
        const newEmployee = new EmployeeModel(employee);
        await newEmployee.save();
        logger.info(`[hireEmployee] Employee with ${employee._id} was added`);
        return employee;
    }

    async fireEmployee(empId: string): Promise<SavedFiredEmployee> {
        const employee = await EmployeeModel.findByIdAndDelete(empId).exec();
        if (!employee) {
            logger.warn(`[fireEmployee] Employee with  ${empId} not found`)
            throw new HttpError(404, `Employee with  ${empId} not found`);
        }
       const fired: SavedFiredEmployee = convertEmployeeToFiredEmployee(employee as Employee);
        const firedEmployee = new FiredEmployeeModel(fired);
        await firedEmployee.save();
        logger.info(`[fireEmployee] Employee with ${empId} was fired and and moved to firedEmployee_collection`);
        return fired;
    }


    async updateEmployee(empId: string, employee: UpdateEmployeeDto): Promise<Employee> {
        const result =
            await EmployeeModel.findByIdAndUpdate(empId, {
                firstName: employee.firstName,
                lastName: employee.lastName
            }, {new: true}).exec();
        if (!result) {
            logger.warn(`[updateEmployee] Employee with  ${empId} not found`);
            throw new HttpError(404, "Employee not found");
        }
        logger.info(`[updateEmployee] Employee ${empId} updated: firstName=${employee.firstName}, lastName=${employee.lastName}\``);
        return result;
    }

    async changePassword(id: string, newPassword: string): Promise<void> {
        const employee = await EmployeeModel.findById(id);
        if (!employee) {
            logger.warn(`[changePassword] Account with  ${id} not found`);
            throw new HttpError(404, "Account not found");
        }
        const newHash = bcrypt.hashSync(newPassword, 10);
        employee.passHash = newHash;
        logger.info(`[changePassword] Password of employee with ${id} was changed`);
        await employee.save();
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employee = await EmployeeModel.findById(id).exec();
        if (!employee) throw new HttpError(404, `Employee with id ${id} not found`);
        return employee
    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        const result = await FiredEmployeeModel.find().exec()
        return result as SavedFiredEmployee[];
    }


    async setRole(id: string, newRole: string): Promise<Employee> {
        const role = checkRole(newRole);
        const result =
            await EmployeeModel.findByIdAndUpdate(id, {roles: newRole}, {new: true}).exec()
        if (!result) {
            logger.warn(`[setRole] Attempt to change role for employee ${id} failed`);
            throw new HttpError(500, "Employee updating failed!");
        }
        logger.info(`[setRole] Role of employee ${id} changed to ${newRole}`);
        return result as Employee;
    }


    // async login(credentials: LoginPassType): Promise<string> {
    //     const profile = await EmployeeModel.findById(credentials.userId).lean<Employee>().exec();
    //     if(!profile || !bcrypt.compareSync(credentials.password, profile.passHash))
    //         throw new HttpError(401, "Incorrect login or password");
    //     const token = getJWT(credentials.userId, profile.roles as Roles);
    //     return token;
    // }


}

export const accountServiceMongo = new AccountServiceImplMongo();