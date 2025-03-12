# Next.js プロジェクトコーディングルール

## 目次

1. [プロジェクト構造](#プロジェクト構造)
2. [コーディング規約](#コーディング規約)
3. [コンポーネント設計](#コンポーネント設計)
4. [状態管理](#状態管理)
5. [ルーティング](#ルーティング)
6. [データフェッチング](#データフェッチング)
7. [スタイリング](#スタイリング)
8. [国際化](#国際化)
9. [テスト](#テスト)
10. [パフォーマンス最適化](#パフォーマンス最適化)
11. [アクセシビリティ](#アクセシビリティ)
12. [Git コミット規約](#gitコミット規約)
13. [CI/CD パイプライン](#cicdパイプライン)

## プロジェクト構造

Next.js 13/14/15のApp Routerを使用する場合の推奨プロジェクト構造：

```
/
├── app/                      # App Router
│   ├── [locale]/             # 国際化用のルートパス
│   │   ├── page.tsx          # ホームページ
│   │   ├── [...slug]/        # 動的ルート
│   │   └── layout.tsx        # レイアウト
├── components/               # 共通コンポーネント
│   ├── ui/                   # UI基本コンポーネント
│   └── [feature]/            # 機能別コンポーネント
├── lib/                      # ユーティリティ関数
├── public/                   # 静的アセット
├── styles/                   # グローバルスタイル（使用時）
├── hooks/                    # カスタムフック
├── context/                  # Reactコンテキスト
├── i18n/                     # 国際化設定
├── messages/                 # 翻訳テキスト
├── middleware.ts             # ミドルウェア
├── next.config.js            # Next.js設定
└── tsconfig.json             # TypeScript設定
```

## コーディング規約

### 一般規則

- **TypeScript**: すべてのコードはTypeScriptで書く
- **命名規則**:
  - コンポーネント: PascalCase (例: `UserProfile.tsx`)
  - 関数と変数: camelCase (例: `getUserData`)
  - 定数: UPPER_SNAKE_CASE (例: `MAX_RETRY_COUNT`)
  - ファイル名: コンポーネントの場合はPascalCase, カスタムフットなどはkebab-case (例: `user-profile.ts`)または
- **インデント**: 2スペース
- **セミコロン**: 文末にセミコロンを付ける
- **引用符**: シングルクォート (`'`) を使用する
- **末尾カンマ**: 複数行の配列・オブジェクトでは末尾カンマを使用する

### TypeScript

- `any`型の使用を避ける（どうしても必要な場合は`// @ts-ignore`よりも明示的に`any`を使う）
- インターフェイスやタイプの定義は専用ファイルに分離するか、使用するファイルの先頭に定義する
- Nullチェックには`??`や`?.`演算子を活用する

### ESLintとPrettier

- ESLintとPrettierを併用して、コードの品質とフォーマットを保つ
- 推奨設定:

```js
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended', 
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    // プロジェクト固有のルール
  }
};

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## コンポーネント設計

### コンポーネント構造

- **Atomic Design**パターンに基づいた構造化を推奨:
  - Atoms: ボタン、入力フィールドなどの基本要素
  - Molecules: 検索バーなどの複合要素
  - Organisms: フォーム、ナビゲーションバーなど
  - Templates: ページレイアウト
  - Pages: 完全なページコンポーネント

### Server vs. Client Components

- デフォルトでは**Serverコンポーネント**を使用する
- インタラクティブな要素には`'use client'`ディレクティブでClientコンポーネントに指定する
- パフォーマンスを考慮し、必要な場合のみClientコンポーネントを使用する

### コンポーネントの例

```tsx
// ServerコンポーネントとClientコンポーネントの適切な分離例

// UserProfile.tsx (Server Component)
import { getUserData } from '@/lib/api';
import UserActions from './UserActions';

export default async function UserProfile({ userId }: { userId: string }) {
  const userData = await getUserData(userId);
  
  return (
    <div className="user-profile">
      <h1>{userData.name}</h1>
      <p>{userData.bio}</p>
      {/* クライアントコンポーネントを子として渡す */}
      <UserActions userId={userId} />
    </div>
  );
}

// UserActions.tsx (Client Component)
'use client';

import { useState } from 'react';

export default function UserActions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  
  return (
    <button onClick={() => setIsFollowing(!isFollowing)}>
      {isFollowing ? 'フォロー中' : 'フォローする'}
    </button>
  );
}
```

## 状態管理

### ローカル状態

- 単一コンポーネント内の状態には`useState`と`useReducer`を使用
- 複雑な状態ロジックは`useReducer`を優先

### グローバル状態

- コンポーネント間で共有する状態には`Context API`を使用
- より複雑な状態管理には`Zustand`や`Jotai`などの軽量なライブラリを検討

### サーバー状態

- サーバーデータの取得と管理には`React Query`や`SWR`を使用
- データを適切にキャッシュし、再取得の頻度を制御する

## ルーティング

App Routerを使用したルーティング規約:

- `app/[locale]/`ディレクトリ内に`page.tsx`ファイルを配置してルートを定義
- 動的ルートには`[param]`形式のフォルダ名を使用
- キャッチオールルートには`[...slug]`形式を使用
- レイアウト共有には`layout.tsx`を使用
- ローディング状態は`loading.tsx`で定義
- エラー処理は`error.tsx`で定義

## データフェッチング

### サーバーコンポーネントでのデータフェッチ

```tsx
// サーバーコンポーネントでの直接データフェッチ
export default async function ProductList() {
  const products = await getProducts();
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### クライアントコンポーネントでのデータフェッチ

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';

export default function ProductListClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## スタイリング

推奨スタイリング手法:

- **Tailwind CSS**: 高速で柔軟なユーティリティファーストCSSフレームワーク
- **CSS Modules**: コンポーネントスコープのCSSスタイル
- **styled-components/Emotion**: CSS-in-JSソリューション（必要な場合）

## 国際化

国際化（i18n）の実装:

- Next.js組み込みのi18n機能またはnext-intlを使用
- 翻訳ファイルは`messages/`ディレクトリに言語ごとに整理
- 言語切り替えはミドルウェアで処理

## テスト

推奨テストアプローチ:

- **単体テスト**: Jest + React Testing Library
- **コンポーネントテスト**: Storybook
- **E2Eテスト**: Cypress または Playwright

## パフォーマンス最適化

- 画像には`next/image`を使用してサイズ最適化とLazy Loadingを実現
- 大きなコンポーネントには`dynamic import`を使用
- Serverコンポーネントを適切に活用してJavaScriptのクライアントバンドルを削減
- ページやコンポーネントの適切なプリフェッチ
- Web Vitalsを継続的にモニタリング

## アクセシビリティ

- セマンティックHTMLを使用
- キーボードナビゲーションに対応
- スクリーンリーダー対応のARIA属性を適切に使用
- カラーコントラストを確保（WCAG AAレベル以上）
- 適切なフォントサイズと行間

## Gitコミット規約

### コミットメッセージフォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（スペース、フォーマット等）
- `refactor`: バグ修正や機能追加を行わないコード変更
- `perf`: パフォーマンス向上のための変更
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更
- `revert`: 以前のコミットを取り消す

### Scope

変更の範囲（コンポーネント名、ファイル名、機能名など）

### Subject

変更内容の簡潔な説明（命令形・現在形で）

### 例

```
feat(auth): implement social login buttons

Add Google and Twitter login options to the authentication page.

Closes #123
```

## ブランチ戦略

- **main**: 本番環境
- **develop**: 開発環境
- **feature/[機能名]**: 新機能の開発
- **fix/[問題名]**: バグ修正
- **release/[バージョン]**: リリース準備

## CI/CDパイプライン

継続的インテグレーション/デリバリのベストプラクティス:

- コミット時にlintとテストを実行
- プルリクエスト時にフル自動テストと環境デプロイ
- mainブランチへのマージで本番環境にデプロイ
- デプロイ前後のチェックと検証プロセスを自動化

## 結論

このコード規範とコミット規約は、Next.jsプロジェクトの品質、一貫性、保守性を確保するためのガイドラインです。プロジェクトの成長に合わせて継続的に更新・改善してください。 