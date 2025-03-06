import { AppDataSource } from ".";
import { User } from "./entities/user";
import { Book } from "./entities/book";
import { Refresh } from "./entities/refresh";

export const UserRepository = AppDataSource.getRepository(User)
export const BookRepository = AppDataSource.getRepository(Book)
export const RefreshRepository = AppDataSource.getRepository(Refresh)

export default [ User, Book, Refresh ]
