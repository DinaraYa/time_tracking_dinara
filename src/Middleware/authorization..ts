// import {AuthRequest, Roles} from "../utils/libTypes.js";
// import {NextFunction, Response} from "express";
// import {HttpError} from "../errorHandler/HttpError.js";
//
//
// export const authorize = (pathRoute:Record<string, Roles[]>)=>
//     (req:AuthRequest, res:Response, next:NextFunction)=> {
//         const route = req.method + req.path
//         const roles = req.roles;
//         console.log("PreAuthorize: " + roles)
//         console.log("route: " + route);
//         if(!roles || roles.some(r => pathRoute[route].includes(r))){
//             console.log("authorize")
//             next();
//         }
//         else throw new HttpError(403, "")
//     }
//
// export  const checkAccountById = (checkPathId:string[]) => {
//     return (req:AuthRequest, res:Response, next:NextFunction)=> {
//         const route = req.method + req.path;
//         const roles = req.roles;
//         if(!roles || !checkPathId.includes(route) || (!req.roles!.includes(Roles.HR)
//             && req.roles!.includes(Roles.CREW)
//             && req.userId == req.query.id))
//             next();
//         else throw new HttpError(403, "You can modify only your own account")
//     }
// }