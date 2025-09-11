import { AccountService} from "./accountService.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcrypt";
import {Employee, SavedFiredEmployee, UpdateEmployeeDto} from "../model/Employee.js";
import {EmployeeModel, firedEmployeeModel} from "../model/EmployeeMongooseModel.js";
// import {LoginPassType, Roles} from "../utils/libTypes.js";
import {checkRole} from "../utils/tools.js";


export class AccountServiceImplMongo implements AccountService{

   async hireEmployee(employee: Employee): Promise<Employee> {
       const isExist = await EmployeeModel.findById(employee._id).exec();
       if(isExist) throw new HttpError(404, "Employee already exists");

       const firedEmployee = await firedEmployeeModel.findById(employee._id).exec();
       if(firedEmployee) console.log(`Employee with ${employee._id} was fired`);

       const newEmployee = new EmployeeModel(employee);
       await newEmployee.save();
       return employee;
   }

    async fireEmployee(empId:string): Promise<SavedFiredEmployee> {
       const employee = await EmployeeModel.findById(empId).exec();
        console.log("employee ", employee);
       if (!employee) throw new HttpError(404, "Employee not found");

       const fireDate = {
           ...employee.toObject(),
           fireDate: new Date().toDateString()
       }
        console.log('fireDate ', fireDate);

      const firedEmployee = new firedEmployeeModel(fireDate);
       await firedEmployee.save();
        console.log('firedEmployee ', firedEmployee);

       await EmployeeModel.findByIdAndDelete(empId).exec();
       return firedEmployee as SavedFiredEmployee;
    }


   async updateEmployee(empId: string , employee: UpdateEmployeeDto): Promise<Employee> {
       const result =
           await EmployeeModel.findByIdAndUpdate(empId, {
               firstName: employee.firstName,
               lastName: employee.lastName},{new:true}).exec();
       if(!result) throw new HttpError(404, "Account not found");
       return result;
   }

    async changePassword(id: string, newPassword: string ): Promise<void> {
        console.log(id, newPassword);
        const employee = await EmployeeModel.findById(id);
        console.log(employee);
        if (!employee) throw new HttpError(404, "Account not found");
        const newHash = bcrypt.hashSync(newPassword, 10);
        employee.passHash = newHash;
        await employee.save();
    }

    async getEmployeeById(id: string): Promise<Employee> {
        const employee = await EmployeeModel.findById(id);
        if (!employee) throw new HttpError(404, `Employee with id ${id} not found`);
       return employee
    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        const result = await firedEmployeeModel.find().exec()
        return result as SavedFiredEmployee[];
    }


    async setRole(id: string, newRole: string): Promise<Employee> {
       const role = checkRole(newRole);
        console.log(id, newRole);
        const result =
            await EmployeeModel.findByIdAndUpdate(id, {roles : newRole}, {new:true}).exec()
        if(!result) throw new HttpError(500, "Employee updating failed!");
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