import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Circle } from '../circles/circle.entity';
import { Sale } from './sale.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Circle, (circle) => circle.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'circle_id' })
  circle: Circle;

  @Column({ name: 'circle_id' })
  circleId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ name: 'initial_stock', type: 'int' })
  initialStock: number;

  @Column({ name: 'current_stock', type: 'int' })
  currentStock: number;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @OneToMany(() => Sale, (sale) => sale.product)
  sales: Sale[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}