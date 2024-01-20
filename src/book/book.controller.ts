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
// import { Book } from './book.model';
import { Book } from './book.entity';
import { CreateBookDTO } from './dtos/create-book.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { QueryBookDto } from './dtos/query-book.dto';
import { RoleGuard } from 'src/auth/role.guard';
import { AllowRoles } from 'src/auth/role.decorator';
import { UserRolesEnum } from 'src/users/users.enum';
import { SwaggerAPIResponse } from 'src/utils/swagger-response.dto';
import { Public } from 'src/auth/public.decorator';
@ApiBearerAuth()
@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @Public()
  @ApiResponse({
    status: 200,
    type: Book,
    description: 'Response type for book returned.',
  })
  async getBooks(@Query() query: QueryBookDto): Promise<SwaggerAPIResponse> {
    console.log('query is', query);
    const data = await this.bookService.getAllBooks(query);
    return new SwaggerAPIResponse(data);
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
  ): Promise<Book> {
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
  updateBook(@Param('name') name: string, @Body() book: UpdateBookDTO): any {
    console.log('in book controller update', book);
    // console.log(typeof likes === 'number');

    return this.bookService.updateBook(name, book);
  }
}
