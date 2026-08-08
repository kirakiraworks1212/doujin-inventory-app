import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Circle } from '../circles/circle.entity';

@Entity('staff_users')
export class StaffUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // ハッシュ化されたパスワードを保存する(生のパスワードは絶対に保存しない)
  @Column({ name: 'password_hash' })
  passwordHash: string;

  // どのサークルに所属するスタッフか
  @ManyToOne(() => Circle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'circle_id' })
  circle: Circle;

  @Column({ name: 'circle_id' })
  circleId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}