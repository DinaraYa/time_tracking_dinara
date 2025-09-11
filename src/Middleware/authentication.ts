// import {AccountService} from "../services/employeeService.js";
// import {NextFunction, Request, Response} from "express";
// import bcrypt from "bcrypt";
// import {HttpError} from "../errorHandler/HttpError.js";
// import {AuthRequest, Roles} from "../utils/libTypes.js";
// import jwt, {JwtPayload} from "jsonwebtoken";
// import {configuration} from "../config/libConfig.js";
//
// const BASIC = "Basic ";
// const BEARER = "Bearer ";
//
//
// async function getBasicAuth(authHeader: string, service: AccountService, req: AuthRequest, res: Response) {
//
//     const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
//     console.log(auth);
//
//     const [id, password] = auth.split(":");
//     const _id = checkReaderId(id);
//     console.log(process.env.OWNER!)
//     console.log(process.env.OWNER_PASS)
//     if (_id == (process.env.OWNER!) && password === process.env.OWNER_PASS) {
//         req.userId = "10000000";
//         req.roles = [Roles.SUP];
//     } else {
//         try {
//             const account = await service.getEmployeeById(_id);
//             if (bcrypt.compareSync(password, account.passHash)) {
//                 req.userId = account._id;
//                 req.lastName = account.lastName;
//                 req.firstName = account.firstName;
//                 req.roles = account.roles;
//                 console.log("AUTHENTICATED")
//             } else {
//                 console.log("NOT AUTHENTICATED")
//
//             }
//         } catch (e) {
//             console.log("NOT AUTHENTICATED because Internal Http Errors")
//         }
//     }
// }
//
//
// function jwtAuth(authHeader: string, req: AuthRequest) {
//     const token = authHeader.substring(BEARER.length);
//     try {
//         const payload = jwt.verify(token, configuration.jwt.secret) as JwtPayload;
//         console.log(payload);
//         req.userId = payload.sub!;
//         req.roles = JSON.parse(payload.roles) as Roles[];
//         req.lastName = "Anonymous"
//     } catch (e) {
//         console.log("reader not AUTHENTICATED by JWToken")
//     }
//
//
//
// }
//
// export const authenticate = (service: AccountService) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         const autHeader = req.header('Authorization');
//         console.log(autHeader);
//         if (autHeader && autHeader.startsWith(BASIC))
//             await getBasicAuth(autHeader, service, req, res);
//         else if (autHeader && autHeader.startsWith(BEARER))
//             jwtAuth(autHeader, req)
//         next();
//     }
// }
//
// export const skipRoutes = (skipRoutes: string[]) =>
//     (req: AuthRequest, res: Response, next: NextFunction) => {
//         const route = req.method + req.path //POST/accounts
//         if (!skipRoutes.includes(route) && !req.userId)
//         {throw new HttpError(401, "skipRoutes sent throw this error");}
//         next();
//     }