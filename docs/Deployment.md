# デプロイ手順(AWS EC2 + Docker Compose)

就活用のライブデモを最速で出すことを目的に、EC2 1台上でdocker-compose本番構成を動かす。
本格的なECS/RDS構成は将来の拡張候補とし、まずはこの最小構成でデプロイする。

## アーキテクチャ

同一オリジン配信にして、Sanctum SPA認証のクロスドメインCookie/CORS問題を避ける。

```
https://{domain}/          → Reactの本番ビルド(静的ファイル)
https://{domain}/api/*     → Laravel (PHP-FPM) にプロキシ
https://{domain}/sanctum/* → 同上
https://{domain}/auth/*    → 同上 (Google OAuthコールバック)
```

リバースプロキシは [Caddy](https://caddyserver.com/) を使用する(開発用nginxとは別、本番専用)。
Let's Encryptによる証明書の自動取得・自動更新が設定不要で付いてくるため、証明書切れなどの事故が起きにくい。

## リポジトリ内の本番用ファイル

開発用の`docker-compose.yml`・`docker/nginx/default.conf`・各`Dockerfile`は変更していない。

| ファイル | 役割 |
|---|---|
| `docker-compose.prod.yml` | 本番用のサービス構成(app / frontend-build / caddy / mysql) |
| `backend/Dockerfile.prod` | `composer install --no-dev`まで含めて本番イメージをビルド |
| `frontend/Dockerfile.prod` | `npm run build`し、静的ファイルだけを含む軽量イメージを作る(volumeへコピーするだけの一回きりのコンテナ) |
| `docker/Caddyfile` | 上記の同一オリジンルーティング定義 |
| `backend/.env.production.example` | 本番用`.env`のテンプレート(実体はサーバー上でのみ作成し、コミットしない) |
| `frontend/.env.production` | ビルド時の`VITE_API_URL`(空文字=相対パスで同一オリジンにアクセス)。秘密情報を含まないためコミット済み |

## 手順

### 1. ドメイン取得

Route 53、または好きなレジストラでドメインを購入する。

### 2. コストアラート設定(先にやっておく)

AWS Budgets(Billing and Cost Management > Budgets)で月額の予算を作成し、50%/80%/100%到達時にメール通知が届くようにしておく。最初の2つの予算は無料。請求は止まらないが、放置による高額請求事故を防げる。

### 3. EC2起動

最小コストを優先する構成:

- OS: Ubuntu 24.04 LTS
- インスタンスタイプ: **t4g.micro**(ARM/Graviton、t3.microより2〜3割安い。使用イメージ(php/node/mysql/caddyの公式イメージ)は全てarm64対応済みでそのまま動く)
- リージョン: us-east-1 か us-west-2(状況に応じて選定)
- ストレージ: ルートEBS 8〜20GB gp3(デフォルトのままでよい、追加ボリューム不要)
- モニタリング: 基本モニタリング(詳細モニタリングは有料なのでオンにしない)
- NAT Gateway / ALB / RDS は使わない(今回の構成には不要、特にNAT Gatewayは時間課金が地味に高いので注意)
- セキュリティグループ:
  - `22` (SSH) — 自分のIPのみ許可
  - `80` (HTTP) — 全体に許可(Let's Encryptの検証・HTTPSへのリダイレクト用)
  - `443` (HTTPS) — 全体に許可

t4g.microは1GB RAMのため、ビルド時にメモリが厳しくなることがある(後述のswap設定で対応)。

### 4. Elastic IP

割り当ててインスタンスに関連付ける(再起動してもIPが変わらないようにするため)。**インスタンスを止めた状態でEIPだけ残すと課金される**ので、使わない時はEIPごと解放するかインスタンスを起動したままにする。

### 5. DNS設定

ドメインのAレコードをElastic IPに向ける。

### 6. サーバー初期設定

```bash
# EC2にSSH接続後
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
# 一度ログアウト/再ログインしてグループ反映

git clone https://github.com/hirakei1203/modern-crm.git
cd modern-crm
```

**t4g.micro/t3.micro等の1GB RAMインスタンスを使う場合**、`npm run build`や`composer install`のビルド中にメモリ不足で落ちることがあるため、swapファイルを追加しておく。

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 7. `.env`作成

`backend/.env.production.example`をコピーして`backend/.env`を作成し、実際の値を設定する。

```bash
cp backend/.env.production.example backend/.env
```

最低限、以下を実際の値に置き換える:

- `APP_KEY` — ローカルで`php artisan key:generate --show`を実行して得た値
- `APP_URL` / `FRONTEND_URL` / `SANCTUM_STATEFUL_DOMAINS` / `CORS_ALLOWED_ORIGINS` / `GOOGLE_REDIRECT_URI` — 取得したドメインに書き換え
- `DB_PASSWORD` / `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD` — 開発環境の値を使い回さず、新しいパスワードを生成(2つの`DB_PASSWORD`と`MYSQL_PASSWORD`は同じ値にする)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google Cloud Consoleの値

### 8. 起動

```bash
DOMAIN=your-domain.example docker compose -f docker-compose.prod.yml up -d --build
```

### 9. マイグレーション

```bash
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force
```

### 10. Google Cloud Console更新

OAuthクライアントの「承認済みのリダイレクトURI」に `https://your-domain.example/auth/google/callback` を追加する。

### 11. 動作確認

- `https://your-domain.example` にアクセスし、Caddyが自動発行した証明書でHTTPS化されていることを確認
- Googleログイン
- Customer / Task / ContactHistory / Tag / CustomerLink の一連のCRUDが動くことを確認

## 将来の拡張候補(今回はスコープ外)

- ECS Fargate + RDS + ALB + CloudFrontへの移行(より「AWSらしい」構成)
- CI/CDでイメージをビルド・デプロイまで自動化
- DBの定期バックアップ
