import winston from "winston";
import {configuration} from "../config/libConfig.js";


export const logger = winston.createLogger({
    level: configuration.logLevel,
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
        new winston.transports.File({filename: 'logs/combine.log'}),
        new winston.transports.File({filename: 'logs/warning.log', level: 'warn'}),
        new winston.transports.File({filename: 'logs/actions.log', level: 'info'})
    ]
})