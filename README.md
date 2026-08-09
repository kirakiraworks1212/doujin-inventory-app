# doujin-inventory-app

## プロジェクトについて
同人誌イベントでのサークル参加者向け、売上管理・在庫確認システムです。

### 技術スタック
- フロントエンド: Next.js
- バックエンド: NestJS + TypeORM
- データベース: MySQL
- デプロイ: Railway

## 🚀 デモ
本番環境: https://doujin-inventory-app-production.up.railway.app

## ✅ 実装済み機能
- [x] サークルのCRUD API (`/circles`)
- [x] 商品のCRUD API (`/products`)
- [x] 売上記録・在庫連動API (`/products/:id/sales`)
  - トランザクション処理による在庫の同時実行制御
  - 在庫不足時のエラーハンドリング
- [x] 一般参加者向けの公開在庫確認API(認証不要) (`/public/circles`, `/public/products`)
- [x] JWT認証機能(登録・ログイン・トークン発行)
- [x] AuthGuardによるログイン必須化(商品・サークル管理API)
- [x] Railwayへのデプロイ(本番稼働中)
- [x] Next.jsフロントエンド
  - サークル一覧・在庫確認ページ(一般参加者向け)
  - ログイン画面(スタッフ向け)
  - 管理画面: 商品一覧表示・商品登録フォーム

## 🔜 実装予定
- [ ] 管理画面: 在庫の手動編集機能
- [ ] 管理画面: 売上記録ボタン(在庫連動)
- [ ] ライト/ダークモードの切り替え機能
- [ ] 運営側でスタッフパスワードを発行する仕組み
  - サークル当落通知時に、ランダムなパスワードを自動生成して配布するイメージ
- [ ] クレジットカード決済連携(将来構想)

## API一覧
| メソッド | エンドポイント | 認証 | 説明 |
|---|---|---|---|
| POST | /auth/register | - | スタッフ登録 |
| POST | /auth/login | - | ログイン(JWTトークン発行) |
| GET | /auth/me | 要 | 自分の情報を取得 |
| POST | /circles | 要 | サークル登録 |
| GET | /circles | 要 | サークル一覧取得 |
| POST | /products | 要 | 商品登録 |
| GET | /products?circleId=1 | 要 | サークルの商品一覧取得 |
| POST | /products/:id/sales | 要 | 売上記録(在庫も同時減算) |
| GET | /public/circles | - | サークル一覧(公開用) |
| GET | /public/products?circleId=1 | - | 商品・在庫一覧(公開用) |

## セットアップ方法

### バックエンド
1. `git clone https://github.com/kirakiraworks1212/doujin-inventory-app.git`
2. `cd backend && npm install`
3. `.env`を作成し、MySQL接続情報とJWT_SECRETを設定
4. `npm run start:dev`

### フロントエンド
1. `cd frontend && npm install`
2. `npm run dev`