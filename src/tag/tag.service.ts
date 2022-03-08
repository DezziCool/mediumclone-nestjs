import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }
}

// Repository - это спец. паттерн для работы с данными. В данном случае с конкретной таблицей
// @InjectRepository(<name>) - позволяет нам определить репозиторий для typeorm. <name> - файл с entity
