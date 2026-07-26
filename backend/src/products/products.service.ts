import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './product.entity';
import { Sale } from './sale.entity';
import {
  AdjustStockDto,
  CreateProductDto,
  RecordSaleDto,
  UpdateProductDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  // 商品を新規登録する
  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create({
      ...dto,
      currentStock: dto.initialStock, // 登録時は現在庫=初期在庫
    });
    return this.productRepo.save(product);
  }

  // サークルIDを指定して、その商品一覧を取得する
  async findByCircle(circleId: number): Promise<Product[]> {
    return this.productRepo.find({ where: { circleId } });
  }

  // 商品IDを指定して1件取得する
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('商品が見つかりません');
    return product;
  }

  // 商品情報(名前・価格など)を更新する
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  // 在庫を手動で修正する(棚卸し・返品対応など)
  async adjustStock(id: number, dto: AdjustStockDto): Promise<Product> {
    const product = await this.findOne(id);
    if (dto.newStock < 0) {
      throw new BadRequestException('在庫数は0以上である必要があります');
    }
    product.currentStock = dto.newStock;
    return this.productRepo.save(product);
  }

  // 売上記録＋在庫減算をまとめて行う(ここが一番重要な処理)
  async recordSale(productId: number, dto: RecordSaleDto): Promise<Sale> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 対象の商品を「ロック」しながら取得する
      // これにより、他の処理が同時にこの商品を更新しようとしても待たされる
      const product = await queryRunner.manager.findOne(Product, {
        where: { id: productId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!product) {
        throw new NotFoundException('商品が見つかりません');
      }

      if (product.currentStock < dto.quantity) {
        throw new BadRequestException(
          `在庫不足です（残り${product.currentStock}個）`,
        );
      }

      // 在庫を減らす
      product.currentStock -= dto.quantity;
      await queryRunner.manager.save(Product, product);

      // 売上記録を作る
      const sale = queryRunner.manager.create(Sale, {
        productId: product.id,
        quantity: dto.quantity,
        amount: product.price * dto.quantity,
      });
      const savedSale = await queryRunner.manager.save(Sale, sale);

      // ここまで全部成功したら、確定する
      await queryRunner.commitTransaction();
      return savedSale;
    } catch (err) {
      // 途中で何かエラーが起きたら、全部なかったことにする(ロールバック)
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 商品ごとの売上履歴を取得する
  async findSalesByProduct(productId: number): Promise<Sale[]> {
    return this.dataSource
      .getRepository(Sale)
      .find({ where: { productId }, order: { soldAt: 'DESC' } });
  }
}