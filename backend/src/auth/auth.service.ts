import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { StaffUser } from './staff-user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(StaffUser)
    private readonly staffUserRepo: Repository<StaffUser>,
    private readonly jwtService: JwtService,
  ) {}

  // スタッフを新規登録する
  async register(dto: RegisterDto): Promise<{ id: number; email: string }> {
    // 既に同じメールアドレスが登録されていないか確認
    const existing = await this.staffUserRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('このメールアドレスは既に登録されています');
    }

    // パスワードをハッシュ化する(元の文字列には絶対に戻せない)
    // 第2引数の10は「ソルトラウンド数」。数値が大きいほど安全だが処理が重くなる
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const staffUser = this.staffUserRepo.create({
      email: dto.email,
      passwordHash,
      circleId: dto.circleId,
    });
    const saved = await this.staffUserRepo.save(staffUser);

    return { id: saved.id, email: saved.email };
  }

  // ログイン処理: メールアドレス・パスワードを確認し、正しければJWTトークンを発行する
  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const staffUser = await this.staffUserRepo.findOne({
      where: { email: dto.email },
    });

    // ユーザーが見つからない場合も、パスワードが違う場合も、
    // 同じエラーメッセージにする(「メールアドレスは存在するがパスワードが違う」
    // という情報を漏らさないため)
    if (!staffUser) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが違います');
    }

    // 入力されたパスワードと、保存されているハッシュを比較する
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      staffUser.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが違います');
    }

    // JWTトークンを発行する。中身(payload)には、後で使いたい情報を入れておく
    const payload = {
      sub: staffUser.id, // sub = subject、その人を識別するID
      email: staffUser.email,
      circleId: staffUser.circleId,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}