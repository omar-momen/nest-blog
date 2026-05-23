import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GoogleUser } from '../interfaces/goggle-user.interface';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createGoogleUser(user: GoogleUser) {
    try {
      const newUser = this.userRepository.create(user);
      return this.userRepository.save(newUser);
    } catch {
      throw new BadRequestException('Failed to create user');
    }
  }
}
