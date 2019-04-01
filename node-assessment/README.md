# Awesome Project Build with TypeORM

# node-assessment:

Steps to run this project:

1. Clone the repo or download the build.
2. Run `npm i` command
3. Setup database settings inside `ormconfig.json` file
4. Create a database and insert some teacher data into teacher table.
5. Run `npm start` command

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