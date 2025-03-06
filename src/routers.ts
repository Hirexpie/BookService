import { Router } from "express"
import auth from './entpoints/auth/router'
import books from './entpoints/books/router'

// /api
const rout = Router()

rout.use('/auth',auth)
rout.use('/books',books)




export default rout