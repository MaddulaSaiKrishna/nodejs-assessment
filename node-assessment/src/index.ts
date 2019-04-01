import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";

import HttpException from "./errors/error";

import { Teacher } from './entity/Teacher';
import { Student } from './entity/Student';

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // Exception Handler
    app.use(function (error: HttpException, request, response, next) {
        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        response
            .status(status)
            .send({
                "error": message,
            })
    })
    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new users for test
    // await connection.manager.save(connection.manager.create(Teacher, {
    //     email: "teacher1@gmail.com"
    // }));
    // await connection.manager.save(connection.manager.create(Teacher, {
    //     email: "teacher2@gmail.com"
    // }));
    // await connection.manager.save(connection.manager.create(Teacher, {
    //     email: "teacher3@gmail.com"
    // }));

    // await connection.manager.save(connection.manager.create(Student, {
    //     email: "student1@gmail.com"
    // }));
    // await connection.manager.save(connection.manager.create(Student, {
    //     email: "student2@gmail.com"
    // }));
    // await connection.manager.save(connection.manager.create(Student, {
    //     email: "student3@gmail.com"
    // }));

    console.log("Express server has started on port 3000.");

}).catch(error => console.log(error));
