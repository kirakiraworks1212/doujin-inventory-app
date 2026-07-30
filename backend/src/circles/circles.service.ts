import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Circle } from './circle.entity';
import { CreateCircleDto, UpdateCircleDto } from './dto/circle.dto';

@Injectable()
export class CirclesService {
  constructor(
    @InjectRepository(Circle)
    private readonly circleRepo: Repository<Circle>,
  ) {}

  // サークルを新規登録する
  async create(dto: CreateCircleDto): Promise<Circle> {
    const circle = this.circleRepo.create(dto);
    return this.circleRepo.save(circle);
  }

  // サークル一覧を取得する
  async findAll(): Promise<Circle[]> {
    return this.circleRepo.find();
  }

  // サークルを1件取得する
  async findOne(id: number): Promise<Circle> {
    const circle = await this.circleRepo.findOne({ where: { id } });
    if (!circle) throw new NotFoundException('サークルが見つかりません');
    return circle;
  }

  // サークル情報を更新する
  async update(id: number, dto: UpdateCircleDto): Promise<Circle> {
    const circle = await this.findOne(id);
    Object.assign(circle, dto);
    return this.circleRepo.save(circle);
  }

  // サークルを削除する
  async remove(id: number): Promise<void> {
    const circle = await this.findOne(id);
    await this.circleRepo.remove(circle);
  }
}