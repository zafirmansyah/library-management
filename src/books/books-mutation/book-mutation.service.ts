import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookMutation } from '../../entities/book-mutation.entity';
import { Book } from '../../entities/book.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class BookMutationService {
  constructor(
    @InjectRepository(BookMutation)
    private mutationRepository: Repository<BookMutation>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async createMutation(
    bookId: number, // Ubah parameter jadi bookId jika hanya ID yang dikirim
    user: User,
    keterangan: string,
    debet: number,
    kredit: number,
    id_pelanggan?: number,
  ): Promise<BookMutation> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['mutations'],
    });
    if (!book) {
      throw new Error('Book not found');
    }
    const mutation = this.mutationRepository.create({
      book: { id: book.id }, // Hanya kirim ID
      user: { id: user.id }, // Hanya kirim ID
      keterangan,
      debet: debet || 0,
      kredit: kredit || 0,
      id_pelanggan: id_pelanggan || null,
    });
    console.log('Mutation data before saving:', mutation);
    console.log('Mutation sebelum save:', JSON.stringify(mutation, null, 2));
    return this.mutationRepository.save(mutation);
  }
}
