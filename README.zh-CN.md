# FilNoteFEVM 前端应用

FilNoteFEVM 是一个基于 Filecoin FEVM 的去中心化 SP（存储提供商）质押投资和融资 DApp。

## 项目简介

FilNoteFEVM 是一个去中心化应用，允许用户创建、审核和投资 Filecoin 存储提供商的质押票据。该应用基于 Quasar Framework 和 Vue 3 构建，使用 TypeScript 开发，通过 Reown AppKit 实现钱包连接，并使用 ethers.js 与智能合约进行交互。

应用运行在 **Filecoin Calibration 测试网**上，为存储提供商和投资者提供了一个去中心化的融资和投资平台。

## 主要功能

### 1. 票据创建

- 用户可以创建新的投资票据
- 设置目标金额（FIL）
- 设置借款天数
- 设置利率（以基点 bps 为单位，1 bps = 0.01%）
- 创建后票据状态为 `INIT`

### 2. 票据审核

- 审计员可以审核处于 `INIT` 状态的票据
- 需要上传 PDF 格式的合同文件
- 系统会生成验证 UUID 并需要钱包签名
- 审核通过后票据状态变为 `PENDING`

### 3. 票据投资

- 投资者可以投资处于 `PENDING` 状态的票据
- 投资前需要阅读并接受风险披露声明（10 秒倒计时）
- 投资金额等于票据的目标金额
- 投资成功后票据状态变为 `ACTIVE`

### 4. 票据管理

- 查看所有票据列表
- 筛选功能：
  - 我的投资：仅显示当前用户投资的票据
  - 我的创建：仅显示当前用户创建的票据
- 根据票据状态显示不同的操作按钮

### 5. 协议详情

- 查看票据的详细信息
- 显示创建者、投资者、协议合约地址
- 显示融资金额、节点余额等
- 支持提取资金操作（创建者和投资者）

### 6. 钱包连接

- 支持多种钱包连接（通过 Reown AppKit）
- 自动检测已连接的钱包
- 显示钱包地址（短格式）
- 支持切换账户和断开连接

## 技术栈

### 核心框架

- **Quasar Framework 2.x**：Vue.js 的全功能框架，提供丰富的 UI 组件
- **Vue 3.5.20**：使用 Composition API 构建响应式用户界面
- **TypeScript 5.9.2**：提供类型安全和更好的开发体验

### 状态管理

- **Pinia 3.0.1**：Vue 3 的官方状态管理库

### 路由

- **Vue Router 4.0.12**：使用 History 模式进行路由管理

### 区块链相关

- **ethers.js 6.15.0**：与 Filecoin FEVM 智能合约交互
- **Reown AppKit 1.8.4**：钱包连接和账户管理
- **@reown/appkit-adapter-ethers 1.8.4**：Ethers.js 适配器

### HTTP 客户端

- **Axios 1.2.1**：用于与后端 API 通信

### UI 和样式

- **Quasar UI**：Material Design 组件库
- **Tailwind CSS**：实用优先的 CSS 框架
- **SCSS**：CSS 预处理器
- **Font Awesome 6**：图标库

### 工具库

- **BigNumber.js 9.3.1**：大数运算
- **ethers-decode-error 2.1.3**：以太坊错误解码
- **SweetAlert2 11.23.0**：美观的弹窗提示

### 国际化

- **Vue I18n 11.0.0**：多语言支持

## 环境要求

- **Node.js**: ^20 || ^22 || ^24 || ^26 || ^28
- **npm**: >= 6.13.4 或 **yarn**: >= 1.21.1

## 安装依赖

```bash
yarn
# 或
npm install
```

## 环境变量配置

在项目根目录创建 `.env` 文件，配置以下环境变量：

```env
# API 基础 URL（后端服务地址）
API_BASE_URL=https://your-api-url.com

# Reown AppKit 项目 ID（从 https://cloud.reown.com 获取）
APPKIT_PROJECT_ID=your-project-id
```

### 获取 Reown AppKit Project ID

1. 访问 [Reown Cloud](https://cloud.reown.com)
2. 创建新项目或选择现有项目
3. 复制项目 ID 到 `.env` 文件

## 开发

启动开发服务器（支持热重载、错误报告等）：

```bash
quasar dev
# 或
yarn dev
# 或
npm run dev
```

开发服务器默认会在浏览器中自动打开，运行在 `http://localhost:9000`。

## 代码检查

运行 ESLint 检查代码：

```bash
yarn lint
# 或
npm run lint
```

## 代码格式化

使用 Prettier 格式化代码：

```bash
yarn format
# 或
npm run format
```

## 构建生产版本

构建用于生产环境的应用程序：

```bash
quasar build
# 或
yarn build
# 或
npm run build
```

构建产物将输出到 `dist/spa` 目录，可以部署到任何静态文件服务器。

## 项目结构详解

```
src/
├── boot/                    # 启动配置文件（按顺序执行）
│   ├── appkit.ts           # Reown AppKit 配置
│   │                        # - 配置钱包连接
│   │                        # - 设置网络（Filecoin Calibration）
│   │                        # - 配置适配器（EthersAdapter）
│   ├── axios.ts            # Axios HTTP 客户端配置
│   │                        # - 创建 API 实例
│   │                        # - 配置响应拦截器
│   │                        # - 错误处理
│   └── i18n.ts             # 国际化配置
│                            # - 配置 Vue I18n
│                            # - 加载语言资源
│
├── common/                  # 公共模块
│   ├── api.ts              # API 接口定义
│   │                        # - getVerifyUuid: 获取验证 UUID
│   │                        # - uploadContract: 上传合同文件
│   ├── const.ts            # 常量定义
│   │                        # - Network: Filecoin Calibration 网络配置
│   │                        # - NoteStatus: 票据状态映射
│   ├── dApp.ts             # DApp 工具函数
│   │                        # - contractRead: 读取 FilNote 合约
│   │                        # - contractReadProtocols: 读取协议合约
│   ├── FilNoteABI.ts       # FilNote 主合约 ABI
│   ├── ProtocolsABI.ts     # 协议合约 ABI
│   ├── tools.ts            # 工具函数集合
│   │                        # - 地址处理：handleAddress, isZeroAddress
│   │                        # - 金额转换：weiToEther, filToWei
│   │                        # - 利率转换：bpsToPercentage
│   │                        # - 利息计算：calculateInterest
│   │                        # - 错误处理：handleEthErr
│   │                        # - 弹窗提示：swalAlert
│   │                        # - 时间判断：justExpiryTime
│   └── types.ts            # TypeScript 类型定义
│                            # - Note: 票据接口
│                            # - WriteArgs: 写入合约参数
│                            # - ReadArgs: 读取合约参数
│                            # - WriteProps: 写入组件属性
│
├── components/              # Vue 组件
│   ├── AgreementDetails.vue    # 协议详情对话框
│   │                            # - 显示票据详细信息
│   │                            # - 显示协议合约信息
│   │                            # - 支持提取资金操作
│   ├── ConnectingWallets.vue   # 钱包连接组件
│   │                            # - 显示连接/断开按钮
│   │                            # - 显示钱包地址
│   │                            # - 监听账户变化
│   ├── CreateNote.vue          # 创建票据对话框
│   │                            # - 表单验证
│   │                            # - 调用智能合约创建票据
│   ├── InvestmentRecognition.vue # 投资风险确认对话框
│   │                              # - 显示风险披露声明
│   │                              # - 10 秒倒计时
│   │                              # - 确认投资操作
│   ├── NoteItem.vue            # 票据卡片组件
│   │                            # - 显示票据基本信息
│   │                            # - 根据状态和权限显示操作按钮
│   │                            # - 集成审核、投资等功能
│   ├── NoteCountdown.vue       # 票据倒计时组件
│   │                            # - 显示到期时间倒计时
│   ├── ReadContract.vue        # 读取合约组件（插槽组件）
│   │                            # - 提供 read 方法
│   │                            # - 封装合约读取逻辑
│   ├── ReviewNote.vue          # 审核票据对话框
│   │                            # - 上传合同文件（PDF）
│   │                            # - 获取验证 UUID
│   │                            # - 钱包签名
│   │                            # - 上传文件到后端
│   │                            # - 调用智能合约审核
│   └── WriteContract.vue       # 写入合约组件（插槽组件）
│                                # - 提供 write 方法
│                                # - 处理交易确认
│                                # - 显示交易状态
│                                # - 错误处理
│
├── layouts/                 # 布局组件
│   └── MainLayout.vue      # 主布局
│                            # - 顶部导航栏
│                            # - 钱包连接按钮
│                            # - 底部页脚
│                            # - 路由视图容器
│
├── pages/                   # 页面组件
│   ├── IndexPage.vue       # 首页
│   │                        # - 票据列表展示
│   │                        # - 筛选功能
│   │                        # - 创建票据入口
│   ├── TermsService.vue    # 服务条款页面
│   │                        # - 平台服务条款
│   │                        # - 用户责任说明
│   └── ErrorNotFound.vue   # 404 错误页面
│
├── router/                  # 路由配置
│   ├── index.ts            # 路由入口（创建路由实例）
│   └── routes.ts           # 路由定义
│                            # - /: 重定向到 /home
│                            # - /home: 首页
│                            # - /terms-service: 服务条款
│                            # - /*: 404 页面
│
├── stores/                  # Pinia 状态管理
│   ├── d-app.ts            # DApp 状态管理
│   │                        # - address: 当前钱包地址
│   │                        # - addressShort: 短格式地址
│   │                        # - ownerAddress: 合约所有者地址
│   │                        # - auditors: 审计员列表
│   │                        # - setAddress: 设置地址
│   │                        # - isAuditor: 检查是否为审计员
│   │                        # - getAuditors: 获取审计员列表
│   │                        # - signMessage: 签名消息
│   └── index.ts            # Store 入口
│
├── i18n/                    # 国际化资源
│   ├── en-US/              # 英文资源
│   │   └── index.ts        # 英文翻译
│   └── index.ts            # i18n 配置
│
└── css/                     # 样式文件
    ├── app.scss            # 全局样式
    ├── quasar.variables.scss # Quasar 变量覆盖
    └── tailwindcss/        # Tailwind CSS 配置
        ├── input.scss      # Tailwind 输入文件
        ├── output.css      # 编译后的 CSS
        └── tailwind.config.js # Tailwind 配置
```

## 核心功能详解

### 票据状态流转

票据在系统中的状态流转如下：

```
INIT (初始)
  ↓ [审计员审核]
PENDING (待投资)
  ↓ [投资者投资]
ACTIVE (活跃中)
  ↓ [到期/完成]
COMPLETED (已完成)
 或
DEFAULTED (违约)
 或
STOP (停止)

[创建者/所有者可以关闭]
INIT → CLOSED (已关闭)
```

#### 状态说明

- **INIT (0)**: 初始状态，票据刚创建，等待审计员审核
- **INVALID (1)**: 无效状态，票据数据异常
- **PENDING (2)**: 待审核状态，已通过审核，等待投资者投资
- **CLOSED (3)**: 已关闭状态，创建者或所有者主动关闭
- **ACTIVE (4)**: 活跃状态，已有投资者投资，票据生效中
- **COMPLETED (5)**: 已完成状态，票据正常到期并完成
- **DEFAULTED (6)**: 违约状态，借款人未能按时还款
- **STOP (7)**: 停止状态，票据被停止

### 权限系统

应用中有三种角色：

1. **普通用户**
   - 可以创建票据
   - 可以投资票据
   - 可以查看自己创建或投资的票据详情

2. **审计员（Auditor）**
   - 拥有普通用户的所有权限
   - 可以审核 `INIT` 状态的票据
   - 审核时需要上传合同文件并签名

3. **合约所有者（Owner）**
   - 拥有所有权限
   - 可以关闭任何 `INIT` 状态的票据
   - 可以查看所有票据详情

### 智能合约交互

#### FilNote 主合约

主要方法：

- `createNote(targetAmount, interestRateBps, borrowingDays)`: 创建票据
- `pendingNote(noteId, contractHash)`: 审核票据
- `invest(noteId)`: 投资票据（需要发送 FIL）
- `closeNote(noteId)`: 关闭票据
- `getNotes(offset, limit)`: 获取票据列表
- `getAuditors()`: 获取审计员列表
- `owner()`: 获取合约所有者

#### 协议合约

每个活跃的票据都有一个对应的协议合约，主要方法：

- `getContractInfo()`: 获取合约信息（融资金额、节点余额等）
- `withdrawFundingAmount()`: 提取融资金额（创建者）
- `withdraw()`: 提取本金和利息（投资者）

### API 接口

#### 获取验证 UUID

```typescript
GET / verify / get - verify - uuid / { address };
```

- **参数**: `address` - 钱包地址
- **返回**: 验证消息字符串
- **用途**: 审核票据时获取需要签名的消息

#### 上传合同文件

```typescript
POST /verify/upload
Content-Type: multipart/form-data
```

- **参数**:
  - `signature`: 签名字符串
  - `file`: PDF 合同文件
  - `address`: 钱包地址
- **返回**: 合同哈希（UUID）
- **用途**: 上传审核合同文件，返回合同哈希用于链上记录

### 工具函数说明

#### 地址处理

- `handleAddress(address, before, after)`: 将地址格式化为短格式（如：`0x1234...5678`）
- `isZeroAddress(address)`: 检查是否为零地址
- `openViewAddress(address)`: 在区块浏览器中打开地址

#### 金额转换

- `weiToEther(wei, processingAmount)`: 将 Wei 转换为 FIL（以太单位）
- `filToWei(fil)`: 将 FIL 转换为 Wei
- `processingBigAmount(input, decimalPlaces)`: 格式化大金额显示（添加千分位）

#### 利率处理

- `bpsToPercentage(bps)`: 将基点（bps）转换为百分比（1 bps = 0.01%）
- `calculateInterest(principalWei, annualRateBps, days)`: 计算利息

#### 错误处理

- `handleEthErr(err)`: 处理以太坊/智能合约错误，提取可读的错误信息
- `swalAlert`: 统一的弹窗提示（success、error、warning）

#### 时间处理

- `justExpiryTime(expiryTime)`: 判断是否还未到期（返回 true 表示未到期）

### 工作流程

#### 创建票据流程

1. 用户点击"Create Note"按钮
2. 填写表单（目标金额、利率、借款天数）
3. 提交交易，调用 `createNote` 合约方法
4. 等待交易确认
5. 票据创建成功，状态为 `INIT`

#### 审核票据流程

1. 审计员在票据卡片上点击"Review"按钮
2. 上传 PDF 合同文件
3. 系统调用 API 获取验证 UUID
4. 用户使用钱包签名验证消息
5. 上传合同文件和签名到后端 API
6. 后端返回合同哈希（UUID）
7. 调用 `pendingNote` 合约方法，传入票据 ID 和合同哈希
8. 等待交易确认
9. 票据状态变为 `PENDING`

#### 投资票据流程

1. 投资者在 `PENDING` 状态的票据上点击"Invest Note"
2. 显示风险披露声明对话框
3. 用户必须等待 10 秒倒计时
4. 点击"Accept risk"确认
5. 调用 `invest` 合约方法，发送等于目标金额的 FIL
6. 等待交易确认
7. 票据状态变为 `ACTIVE`

#### 提取资金流程

**创建者提取融资金额：**

1. 在协议详情中查看融资金额
2. 点击"Withdrawal"按钮
3. 调用协议合约的 `withdrawFundingAmount` 方法
4. 等待交易确认

**投资者提取本金和利息：**

1. 在协议详情中查看票据信息
2. 等待票据到期（倒计时结束）
3. 点击"Withdrawal"按钮
4. 调用协议合约的 `withdraw` 方法
5. 等待交易确认

## 开发规范

### 代码风格

- 使用 TypeScript 进行类型检查（严格模式）
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 组件使用 Composition API（`<script setup>`）
- 使用 `ref` 和 `reactive` 管理响应式状态
- 使用 `computed` 计算属性
- 使用 `watch` 监听状态变化

### 组件开发规范

- 组件文件使用 PascalCase 命名
- Props 使用 TypeScript 类型定义
- 使用 `defineExpose` 暴露组件方法
- 使用插槽（slots）提高组件复用性
- 错误处理要完善，给用户友好的提示

### 安全注意事项

- **输入验证**：所有用户输入都需要验证（表单验证、类型检查）
- **权限检查**：操作前检查用户权限（是否为审计员、是否为创建者等）
- **错误处理**：完善的错误处理，避免泄露敏感信息
- **合约交互**：所有合约交互都要有错误处理和用户确认
- **金额计算**：使用 BigNumber.js 进行大数运算，避免精度丢失
- **签名安全**：消息签名前要明确告知用户签名的内容

### 性能优化

- 使用 `v-if` 和 `v-show` 合理控制组件渲染
- 使用 `computed` 缓存计算结果
- 避免在模板中进行复杂计算
- 合理使用 `watch`，避免不必要的监听
- 图片和视频资源使用适当的格式和大小

## 常见问题

### 如何连接钱包？

1. 点击页面右上角的"Connect Wallet"按钮
2. 在弹出的对话框中选择支持的钱包
3. 在钱包中确认连接
4. 连接成功后，地址会显示在右上角

### 如何创建票据？

1. 确保已连接钱包
2. 在首页点击"Create Note"按钮
3. 填写表单：
   - **Target Amount**: 目标金额（FIL）
   - **Interest Rate (bps)**: 利率（基点，例如 20 bps = 0.2%）
   - **Borrowing Days**: 借款天数
4. 点击"Create Note"提交
5. 在钱包中确认交易
6. 等待交易确认

### 如何成为审计员？

审计员由合约所有者通过智能合约添加。如果你是合约所有者，可以通过调用合约的 `addAuditor` 方法添加审计员。

### 如何审核票据？

1. 确保你的地址是审计员
2. 在 `INIT` 状态的票据卡片上点击"Review"按钮
3. 上传 PDF 格式的合同文件
4. 系统会自动获取验证消息并请求签名
5. 在钱包中确认签名
6. 等待文件上传和交易确认

### 如何投资票据？

1. 确保已连接钱包并有足够的 FIL
2. 在 `PENDING` 状态的票据卡片上点击"Invest Note"
3. 仔细阅读风险披露声明
4. 等待 10 秒倒计时
5. 点击"Accept risk"确认
6. 在钱包中确认交易（金额等于票据目标金额）
7. 等待交易确认

### 如何提取资金？

**创建者提取融资金额：**

1. 在 `ACTIVE` 状态的票据上点击"Agreement details"
2. 查看"Funding amount"
3. 点击"Withdrawal"按钮
4. 在钱包中确认交易

**投资者提取本金和利息：**

1. 在 `ACTIVE` 状态的票据上点击"Agreement details"
2. 等待票据到期（倒计时结束）
3. 点击"Withdrawal"按钮
4. 在钱包中确认交易

### 交易失败怎么办？

- 检查钱包中是否有足够的 FIL（包括 Gas 费）
- 检查网络连接是否正常
- 查看错误提示信息
- 如果错误信息不明确，可以在区块浏览器中查看交易详情
- 常见错误：
  - "insufficient funds": 余额不足
  - "user rejected": 用户拒绝交易
  - "execution reverted": 合约执行失败（可能是状态不符合要求）

### 如何查看交易详情？

在交易确认对话框中，点击"View on tx"按钮，会在区块浏览器中打开交易详情页面。

## 贡献指南

欢迎提交 Issue！

### 提交 Issue

- 使用清晰、描述性的标题
- 提供详细的复现步骤
- 包含相关的错误信息或截图
- 说明你的环境（浏览器、钱包等）

## 许可证

MIT License

## 相关链接

- [Quasar Framework 文档](https://quasar.dev)
- [Vue 3 文档](https://vuejs.org)
- [Reown AppKit 文档](https://docs.reown.com)
- [ethers.js 文档](https://docs.ethers.org)
- [Filecoin 文档](https://docs.filecoin.io)
- [Filecoin Calibration 测试网](https://calibration.filscan.io)
