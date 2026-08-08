import { IsEmail, IsInt, IsString, MinLength } from 'class-validator';

// スタッフ登録用
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8) // パスワードは8文字以上を必須にする
  password: string;

  @IsInt()
  circleId: number;
}

// ログイン用
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}