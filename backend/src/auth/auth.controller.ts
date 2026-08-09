import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // 今ログインしている人の情報を返す: GET /auth/me
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: { user: { userId: number; email: string; circleId: number } }) {
    // JwtStrategyのvalidateメソッドで返した内容が、req.userとして使える
    return req.user;
  }
}