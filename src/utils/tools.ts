
import {HttpError} from "../errorHandler/HttpError.js";
import bcrypt from "bcryptjs";
import {Roles} from "./libTypes.js";
import jwt, {SignOptions} from "jsonwebtoken";
import {configuration} from "../config/libConfig.js";
import {Employee, EmployeeDto} from "../model/Employee.js";


export const convertEmployeeDtoToEmployee = (dto: EmployeeDto): Employee => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(dto.password, salt);
    return {
        _id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passHash: hash,
        roles: [Roles.CREW],
        birthdate: dto.birthdate,
        hireDate: dto.hireDate,
        fireDate: dto.fireDate
    }
}

export const checkReaderId = (id: string | undefined) => {
    if (!id) throw new HttpError(400, "No ID in request");
    // const _id = parseInt(id as string);
    // if (!_id) throw new HttpError(400, "ID must be a number");
    return id;
}

export const getJWT = (userId:string, roles: Roles[]) => {
    const payload = {roles: JSON.stringify(roles)};
    const secret = configuration.jwt.secret;
    const options: SignOptions = {
        expiresIn: configuration.jwt.exp as any,
        subject: userId.toString()
    }
    return  jwt.sign(payload, secret, options)
}