import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Circle } from './circle.entity';
import { CirclesService } from './circles.service';
import { CirclesController } from './circles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Circle])],
  controllers: [CirclesController],
  providers: [CirclesService],
  exports: [CirclesService],
})
export class CirclesModule {}