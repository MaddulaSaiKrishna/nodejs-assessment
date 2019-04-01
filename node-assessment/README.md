# Awesome Project Build with TypeORM

# node-assessment:

Steps to run this project:

1. Clone the repo or download the build.
2. Run `npm i` command
3. Setup database settings inside `ormconfig.json` file
4. Create a database with name given in step 3 if not already exist and insert some teacher data into teacher table.
5. Run `npm start` command

**Note:** *If no data is available in the database, 3 teachers (teacher1@gmail.com, teacher2@gmail.com, teacher3@gmail.com) and 3 students(student1@gmail.com, student2@gmail.com, student3@gmail.com) will be created as per code, to facilitate using API's. If this is not required, index.ts line 43-65 has to be commented out.*

# /api/register:

1. It will register the students to the given teacher.
2. It will throw error if teacher is not found in Database
3. It will add the student to database if not exists

# /api/commonstudents:

1. It will find the common students for given teacher(s)
2. It will throw error if teacher is not found in Database

# /api/suspend:

1. It will suspend the student.
2. It will throw error if student is not found in Database

# /api/retrivefornotifications:

1. It will find the list of students who can recieve a specific notification.
2. It will throw error if teacher is not found in Database


# Code includes test cases.
