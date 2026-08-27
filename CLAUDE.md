# CRM Project

シンプルなCRMアプリケーション。既存CRMツールの過剰な機能・複雑さを避け、中小チームが実際に必要とする
範囲に絞ったプロダクトを目指す。詳細は下記docsを参照。

## ドキュメント

- [docs/product-spec.md](docs/product-spec.md) — プロダクト仕様・データモデル・画面設計
- [docs/BackendArchitecture.md](docs/BackendArchitecture.md) — バックエンドのレイヤードアーキテクチャ方針
- [docs/FrontendArchitecture.md](docs/FrontendArchitecture.md) — フロントエンドのアーキテクチャ方針
- [docs/Deployment.md](docs/Deployment.md) — AWS EC2 + Docker Composeによるデプロイ手順

実装判断が設計ドキュメントと異なる場合は、該当のdocsファイルもあわせて更新すること。

## 技術スタック

- Laravel 13(API-only) / React 19 + TypeScript(Vite) / MySQL / Docker Compose
- 状態管理: Zustand、ルーティング: React Router、認証: Laravel Sanctum(SPA cookie認証)

## ディレクトリ構成

```
CRM/
├── docs/                 # 設計ドキュメント
├── backend/              # Laravel 13 (API-only)
├── frontend/             # React + TypeScript (Vite)
├── docker/               # nginx等の設定ファイル
└── docker-compose.yml
```

バックエンドは `app/Http/Controllers → app/UseCases → app/Services → app/Repositories → app/Models` の
レイヤー構成(詳細は [docs/BackendArchitecture.md](docs/BackendArchitecture.md))。
フロントエンドは `src/pages → src/components / src/hooks / src/stores / src/api`
の構成(詳細は [docs/FrontendArchitecture.md](docs/FrontendArchitecture.md))。

## 開発の進め方

- 機能追加は大きな塊で一気に作らず、ステップごとに区切って動作確認しながら進める
- 設計ドキュメントと異なる判断をした場合は、都度該当のdocsファイルを更新する
