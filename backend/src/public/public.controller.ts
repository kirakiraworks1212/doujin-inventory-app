import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CirclesService } from '../circles/circles.service';
import { ProductsService } from '../products/products.service';

// 一般参加者向け(認証不要)のAPI
// お客さんに見せて良い情報だけに絞って返す
@Controller('public')
export class PublicController {
  constructor(
    private readonly circlesService: CirclesService,
    private readonly productsService: ProductsService,
  ) {}

  // サークル一覧を取得する: GET /public/circles
  @Get('circles')
  async findAllCircles() {
    const circles = await this.circlesService.findAll();
    return circles.map((c) => ({
      id: c.id,
      name: c.name,
      spaceNumber: c.spaceNumber,
    }));
  }

  // 特定サークルの商品(在庫)一覧を取得する: GET /public/products?circleId=1
  @Get('products')
  async findProductsByCircle(@Query('circleId', ParseIntPipe) circleId: number) {
    const products = await this.productsService.findByCircle(circleId);
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      currentStock: p.currentStock,
      imageUrl: p.imageUrl,
      inStock: p.currentStock > 0,
    }));
  }
}