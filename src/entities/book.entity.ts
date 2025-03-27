/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BookMutation } from './book-mutation.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  category: string;

  @Column({ default: 1 }) // Default stock = 1
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ unique: true })  // ISBN harus unik
  isbn: string;

  @OneToMany(() => BookMutation, (mutation) => mutation.book)
  mutations: BookMutation[];
}
