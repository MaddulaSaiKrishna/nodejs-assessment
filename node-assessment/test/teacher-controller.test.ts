import * as chai from "chai";
import chaiHttp = require("chai-http");
const expect = chai.expect;


chai.use(chaiHttp);

const app = 'http://localhost:3000';

describe("Teacher controller", () => {
    before(function () {
    });

    describe("With /api/register",() => {
        it("Should have an ability to map student(s) to a teacher", (done) => {
            let request = {
                "teacher": "teacher1@gmail.com",
                "students":
                    [
                        "studentjon333@gmail.com"
                    ]
            };
            chai.request(app).post("/api/register")
                .send(request)
                .end((err, res) => {
                    expect(res.status).to.equal(204);
                    expect(res.body.error).to.equal(undefined);
                    done();
                });
        });

        it("Should return error message if teacher not found while mapping students to teacher", (done) => {
            let request = {
                "teacher": "teachernotexists@gmail.com",
                "students":
                    [
                        "studentjon22@gmail.com"
                    ]
            };
            chai.request(app).post("/api/register")
                .send(request)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.error).to.equal('Teacher not exists.');
                    done();
                });
        });
        it("Should throw error message if request doesn't have required details", (done) => {
            let request = {
                "students":
                    [
                        "studentjon22@gmail.com"
                    ]
            };
            chai.request(app).post("/api/register")
                .send(request)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.error).to.equal('Missing properties in request data.');
                    done();
                });
        });
    });

    describe("With /api/commonstudents", () => {
        it("Should retrieve  all students of a teacher, if one valid teacher is given in request params", (done) => {
            chai.request(app).get("/api/commonstudents?teacher=teacher1@gmail.com")
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('students');
                    expect(res.body).not.to.have.property('error');
                    done();
                });
        });
        it("Should reteive common students of a teachers, if multiple teachers are given in request params", (done) => {
            chai.request(app).get("/api/commonstudents?teacher=teacher1@gmail.com&teacher=teacher2@gmail.com")
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('students');
                    expect(res.body).not.to.have.property('error');
                    done();
                });
        });
        it("Should return error message if teacher not found", (done) => {
            chai.request(app).get("/api/commonstudents?teacher=teachernotfound@gmail.com&teacher=teacher2@gmail.com")
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body).not.to.have.property('students');
                    expect(res.body).to.have.property('error');
                    done();
                });
        });
    });

    describe("With /api/suspend", () => {
        it("Should suspend the given student if student is available", (done) => {
            let request = {
                "student":"studentjon222@gmail.com"
            };
            chai.request(app).post("/api/suspend")
                .send(request)
                .end((err, res) => {
                    expect(res.status).to.equal(204);
                    done();
                });
        });
        it("Should show error message if student not exists", (done) => {
            let request = {
                "student":"studentjonnotfound@gmail.com"
            };
            chai.request(app).post("/api/suspend")
                .send(request)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.error).to.equal('Student not found!');
                    done();
                });
        });
    });

    describe("With /api/retrievefornotifications", () => {
        it("Should retrieve the list of students who are not suspended who will get notifications.", (done) => {
            let request = {
                "teacher": "teacher1@gmail.com",
                "notification": "Hello students! @studentjon22@example.com @studentmiche@example.com"
            };
            chai.request(app).post("/api/retrievefornotifications")
                .send(request)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).not.to.have.property('error');
                    expect(res.body).to.have.property('recipients').with.lengthOf.at.least(1);
                    done();
                });
        });
        it("Should show error message if the teacher not exist.", (done) => {
            let request = {
                "teacher": "teachernotfound@gmail.com",
                "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com"
            };
            chai.request(app).post("/api/retrievefornotifications")
                .send(request)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body).to.have.property('error');
                    expect(res.body.error).to.equal('Teacher not found.');
                    expect(res.body).not.to.have.property('recipients');
                    done();
                });
        });
    });
});