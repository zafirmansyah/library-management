import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookMutation } from '../../entities/book-mutation.entity';
import { BookMutationService } from './book-mutation.service';
import { Book } from '../../entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookMutation, Book])],
  providers: [BookMutationService],
  exports: [BookMutationService], // Jangan lupa eksport servicenya!
})
export class BookMutationModule {}
