import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ITokenData, VerifyRequest } from '../checkAuth';
import { BookRepository, UserRepository } from "../../DB/repositotys";
import { Request,Response } from "express";
import { bindMethods } from "../BaindMhetods";
import { RefreshRepository } from '../../DB/repositotys'
import { ACCESS_SECRET,REFRESH_SECRET } from "../../config/env";
class constroller {
    constructor() {
        bindMethods(this)
    }
    // private
    private async createTokens(userId: string): Promise<{accessToken: string,refreshToken: string}> {
        const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken };
    }


    private createAccess(userId:string):string {
        return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn:'15m' })
    }
    // public

    // /register
    public async register(req:Request, res:Response): Promise<any> {
        try {
            const { username, email, password } = req.body;
      
            // 🔹 Проверка пустых полей
            if (!username || !email || !password) {
              return res.status(400).json({ message: "Все поля обязательны" });
            }
            
            // 🔹 Проверка длины пароля
            if (password.length < 6) {
              return res.status(400).json({ message: "Пароль должен быть не менее 6 символов" });
            }
      

      
            // 🔹 Проверка существующего пользователя
            const existingUser = await UserRepository.findOne({ where: { email } });
            if (existingUser) {
              return res.status(400).json({ message: "Пользователь уже существует" });
            }

      
            // 🔹 Хеширование пароля
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
      
            // 🔹 Создание нового пользователя
            const newUser = UserRepository.create({
              name:username,
              email,
              password: hashedPassword,
            });
      
            await UserRepository.save(newUser);
      
            return res.status(201).json({ message: "Пользователь зарегистрирован" });
        } 
        catch (error) {
            console.error("Ошибка регистрации:", error);
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // /login
    public async login(req:Request, res:Response ): Promise<any> {
        try {
            const { email,password } = req.body
            const user = await UserRepository.findOne({
                where:{email}
            })
            if (!user) {
                return res.status(400).json({ message: "Неверный email или пароль" });
                }
        
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Неверный email или пароль" });
            }

            const ip = (req.headers['x-forwarded-for'] as string) ||
            req.socket.remoteAddress || 
            req.ip || '';

            const {accessToken,refreshToken} = await this.createTokens(user.id.toString());
            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
            const NewToken = RefreshRepository.create({
                userId: user.id, 
                token: refreshToken,
                ipAddress: ip,
                isActive: true
            })
            
            await RefreshRepository.save(NewToken);
            res.status(201).json({accessToken})
        }
        catch (error) {
          res.status(500).json({ message: "Ошибка сервера", error });

        }
    }

    // /refresh
    public async refresh(req: Request, res: Response): Promise<any> {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: "Ошибка аутентификации: отсутствует refreshToken" });
            }
    
            // Проверяем, есть ли токен в БД и активен ли он
            const refreshData = await RefreshRepository.findOne({
                where: { token: refreshToken }
            });
    
            if (!refreshData || !refreshData.isActive) {
                return res.status(401).json({ message: "Ошибка аутентификации: недействительный refreshToken" });
            }
    
            // Важно! Проверяем подпись токена, а не просто декодируем
            let decoded: ITokenData;
            try {
                decoded = jwt.verify(refreshToken, REFRESH_SECRET) as ITokenData;
            } catch (err) {
                return res.status(401).json({ message: "Ошибка аутентификации: refreshToken недействителен" });
            }
    
            // Проверяем, существует ли пользователь
            const user = await UserRepository.findOne({ where: { id: decoded.userId } });
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
    
            // Генерируем новый accessToken
            const accessToken = this.createAccess(user.id.toString());
    
            return res.status(200).json({ accessToken });
        } catch (e) {
            console.error("Ошибка обновления токена:", e);
            return res.status(500).json({ message: "Ошибка сервера", error: e });
        }
    }
    
    // /logout
    public async logout(req: Request, res: Response): Promise<any> {
        try {

            const refreshToken = req.cookies.refreshToken;
            
            
            if (!refreshToken) {
                res.status(401).json({ message: 'Ошибка аутентификации' });
                return 
            }
            
            
            const refreshData = await RefreshRepository.
                update({
                    token: refreshToken
                }, {
                    isActive: false
                });
            
            if (refreshData.affected === 0) {
                return res.status(404).json({ message: 'Токен не найден' });
            }
    
            res.clearCookie("refreshToken");
    
            return res.status(200).json({ message: 'Выход выполнен успешно' });
            

        }
        catch (error) {
            return res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    // /me
    public async me(req:VerifyRequest, res:Response): Promise<any> {
        try {

            const userId = req.authData?.userId 

            const user = await UserRepository.findOne({
                where: {
                    id: userId
                }
            })  
            console.log(userId)
            if (!user) {
                return res.status(400).json({message:'такого пользаватель не существует!!'})
            }

            const books = await BookRepository.find({
                where: {
                    author_id: user.id
                }
            })

            res.json({
                userId: userId,
                name: user.name,
                countBooks: books.length,
                email: user.email,
                created_at: user.created_at
            })
        }
        catch (e) {
            res.status(500).json(e)
        }
    }
}



export default new constroller()