import { Module } from '@nestjs/common';
import { CirclesModule } from '../circles/circles.module';
import { ProductsModule } from '../products/products.module';
import { PublicController } from './public.controller';

@Module({
  imports: [CirclesModule, ProductsModule],
  controllers: [PublicController],
})
export class PublicModule {}