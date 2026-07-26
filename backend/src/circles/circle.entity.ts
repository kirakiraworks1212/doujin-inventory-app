import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('circles')
export class Circle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'space_number', nullable: true })
  spaceNumber: string;

  @OneToMany(() => Product, (product) => product.circle)
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}