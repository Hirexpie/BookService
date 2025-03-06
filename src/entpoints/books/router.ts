import { Router } from "express";
import controller from "./controller"
import { JWTCheck } from "../checkAuth";

// /books

const rout = Router();

rout.post('', JWTCheck, controller.createBook)

rout.get('', controller.getBooksList)

rout.get('/:id', controller.getBookById)

rout.patch('/:id', JWTCheck, controller.updateBook)




export default rout