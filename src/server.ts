import express, {NextFunction} from "express";
import { configuration } from "./config/libConfig.ts";
import morgan from 'morgan';
import * as fs from "node:fs";
import dotenv from 'dotenv';
import {errorHandler} from "./errorHandler/errorHandler.js";
import {employeeRouter} from "./routes/employeeRouter.js";
import {authenticate, skipRoutes} from "./middleware/authentication.js";
import {authorize, checkAccountById} from "./middleware/authorization.js";
import {Roles} from "./utils/libTypes.js";
import {employeeServiceMongo} from "./services/EmployeeServiceImplMongo.js";

export const launchServer = () => {
    // ==================== load environments ====================

    dotenv.config();

    console.log("process.env "+ process.env)

    const app = express();

    app.listen(configuration.port, () => console.log(`Server runs http://localhost:${configuration.port}`));
    const logStream = fs.createWriteStream('access.log', { flags: 'a' });

    // ===================== Middleware ===================
    app.use(authenticate(employeeServiceMongo));
    app.use(skipRoutes(configuration.skipRoutes));
    app.use(authorize(configuration.pathRoles as Record<string, Roles[]>));

    app.use(express.json());

    app.use(checkAccountById(configuration.checkIdRoutes));



    app.use(morgan('dev')); // пишем в консоль
    app.use(morgan('combined', { stream: logStream }));





    // ===================== Router ===================

    app.use('/employee', employeeRouter)


    app.use((req, res) => {
        res.status(404).send("Page not found")
    })

    //  function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    //     console.error("Server error: ", err);   // вот тут будет полный объект ошибки
    //     // @ts-ignore
    //     res.status(500).json({ message: "Internal Server Error", error: err.message });
    // }

    //================ ErrorHandler ================

    app.use(errorHandler);

}