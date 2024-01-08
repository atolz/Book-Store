/* eslint-disable prettier/prettier */
import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateBookDTO } from './create-book.dto';

export class UpdateBookDTO extends PartialType(
  OmitType(CreateBookDTO, [
    'email',
    'name',
    'likes',
    'sales',
    'createDate',
  ] as const),
) {}
