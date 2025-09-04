import e from "express";

export interface AuthRequest extends e.Request{
    userId?: string,
    lastName?: string,
    firstName?: string,
    roles?: Roles[];

}

export enum Roles {
    CREW = "crew",
    MNG = "manager",
    HR = "hr",
    SUP = "supervisor",
}

export interface LoginPassType{
    userId: string,
    password: string
}