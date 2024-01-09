import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.model';
import { Book as BookEntity } from './book.entity';
import { CreateBookDTO } from './dtos/create-book.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { QueryBookDto } from './dtos/query-book.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { AllowRoles } from 'src/auth/role.decorator';
import { UserRolesEnum } from 'src/users/users.enum';
// import { CreateBookDTO } from './dtos/create-book.dto';
@ApiBearerAuth()
@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [CreateBookDTO],
    description: 'The record has been successfully created.',
  })
  getBooks(@Query() query: QueryBookDto): Promise<any> {
    console.log('query is', query);
    return this.bookService.getAllBooks(query);
  }

  @AllowRoles(UserRolesEnum.Author, UserRolesEnum.Admin)
  @UseGuards(RoleGuard)
  @Post()
  @ApiResponse({
    status: 201,
    type: CreateBookDTO,
    description: 'The record has been successfully created.',
  })
  async addBook(
    @Body() book: CreateBookDTO,
    @Request() req: Request,
  ): Promise<BookEntity> {
    // console.log('in book controller', book);
    const { user } = req as { user?: { id: string; role: string } };

    return this.bookService.addBook(book, user.id);
  }

  @Put(':name')
  @ApiResponse({
    status: 201,
    type: UpdateBookDTO,
    description: 'new updated record',
  })
  updateBook(@Param('name') name: string, @Body() book: UpdateBookDTO): Book {
    console.log('in book controller update', book);
    // console.log(typeof likes === 'number');

    return this.bookService.updateBook(name, book);
  }
}
