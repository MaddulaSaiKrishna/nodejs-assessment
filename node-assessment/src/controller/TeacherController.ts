import { getRepository, In } from "typeorm";
import { NextFunction, Request, Response } from "express";

import { Teacher } from "../entity/Teacher";
import { Student } from './../entity/Student';
import HttpException from "../errors/error";


/**
 * Class which handles requests, processes it and returns response.
 *
 * @export
 * @class TeacherController
 */
export class TeacherController {

    private teacherRepository = getRepository(Teacher);
    private studentRepository = getRepository(Student);

    /**
     * API used to register set of students to a given teacher.
     *
     * @param {Request} request
     * @param {Response} response
     * @param {NextFunction} next
     * @returns
     * @memberof TeacherController
     */
    async register(request: Request, response: Response, next: NextFunction) {
        const teacherEmail = request.body["teacher"];
        const studentEmails = request.body["students"];
        
        if (!teacherEmail || !studentEmails) {
            return response.status(400).send({ "error": "Missing properties in request data." });
        }
        try{
            // Getting teachers data.
            const teacherData = await this.teacherRepository.findOne({ email: teacherEmail }, { relations: ["students"] });
    
            // Checking Teacher and Student availability.
            if (teacherData) {
                // If Teacher Exists, we are adding missing students.
                const toBeAddedStudents = [];
                for (let i = 0; i < studentEmails.length; i++) {
                    let isExist = await this.studentRepository.findOne({ "email": studentEmails[i] });
                    if (!isExist) {
                        // If student not exisits
                        toBeAddedStudents.push({ email: studentEmails[i] });
                    }
                }
                if (toBeAddedStudents.length > 0)
                await this.studentRepository.insert(toBeAddedStudents);
            } else {
                // If Teacher not Exists, throwing error with a message.
                response.status(400);
                return { "error": "Teacher not exists." }
            }
    
            // Getting student(s) record.
            const studentsData = await this.studentRepository
                .createQueryBuilder("student")
                .where("student.email IN (:...email)", { email: studentEmails })
                .getMany();
    
            // Updating teacher record with updated students.
            let alreadyMappedStudents = teacherData.students ? teacherData.students.slice() : [];
            const studentsToRegister = studentsData.concat(alreadyMappedStudents);
            teacherData.students = studentsToRegister;
    
            // Save the record.
            response.status(204);
            return await this.teacherRepository.save(teacherData);
        }
        catch (error) {
            next(new HttpException(500, error.message));
        }
    }

    
    /**
     * API used to find common students to a given teacher(s).
     *
     * @param {Request} request
     * @param {Response} response
     * @param {NextFunction} next
     * @returns
     * @memberof TeacherController
     */
    async commonstudents(request: Request, response: Response, next: NextFunction) {
        const query = request.query["teacher"];// Array of teachers emails or string of teacher email.

        const findCommonElements = (array1, array2) => {
            let filteredResults = array1.filter(value => array2.includes(value))
            return filteredResults
        }
        try {
            if (Array.isArray(query) == true) {
                // Array of teachers
                let studentsData = [];
                for (let i = 0; i < query.length; i++) {
                    const teacherData = await this.teacherRepository.findOne({ email: query[i] }, { relations: ["students"] });
                    if (teacherData) {
                        const students = teacherData.students.map((data) => {
                            return data.email
                        });
                        if (i === 0) {
                            studentsData = students;
                        } else {
                            // find common items.
                            studentsData = findCommonElements(studentsData, students);
                        }
                    } else {
                        return response.status(400).send({ "error": "One or more teacher(s) not exists!" });
                    }
                }
                response.status(200).send({
                    "students": studentsData
                });
            } else {
                // Single teacher
                const teacherData = await this.teacherRepository.findOne({ email: query }, { relations: ["students"] });
                if (teacherData) {
                    const students = teacherData.students.map((data) => {
                        return data.email
                    });
                    response.status(200).send({
                        "students": students
                    });
                } else {
                    response.status(400).send({ "error": "Teacher not exists!" });
                }
            }
        }
        catch (error){
            next(new HttpException(500, error.message));
        }
        

    }

    /**
     * API used to suspend an existing student.
     *
     * @param {Request} request
     * @param {Response} response
     * @param {NextFunction} next
     * @memberof TeacherController
     */
    async suspend(request: Request, response: Response, next: NextFunction) {       
        try {
            const studentData = await this.studentRepository.findOne({ email: request.body.student });
            if (studentData) {
                studentData.isSuspended = 1;
                const responseData = await this.studentRepository.save(studentData);
                response.status(204).send(responseData);
            } else {
                response.status(400).send({ "error": "Student not found!" });
            }
        }
        catch (error) {
            next(new HttpException(500, error.message));
        }
    }

    
    /**
     * API used to retrive an array of student email ID's who can recieve notifictaion sent by specific teacher.
     *
     * @param {Request} request
     * @param {Response} response
     * @param {NextFunction} next
     * @memberof TeacherController
     */
    async retrievefornotifications(request: Request, response: Response, next: NextFunction) {
        try {
            const getTeacherData = await this.teacherRepository.findOne({ "email": request.body["teacher"] }, { relations: ["students"] });
            
            if (getTeacherData) {
                // Filtering not-suspended registered students of a given teacher.
                const registeredStudents = getTeacherData.students.filter((student) => {
                    return student.isSuspended == 0;
                });

                const registeredStudentsList = registeredStudents.map((student) => {
                    return student.email;
                });

                // Getting students emails which are tagges in the notification.
                const notificationMatches = request.body["notification"].match(/([@]{1}[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                let taggedStudents = [];
                let taggedStudentsData = [];
                if (notificationMatches){
                    taggedStudents = notificationMatches.map((data) => data.substring(1));
                    // Getting student(s) record(s) who are not-suspended.
                    taggedStudentsData = await this.studentRepository
                        .createQueryBuilder("student")
                        .where("student.email IN (:...email) AND student.isSuspended = :suspend", { email: taggedStudents, suspend: 0 })
                        .getMany();
                }
                const allStudents = registeredStudentsList.concat(taggedStudents);

                response.status(200).send({ "recipients": allStudents });
            } else {
                response.status(400).send({ "error": "Teacher not found." });
            }
        }
        catch (error) {
            next(new HttpException(500, error.message));
        }
    }
}
