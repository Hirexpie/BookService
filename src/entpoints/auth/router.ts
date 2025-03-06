import { Router } from "express";
import controller from "./constroller"
import { JWTCheck } from "../checkAuth";

// /auth

const rout = Router();

rout.post('/register', controller.register)

rout.post('/login', controller.login)

rout.get('/refresh', controller.refresh)

rout.get('/me',JWTCheck, controller.me)

rout.delete('/logout', controller.logout)


export default rout