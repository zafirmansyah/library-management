import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { User } from '../entities/user.entity';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { BookMutationService } from './books-mutation/book-mutation.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private bookMutationService: BookMutationService,
    private readonly httpService: HttpService,
  ) {}

  // Tambah Buku
  async create(createBookDto: CreateBookDto, user: User): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    const newBook = await this.bookRepository.save(book);
    // Catat mutasi stok masuk
    await this.bookMutationService.createMutation(
      newBook.id,
      user,
      'Penambahan Stock Buku',
      newBook.stock,
      0,
    );

    return newBook;
  }

  // Ambil Semua Buku
  async findAll(): Promise<Book[]> {
    // return this.bookRepository.find();
    return this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect(
        'book.mutations',
        'mutation',
        'mutation.bookId = book.id',
      )
      .select([
        'book.id',
        'book.title',
        'book.author',
        'book.category',
        'book.createdAt',
        'COALESCE(SUM(mutation.debet - mutation.kredit), 0) AS saldo_stock',
      ])
      .groupBy('book.id')
      .getRawMany();
  }

  // Ambil Buku Berdasarkan ID
  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect(
        'book.mutations',
        'mutation',
        'mutation.bookId = book.id',
      )
      .select([
        'book.id',
        'book.title',
        'book.author',
        'book.category',
        'book.createdAt',
        'COALESCE(SUM(mutation.debet - mutation.kredit), 0) AS saldo_stock',
      ])
      .where('book.id = :id', { id })
      .groupBy('book.id')
      .getRawOne();

    if (!book)
      throw new NotFoundException(`Buku dengan ID ${id} tidak ditemukan`);

    return book;
  }

  // Update Buku
  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    await this.bookRepository.update(id, updateBookDto);
    return this.findOne(id);
  }

  // Hapus Buku
  async remove(id: number): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Buku dengan ID ${id} tidak ditemukan`);
  }

  // Pinjam Buku
  async borrowBook(bookId: number, petugas: User, user: number): Promise<Book> {
    console.log('petugas :', petugas);
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    const vaUser = await this.userRepository.findOne({ where: { id: user } });
    console.log('peminjam : ', vaUser);
    if (!book) throw new NotFoundException('Book not found');
    if (book.stock <= 0) throw new BadRequestException('Stock not available');
    // Kurangi stok buku
    book.stock -= 1;
    await this.bookRepository.save(book);
    // Catat mutasi stok keluar
    // console.log('user => ', user);
    await this.bookMutationService.createMutation(
      book.id,
      petugas,
      `Buku ${book.title} dipinjam oleh ${vaUser.name}`,
      0,
      1,
      vaUser.id,
    );
    return book;
  }

  async returnBook(bookId: number, petugas: User, user: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    const vaUser = await this.userRepository.findOne({ where: { id: user } });
    if (!book) throw new NotFoundException('Book not found');
    // Kurangi stok buku
    book.stock += 1;
    await this.bookRepository.save(book);
    // Catat mutasi stok keluar
    console.log('user => ', user);
    await this.bookMutationService.createMutation(
      book.id,
      petugas,
      `Buku ${book.title} dikembalikan oleh ${vaUser.name}`,
      1,
      0,
      vaUser.id,
    );
    return book;
  }

  async findBookByISBN(isbn: string) {
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    const response = await firstValueFrom(this.httpService.get(url));

    const bookData = response.data[`ISBN:${isbn}`];

    if (!bookData) {
      return { message: 'Buku tidak ditemukan di Open Library' };
    }

    console.log(bookData);

    return {
      title: bookData.title,
      authors: bookData.authors?.map((author) => author.name),
      publish_date: bookData.publish_date,
      cover:
        bookData.cover?.large ||
        bookData.cover?.medium ||
        bookData.cover?.small,
    };
  }

  async createBookByISBN(isbn: string, user: User) {
    // Cari apakah ISBN sudah ada di database
    let book = await this.bookRepository.findOne({
      where: { isbn: isbn },
    });

    if (book) {
      // Jika buku sudah ada, tambahkan mutasi tanpa menambah buku baru
      await this.bookMutationService.createMutation(
        book.id,
        user,
        `Penambahan stok untuk buku dengan ISBN ${book.isbn}`,
        1,
        0,
      );
    } else {
      // Jika ISBN belum ada, tambahkan buku baru

      const bookData = await this.findBookByISBN(isbn);
      if (bookData.message) {
        throw new NotFoundException('Buku tidak ditemukan di Open Library');
      }

      book = this.bookRepository.create({
        title: bookData.title,
        author: bookData.authors.join(', '),
        isbn: isbn,
        stock: 1,
      });

      const savedBook = await this.bookRepository.save(book);

      // Catat mutasi awal stok masuk
      await this.bookMutationService.createMutation(
        savedBook.id,
        user,
        `Penambahan buku baru dengan ISBN ${savedBook.isbn}`,
        1,
        0,
      );
    }

    return book;
  }
}
