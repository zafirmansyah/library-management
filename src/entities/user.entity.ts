/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { BookMutation } from './book-mutation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Akan dienkripsi

  @Column({ default: 'member' }) // Role bisa 'admin' atau 'member'
  role: string;

  @CreateDateColumn()
  createdAt: Date;
  // mutations: any;
  username: any;

  @OneToMany(() => BookMutation, (mutation) => mutation.user)
  mutations: BookMutation[];

}
