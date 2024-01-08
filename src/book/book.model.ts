// import { ApiProperty } from '@nestjs/swagger';
import { BookGenres } from './dtos/create-book.dto';

export class Book {
  // @ApiProperty()
  name: string;
  author: string;
  email: string;
  sales: number;
  likes: number;
  genre: BookGenres[];
}
