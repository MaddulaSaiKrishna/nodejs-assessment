import {TeacherController} from "./controller/TeacherController";

export const Routes = [{
    method: "post",
    route: "/api/register",
    controller: TeacherController,
    action: "register"
}, {
    method: "get",
    route: "/api/commonstudents",
    controller: TeacherController,
    action: "commonstudents"
}, {
    method: "post",
    route: "/api/suspend",
    controller: TeacherController,
    action: "suspend"
}, {
    method: "post",
    route: "/api/retrievefornotifications",
    controller: TeacherController,
    action: "retrievefornotifications"
}];