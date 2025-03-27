import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entities/book.entity';
import { BookMutation } from '../entities/book-mutation.entity';
import { BookMutationModule } from './books-mutation/book-mutation.module';
import { BookMutationService } from './books-mutation/book-mutation.service';
import { User } from 'src/entities/user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, BookMutation, User]),
    BookMutationModule,
    HttpModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, BookMutationService],
})
export class BooksModule {}
