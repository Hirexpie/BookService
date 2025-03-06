import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../config/env";

export interface ITokenData {
    userId: string;
}

export interface VerifyRequest extends Request {
    authData?: ITokenData;
}

export const JWTCheck = (req: VerifyRequest, res: Response, next: NextFunction):any => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (!token) {
        return res.status(401).json({ message: "Ошибка аутентификации: отсутствует токен" });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET) as ITokenData;
        
        if (!decoded.userId) {
            return res.status(401).json({ message: "Ошибка аутентификации: неверный токен" });
        }

        req.authData = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ message: "Ошибка аутентификации: недействительный токен" });
    }
};
