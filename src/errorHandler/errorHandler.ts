import {Request, Response, NextFunction} from "express";
import {HttpError} from "./HttpError.ts";
import {logger} from "../Logger/winston.js";


export const errorHandler =
    (err: Error , req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        logger.error(err.message, {
            status: err.status,
            method: req.method,
            url: req.originalUrl,
            stack: err.stack,
        })
       return  res.status(err.status).send(err.message);

    }
    else {
        logger.error("Unknown server error!",  {
            method: req.method,
            url: req.originalUrl,
            stack: err.stack,
        });

        return res.status(500).send("Unknown server error!");
    }
}