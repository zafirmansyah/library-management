import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Book } from './src/entities/book.entity';
import { BookMutation } from './src/entities/book-mutation.entity';
import { User } from './src/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql', // Sesuaikan dengan database yang digunakan
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password', // Sesuaikan dengan database kamu
  database: 'library_management',
  entities: [Book, BookMutation, User],
  migrations: ['src/migrations/*.ts'], // Perhatikan path ini!
  synchronize: false, // Jangan true di production
  logging: true,
});
