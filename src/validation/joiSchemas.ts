import Joi from 'joi'

import {Roles} from "../utils/libTypes.js";



export const EmployeeDtoSchema = Joi.object({
    id:Joi.string().equal(9).required(),
    //role: Joi.string().min(4).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    password: Joi.string().alphanum().min(8).required(),
    birthdate: Joi.string().isoDate().required(),
    hireDate: Joi.string().isoDate().required(),
    fireDate: Joi.string().isoDate().required(),
})


export const ChangePasswordDtoSchema = Joi.object({
    id:Joi.string().equal(9).required(),
    oldPassword: Joi.string().alphanum().min(8).required(),
    newPassword: Joi.string().alphanum().min(8).required(),
})

export const UpdateEmployeeDtoSchema = Joi.object({
    id:Joi.string().equal(9).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    birthdate: Joi.string().isoDate().required(),
    hireDate: Joi.string().isoDate().required(),
    fireDate: Joi.string().isoDate().required(),
})

export const ChangeRolesSchema =  Joi.array<Roles[]>();

export type ArraySchema = typeof ChangeRolesSchema;

export const LoginSchema = Joi.object({
    id:Joi.number().positive().max(999999999).min(100000000).required(),
    password: Joi.string().alphanum().min(8).required()
});

