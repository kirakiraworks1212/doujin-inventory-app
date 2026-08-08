import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// これをControllerやメソッドに付けるだけで、
// ログイン(有効なJWTトークンを持っている)必須になる
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}