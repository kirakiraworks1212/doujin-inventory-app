import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  AdjustStockDto,
  CreateProductDto,
  RecordSaleDto,
  UpdateProductDto,
} from './dto/product.dto';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 商品を新規登録する: POST /products
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  // サークルの商品一覧を取得する: GET /products?circleId=1
  @Get()
  findByCircle(@Query('circleId', ParseIntPipe) circleId: number) {
    return this.productsService.findByCircle(circleId);
  }

  // 商品を1件取得する: GET /products/1
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // 商品情報を更新する: PATCH /products/1
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  // 在庫を手動で修正する: PATCH /products/1/stock
  @Patch(':id/stock')
  adjustStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdjustStockDto,
  ) {
    return this.productsService.adjustStock(id, dto);
  }

  // 売上を記録する(在庫も同時に減る): POST /products/1/sales
  @Post(':id/sales')
  recordSale(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RecordSaleDto,
  ) {
    return this.productsService.recordSale(id, dto);
  }

  // 商品の売上履歴を取得する: GET /products/1/sales
  @Get(':id/sales')
  findSales(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findSalesByProduct(id);
  }
}