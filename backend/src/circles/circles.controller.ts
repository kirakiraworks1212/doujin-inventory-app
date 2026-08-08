import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CirclesService } from './circles.service';
import { CreateCircleDto, UpdateCircleDto } from './dto/circle.dto';

@UseGuards(JwtAuthGuard)
@Controller('circles')
export class CirclesController {
  constructor(private readonly circlesService: CirclesService) {}

  // サークルを新規登録する: POST /circles
  @Post()
  create(@Body() dto: CreateCircleDto) {
    return this.circlesService.create(dto);
  }

  // サークル一覧を取得する: GET /circles
  @Get()
  findAll() {
    return this.circlesService.findAll();
  }

  // サークルを1件取得する: GET /circles/1
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.circlesService.findOne(id);
  }

  // サークル情報を更新する: PATCH /circles/1
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCircleDto) {
    return this.circlesService.update(id, dto);
  }

  // サークルを削除する: DELETE /circles/1
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.circlesService.remove(id);
  }
}