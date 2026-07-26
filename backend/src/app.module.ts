import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // .envファイルを読み込めるようにする設定
    ConfigModule.forRoot({
      isGlobal: true, // どのモジュールからでも.envの値を使えるようにする
    }),
    // TypeORMでMySQLに接続する設定
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [], // 後でProductエンティティなどをここに追加していく
        synchronize: true, // 開発中はtrueでOK。本番運用ではfalseにして専用のマイグレーションを使う
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}