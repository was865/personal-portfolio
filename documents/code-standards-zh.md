# Next.js 项目代码规范

## 目录

1. [项目结构](#项目结构)
2. [编码规范](#编码规范)
3. [组件设计](#组件设计)
4. [状态管理](#状态管理)
5. [路由](#路由)
6. [数据获取](#数据获取)
7. [样式](#样式)
8. [国际化](#国际化)
9. [测试](#测试)
10. [性能优化](#性能优化)
11. [可访问性](#可访问性)
12. [Git 提交规范](#git提交规范)
13. [CI/CD 流程](#cicd流程)

## 项目结构

使用 Next.js 13/14 的 App Router 的推荐项目结构：

```
/
├── app/                      # App Router
│   ├── [locale]/             # 国际化根路径
│   │   ├── page.tsx          # 首页
│   │   ├── [...slug]/        # 动态路由
│   │   └── layout.tsx        # 布局
├── components/               # 共用组件
│   ├── ui/                   # UI基础组件
│   └── [feature]/            # 功能组件
├── lib/                      # 工具函数
├── public/                   # 静态资源
├── styles/                   # 全局样式（如有使用）
├── hooks/                    # 自定义钩子
├── context/                  # React上下文
├── i18n/                     # 国际化配置
├── messages/                 # 翻译文本
├── middleware.ts             # 中间件
├── next.config.js            # Next.js配置
└── tsconfig.json             # TypeScript配置
```

## 编码规范

### 通用规则

- **TypeScript**: 所有代码都应使用TypeScript编写
- **命名规则**:
  - 组件: PascalCase (例: `UserProfile.tsx`)
  - 函数和变量: camelCase (例: `getUserData`)
  - 常量: UPPER_SNAKE_CASE (例: `MAX_RETRY_COUNT`)
  - 文件名: kebab-case (例: `user-profile.ts`)或组件使用PascalCase
- **缩进**: 2空格
- **分号**: 语句末尾加分号
- **引号**: 使用单引号 (`'`)
- **尾逗号**: 多行数组和对象使用尾逗号

### TypeScript

- 避免使用`any`类型（如确实需要，宁可明确使用`any`也不要使用`// @ts-ignore`）
- 接口和类型定义应放在专用文件中或使用它们的文件的顶部
- 使用`??`和`?.`操作符进行空值检查

### ESLint和Prettier

- 结合使用ESLint和Prettier来保证代码质量和格式
- 推荐配置:

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
    // 项目特定规则
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

## 组件设计

### 组件结构

- 推荐基于**原子设计**模式的结构:
  - Atoms: 按钮、输入框等基本元素
  - Molecules: 搜索栏等复合元素
  - Organisms: 表单、导航栏等
  - Templates: 页面布局
  - Pages: 完整页面组件

### 服务器组件 vs. 客户端组件

- 默认使用**服务器组件**
- 对于交互元素，使用`'use client'`指令指定为客户端组件
- 考虑性能因素，仅在必要时使用客户端组件

### 组件示例

```tsx
// 服务器组件和客户端组件的适当分离示例

// UserProfile.tsx (服务器组件)
import { getUserData } from '@/lib/api';
import UserActions from './UserActions';

export default async function UserProfile({ userId }: { userId: string }) {
  const userData = await getUserData(userId);
  
  return (
    <div className="user-profile">
      <h1>{userData.name}</h1>
      <p>{userData.bio}</p>
      {/* 传递客户端组件作为子组件 */}
      <UserActions userId={userId} />
    </div>
  );
}

// UserActions.tsx (客户端组件)
'use client';

import { useState } from 'react';

export default function UserActions({ userId }: { userId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  
  return (
    <button onClick={() => setIsFollowing(!isFollowing)}>
      {isFollowing ? '已关注' : '关注'}
    </button>
  );
}
```

## 状态管理

### 本地状态

- 单一组件内的状态使用`useState`和`useReducer`
- 复杂状态逻辑优先使用`useReducer`

### 全局状态

- 组件间共享状态使用`Context API`
- 更复杂的状态管理考虑使用`Zustand`或`Jotai`等轻量级库

### 服务器状态

- 服务器数据获取和管理使用`React Query`或`SWR`
- 适当缓存数据并控制重新获取频率

## 路由

使用App Router的路由规范:

- 在`app/[locale]/`目录下放置`page.tsx`文件定义路由
- 动态路由使用`[param]`格式的文件夹名
- 全捕获路由使用`[...slug]`格式
- 使用`layout.tsx`共享布局
- 使用`loading.tsx`定义加载状态
- 使用`error.tsx`处理错误

## 数据获取

### 服务器组件中的数据获取

```tsx
// 服务器组件中直接获取数据
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

### 客户端组件中的数据获取

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api';

export default function ProductListClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载产品时出错</div>;

  return (
    <div>
      {data.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 样式

推荐的样式方法:

- **Tailwind CSS**: 快速灵活的工具优先CSS框架
- **CSS Modules**: 组件作用域的CSS样式
- **styled-components/Emotion**: CSS-in-JS解决方案（如需要）

## 国际化

国际化(i18n)实现:

- 使用Next.js内置i18n功能或next-intl
- 翻译文件按语言整理到`messages/`目录
- 语言切换通过中间件处理

## 测试

推荐的测试方法:

- **单元测试**: Jest + React Testing Library
- **组件测试**: Storybook
- **端到端测试**: Cypress 或 Playwright

## 性能优化

- 使用`next/image`优化图片大小并实现懒加载
- 对大型组件使用`dynamic import`
- 适当利用服务器组件减少客户端JavaScript包大小
- 适当预取页面和组件
- 持续监控Web Vitals指标

## 可访问性

- 使用语义化HTML
- 支持键盘导航
- 适当使用ARIA属性以支持屏幕阅读器
- 确保颜色对比度（至少达到WCAG AA级别）
- 适当的字体大小和行高

## Git提交规范

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型(Type)

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 仅文档变更
- `style`: 不影响代码含义的变更（空格、格式等）
- `refactor`: 既不是修复bug也不是添加功能的代码变更
- `perf`: 提高性能的变更
- `test`: 添加或修正测试
- `chore`: 构建过程或工具变更

### 作用域(Scope)

变更的范围（组件名、文件名、功能名等）

### 主题(Subject)

变更内容的简洁描述（使用命令式现在时）

### 示例

```
feat(auth): implement social login buttons

Add Google and Twitter login options to the authentication page.

Closes #123
```

## 分支策略

- **main**: 生产环境
- **develop**: 开发环境
- **feature/[功能名]**: 新功能开发
- **fix/[问题名]**: 修复bug
- **release/[版本]**: 发布准备

## CI/CD流程

持续集成/交付最佳实践:

- 提交时运行lint和测试
- 拉取请求时进行完整自动测试和环境部署
- 合并到main分支时部署到生产环境
- 自动化部署前后的检查和验证过程

## 总结

本代码规范和提交规约是确保Next.js项目质量、一致性和可维护性的指导方针。随着项目的发展，应当持续更新和改进这些规范。 