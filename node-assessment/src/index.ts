import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
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

    // insert new users for testing purposes.
    const teacherRepo = getRepository(Teacher);
    const allTeachers = await teacherRepo.find();
    if (allTeachers.length === 0 ){
        await teacherRepo.save([{
            email: "teacher1@gmail.com"
        }, {
            email: "teacher2@gmail.com"
        }, {
            email: "teacher3@gmail.com"
        }]);
    }

    const studentRepo = getRepository(Student);
    const allStudents = await studentRepo.find();
    if (allStudents.length === 0) {
        await studentRepo.save([{
            email: "student1@gmail.com"
        }, {
            email: "student2@gmail.com"
        }, {
            email: "student3@gmail.com"
        }]);
    }

    // start express server
    app.listen(3000);
    console.log("Express server has started on port 3000.");

}).catch(error => console.log(error));
