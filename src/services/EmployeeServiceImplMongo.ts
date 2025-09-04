import { EmployeeService} from "./employeeService.js";
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";
import {Employee, EmployeeDto, SavedFiredEmployee} from "../model/Employee.js";
import {EmployeeModel, firedEmployeeModel} from "../model/EmployeeMongooseModel.js";
import {LoginPassType, Roles} from "../utils/libTypes.js";
import {getJWT} from "../utils/tools.js";


export class EmployeeServiceImplMongo implements EmployeeService{

   async hireEmployee(employee: Employee): Promise<Employee> {

       const isExist = await EmployeeModel.findById(employee._id).exec();
       if(isExist) throw new HttpError(404, "Employee already exists");
       const newEmployee = new EmployeeModel(employee);
       await newEmployee.save();
       return employee;
   }

    async fireEmployee(empId:string): Promise<SavedFiredEmployee> {
       const employee = await EmployeeModel.findById(empId).exec();
       if (!employee) throw new HttpError(404, "Employee not found");

       const fireDate = {
           ...employee.toObject(),
           fireDate: new Date().toDateString()
       }

      const firedEmployee = new firedEmployeeModel(fireDate);
       await firedEmployee.save();

       await EmployeeModel.findByIdAndDelete(empId).exec();
       return firedEmployee as SavedFiredEmployee;
    }


   async updateEmployee(empId: string , employee: EmployeeDto): Promise<Employee> {
       const result =
           await EmployeeModel.findByIdAndUpdate(empId, {
               firstName: employee.firstName,
               lastName: employee.lastName,
               birthdate: employee.birthdate,
               hireDate: employee.hireDate},{new:true}).exec();
       if(!result) throw new HttpError(404, "Account not found");
       return result as unknown as Employee;
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
        const employee = await EmployeeModel.findById(id).lean<Employee>().exec();
        if (!employee) throw new HttpError(404, "Reader not found");
       return employee
    }

    async getAllEmployees(): Promise<SavedFiredEmployee[]> {
        const result = await firedEmployeeModel.find().exec()
        return result as SavedFiredEmployee[];

    }


    async setRole(id: string, newRole: string): Promise<Employee>{
        const result =
            await EmployeeModel.findByIdAndUpdate(id, {roles : newRole}, {new:true})
        if(!result) throw new HttpError(404, "Account not found");
        return result as unknown as Employee;
    }


    async login(credentials: LoginPassType): Promise<string> {
        const profile = await EmployeeModel.findById(credentials.userId).lean<Employee>().exec();
        if(!profile || !bcrypt.compareSync(credentials.password, profile.passHash))
            throw new HttpError(401, "Incorrect login or password");
        const token = getJWT(credentials.userId, profile.roles as Roles[]);
        return token;
    }


}

export const employeeServiceMongo = new EmployeeServiceImplMongo();