import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";

import { Teacher } from "./Teacher";


/**
 * Defines the entity for Student.
 *
 * @export
 * @class Student
 */

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    isSuspended: number;

    @ManyToMany(type => Teacher, teacher => teacher.students)
    teachers: Teacher[];
}
