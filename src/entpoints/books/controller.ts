import { bindMethods } from "../BaindMhetods"
import { VerifyRequest } from "../checkAuth"
import { Response } from "express"
import { BookRepository, UserRepository } from "../../DB/repositotys"


export interface IBookDTO {
    id: string;
    title: string;
    description: string;
    author_id: string;
    author: {
        id: string;
        name: string;
    };
    created_at: Date;
    updated_at: Date;
}





class controller {
    constructor() {
        bindMethods(this)
    }

    // private
    private async getBookDto(bookId:string): Promise<IBookDTO | undefined> {
        
        const book = await BookRepository.findOne({
            where: {
                id: bookId
            }
        })
        
        if (!book) {
            return undefined
        }

        const user = await UserRepository.findOne({
            where: {
                id: book?.author_id
            }
        })

        if (!user) {
            return undefined
        }

        return {
            id: bookId,
            title: book.title,
            description: book.description,
            author_id: book.author_id,
            author: {
                id: book.author_id,
                name: user.name
            },
            created_at: book.created_at,
            updated_at: book.updated_at
        }
    }







    //public

    // /books
    public async createBook(req: VerifyRequest,res: Response): Promise<any> {
        try {
            const { title, description } = req.body;
            const userId = req.authData?.userId


            console.log(userId)


            if (!title || !description ) {
                return res.status(400).json({ message: "Все поля (title, description) обязательны" });
            }


            const newBook = BookRepository.create({
                title,
                description,
                author_id: userId
            });

            await BookRepository.save(newBook);

            return res.status(201).json(newBook);
        } catch (error) {
            console.error("Ошибка при создании книги:", error);
            return res.status(500).json({ message: "Ошибка сервера", error });
        }
    } 

    // /books
    public async getBooksList(req: VerifyRequest,res: Response): Promise<any> {
        try {
            let page = parseInt(req.query.page as string) || 0;
            const limit = 100

            if (page < 0) page = 0;

            const totalBooks = await BookRepository.count();

            const books = await BookRepository.find({
                skip: page * limit,
                take: limit,
            });

            const booksDto: IBookDTO[] = await Promise.all(
                books.map(async (book) => {
                    const bookDto = await this.getBookDto(book.id);
                    return bookDto as IBookDTO;
                })
            );

            return res.status(200).json({
                page,
                limit,
                totalBooks,
                totalPages: Math.ceil(totalBooks / limit),
                books: booksDto,
            });
        } catch (e) {
            return res.status(500).json({ message: "Ошибка сервера", e });
        }
    } 

    // /books/:id
    public async getBookById(req: VerifyRequest,res: Response): Promise<any> {
        try {

            const bookId = req.params.id.replace(':','');
            console.log(bookId)
            const bookDto = await this.getBookDto(bookId)

            if (!bookDto) {
                res.status(400).json({message:'книга или автор не существует'})
                return
            }

            res.json({Book:bookDto})
        }
        catch (e) {
            return res.status(500).json({ message: "Ошибка сервера", e });
        }


    } 

    // /books/:id
    public async updateBook(req: VerifyRequest, res: Response): Promise<any> {
        try {
            const bookId = req.params.id.replace(':','');
            const { title, description } = req.body;

            const book = await BookRepository.findOne({ where: { id: bookId } });

            if (!book) {
                return res.status(404).json({ message: "Книга не найдена" });
            }

            book.title = title || book.title;
            book.description = description || book.description;

            await BookRepository.save(book);

            return res.status(200).json({ message: "Книга обновлена", book });

        } catch (e) {
            return res.status(500).json({ message: "Ошибка сервера", e });
        }
    }

}

export default new controller()
