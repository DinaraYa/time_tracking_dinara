import bcrypt from "bcrypt";
import {Roles} from "./libTypes.js";
import jwt, {SignOptions} from "jsonwebtoken";
import {configuration} from "../config/libConfig.js";
import {Employee, EmployeeDto} from "../model/Employee.js";
import {v4 as uuidv4} from 'uuid';
import {HttpError} from "../errorHandler/HttpError.js";


function generateTabNumber() {
    return uuidv4();
}

export const convertEmployeeDtoToEmployee = (dto: EmployeeDto): Employee => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(dto.password, salt);
    return {
        _id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passHash: hash,
        roles: Roles.CREW,
        table_num: generateTabNumber(),
    }
}

export const checkRole = (role:string) => {
    const newRole = Object.values(Roles).find(r => r === role)
    if(!newRole) throw new HttpError(400, "Wrong role!");
    return newRole;
}


export const  checkBreak = (time:number)=> {
    let takeB: number = 0
        if (time < 240) throw new HttpError(409, "Forbidden to take break");
        else if (time >= 240 && time < 360) {
            takeB += 15
        }
        else if (time >= 360 && time <= 480) {
            takeB += 30
        }
    return takeB;
}

export const checkUnusedBreak = (breakTime:number, duration: number)=> {
    let result = 0;
    if (breakTime === 0 && duration >= 360 && duration <= 480) {
        result += 30
    } else if (breakTime === 0 && duration >= 240 && duration < 360) {
        result += 15
    } else if (breakTime === 0 && duration < 240) {
        result += 0
    }
    return result;
}




// export const getJWT = (userId:string, roles: Roles[]) => {
//     const payload = {roles: JSON.stringify(roles)};
//     const secret = configuration.jwt.secret;
//     const options: SignOptions = {
//         expiresIn: configuration.jwt.exp as any,
//         subject: userId.toString()
//     }
//     return  jwt.sign(payload, secret, options)
// }