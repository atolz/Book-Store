import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './book.model';
import { Book as BookEntity } from './book.entity';
// import { BookGenres } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { books } from './book-list.const';
import { QueryBookDto } from './dtos/query-book.dto';
import {
  // ArrayContainedBy,
  // ArrayContains,
  ArrayOverlap,
  ILike,
  Repository,
} from 'typeorm';
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

  getAllBooks = async (query: QueryBookDto): Promise<BookEntity[]> => {
    let { page = 1, limit } = query;
    const { genre, search } = query;
    console.log(page, limit, genre, search);
    if (page || limit) {
      (page = page ?? 1), (limit = limit ?? 100);
    }

    const books: [BookEntity[], number] = await this.bookRepo.findAndCount({
      where:
        search || genre
          ? [
              {
                name: ILike(`%${search}%`),
              },
              {
                description: ILike(`%${search}%`),
              },
              {
                author: {
                  name: ILike(`%${search}%`),
                },
              },
              { genre: genre ? ArrayOverlap([genre]) : undefined },
            ]
          : {},

      relations: { author: { books: false } },
      select: {
        author: {
          id: true,
          name: true,
          books: { id: true },
        },
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
    });

    // const bookQuery = this.bookRepo.createQueryBuilder().where({});

    // if (search) {
    //   bookQuery.andWhere('name ILIKE :search OR description ILIKE :search', {
    //     search: `%${search}%`, // Assuming you want to perform a case-insensitive partial match
    //   });
    // }
    // console.log('query is', bookQuery.getSql());
    // if (page) {
    //   const skipAmount = (page - 1) * limit;
    //   bookQuery.skip(skipAmount).take(limit);
    // }

    // books = await bookQuery.getMany();

    // const data = {
    //   pagination: {
    //     current_page: page ?? 1,
    //     per_page: limit ?? books[1],
    //     total_pages: limit ? Math.ceil(books[1] / limit) : 1,
    //     total_count: books[1],
    //     showing:
    //       page && limit && page <= Math.ceil(books[1] / limit)
    //         ? [
    //             (page - 1) * limit + 1,
    //             page * limit > books[1] ? books[1] : page * limit,
    //           ]
    //         : [],
    //   },
    //   data: books[0],
    // };

    // https://exercism.org/api/v2/hiring/testimonials?page=1&exercise=&order=newest_first
    //   "pagination": {
    //     "current_page": 1,
    //     "total_count": 4322,
    //     "total_pages": 217
    // },

    //   https://exercism.org/api/v2/hiring/testimonials?page=1&track=c&exercise=&order=newest_first
    //   "pagination": {
    //     "current_page": 1,
    //     "total_count": 202,
    //     "total_pages": 11
    // },

    // if (page && limit) {
    //   const from = (page - 1) * limit;
    //   const to = limit ? page * limit : null;
    //   return this.books.slice(from, to);
    // }
    return books[0];
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

    const newBook = this.bookRepo.create(data);
    newBook.author = author;
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
