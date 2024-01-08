import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './book.model';
import { Book as BookEntity } from './book.entity';
// import { BookGenres } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { books } from './book-list.const';
import { QueryBookDto } from './dtos/query-book.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { UserRolesEnum } from 'src/users/users.enum';
import { AuthorEntity } from 'src/users/author.entity';
import { CreateBookDTO } from './dtos/create-book.dto';
// import { CreateBookDTO } from './dtos/create-book.dto';

@Injectable()
export class BookService {
  books: Book[] = books;

  constructor(
    @InjectRepository(BookEntity) private bookRepo: Repository<BookEntity>,
    private userService: UsersService,
  ) {}

  getAllBooks = (query: QueryBookDto): Book[] => {
    const { page, limit, genre } = query;
    console.log(page, limit, genre);

    if (page && limit) {
      const from = (page - 1) * limit;
      const to = limit ? page * limit : null;
      return this.books.slice(from, to);
    }
    return this.books;
  };

  addBook = async (
    data: CreateBookDTO,
    authorId: string,
  ): Promise<BookEntity> => {
    const author: AuthorEntity = await this.userService.getUser(
      authorId,
      undefined,
      UserRolesEnum.Author,
    );

    const newBook = this.bookRepo.create({ ...data, author });
    return await this.bookRepo.save(newBook);
    // this.books.push(book);
    // console.log(this.books);
    // return this.books[this.books.length - 1];
  };
  updateBook = (name: string, book: UpdateBookDTO): Book => {
    const bookIndex: number = this.books?.findIndex((el) => el.name == name);
    console.log('book index', bookIndex);
    const bookFound = this.books[bookIndex];
    if (bookIndex >= 0) {
      this.books[bookIndex] = { ...bookFound, ...book };
      return this.books[bookIndex];
    } else {
      throw new NotFoundException('Book not found');
      return;
    }
  };
}
