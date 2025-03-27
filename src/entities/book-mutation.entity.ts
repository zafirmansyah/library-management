import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { User } from './user.entity';

@Entity()
export class BookMutation {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  tanggal: Date;

  @Column({ type: 'text' })
  keterangan: string;

  @ManyToOne(() => Book, (book) => book.mutations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'int' })
  debet: number; // Bertambahnya stok buku

  @Column({ type: 'int' })
  kredit: number; // Berkurangnya stok buku

  @ManyToOne(() => User, (user) => user.mutations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true }) // Bisa nullable jika tidak semua mutasi melibatkan pelanggan
  id_pelanggan: number;
}
