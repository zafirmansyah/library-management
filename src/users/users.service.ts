import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Register User
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  // Ambil Semua User
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Ambil User Berdasarkan Email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Update User
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  // Ambil User Berdasarkan ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
    return user;
  }

  // Hapus User
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`User dengan ID ${id} tidak ditemukan`);
  }
}
