import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";

import { Student } from './Student';


/**
 * Defines the entity for Teacher.
 *
 * @export
 * @class Teacher
 */

@Entity()
export class Teacher {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @ManyToMany(type => Student, student => student.teachers)
    @JoinTable()
    students: Student[];

}
