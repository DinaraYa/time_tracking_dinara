
import {LoginPassType} from "../utils/libTypes.js";
import {Employee, EmployeeDto, SavedFiredEmployee} from "../model/Employee.js";


export interface EmployeeService {
    hireEmployee: (employee: Employee) => Promise<Employee>;
    fireEmployee: (empId:string) => Promise<SavedFiredEmployee>;
    updateEmployee: (empId:string , employee: EmployeeDto) => Promise<Employee>;
    changePassword:  (empId:string , newPassword: string) => Promise<void>;
    getEmployeeById: (id: string) => Promise<Employee>;
    getAllEmployees: () => Promise<SavedFiredEmployee[]>;
    setRole: (id:string, newRole:string) => Promise<Employee>;
    login: (credentials: LoginPassType) => Promise<string>;
}