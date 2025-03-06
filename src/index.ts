import express from 'express'
import rootRouter from './routers'
import cors from 'cors'
import { PORT_APP } from './config/env'
import { AppDataSource } from './DB'
import cookieParser from "cookie-parser";


const app = express()
app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use('/api',rootRouter)

const main = async () => {
    try {
        await AppDataSource.initialize()
        console.log("Database connected successfully!");

        await AppDataSource.runMigrations();
        console.log("Migrations executed!");

        app.listen(PORT_APP, () => {
            console.log(`Server started on PORT: ${PORT_APP}`);
        })
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

main();