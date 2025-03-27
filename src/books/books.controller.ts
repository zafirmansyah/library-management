import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('books')
// @UseGuards(JwtAuthGuard) // Semua route di BooksController membutuhkan autentikasi JWT
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  //Tambah Buku
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  create(@Body() createBookDto: CreateBookDto, @Request() req) {
    return this.booksService.create(createBookDto, req.user);
  }

  //Ambil Semua Buku
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.booksService.findAll();
  }

  //Ambil Buku Berdasarkan ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  //Update Buku
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  //Hapus Buku
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }

  @Post('borrow/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async borrowBook(@Param('id') id: number, @Request() req) {
    return this.booksService.borrowBook(id, req.user, req.body.user);
  }

  @Post('return/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async returnBook(@Param('id') id: number, @Request() req) {
    return this.booksService.returnBook(id, req.user, req.body.user);
  }

  @Get('isbn/:isbn')
  @UseGuards(JwtAuthGuard)
  async getBookByISBN(@Param('isbn') isbn: string) {
    return this.booksService.findBookByISBN(isbn);
  }

  @Post('add-by-isbn/:isbn')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async addBookByISBN(@Param('isbn') isbn: string, @Request() req) {
    return this.booksService.createBookByISBN(isbn, req.user);
  }
}
