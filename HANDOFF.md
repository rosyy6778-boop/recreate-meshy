# Meshy 首页重构交接

更新时间：2026-08-24

## 项目位置

- 实际项目：`/Users/apple/Documents/Codex/2026-08-21/meshy-chatgpt-conversation-6a847764-94b8-83ea/recreate-meshy`
- 当前新任务目录：`/Users/apple/Documents/ChatGPT/meshy`
- 当前新任务目录只有 `.git`，没有项目文件。后续必须在上面的“实际项目”路径继续，不要在空目录重新初始化或重复克隆。
- Git 当前显示全仓库为未跟踪文件，这是此前从模板归档落地后初始化仓库造成的现状，不代表本轮删除了历史内容；不要运行 `git reset --hard` 或覆盖用户文件。

## 产品目标与固定范围

- 只做桌面端，目标视口 1440px；不做平板和移动端。
- 不是继续像素级克隆，而是在 Meshy 已登录首页基础上做更方便工作的产品重构。
- 保留 Meshy 的顶部导航信息架构、深色底、绿色/蓝色光晕和中心创建入口。
- 首页第一任务是“开始或继续 3D 工作”，社区模型下沉到下方 Gallery，不能抢占中心工作区。
- 所有需求要从用户价值和第一性原理评估；没有价值或造成虚假能力承诺时应明确反驳。
- 默认中文，仅保留 PBR、UV、Low Poly 等必要术语。

## 已完成的实现

- Next.js 16.3 桌面端首页已实现，可在 `/` 查看。
- 已有单个资产 / 创建项目、图生 3D / 智能助手、图片可用性检查、模式说明、预计积分提示等交互原型。
- 多视图建议已收进图片帮助问号；智能规划提示已直接放进输入框。
- 帮助问号只用鼠标悬停，不需要长按固定。
- 老用户“继续工作”按待处理、继续工作、建议优化组织，并已有可折叠项目单元；新用户有推荐起点。
- 下方社区 Gallery 已有搜索、筛选、分类和约 31 张素材卡，桌面端有限展示，不做无限采集。
- Gallery hover 有骨架、贴图、组件拆分视觉示意；社区卡片静态信息已改为资产类别，能力文案已改为“骨骼结构示意 / 材质对比预览 / 组件拆分示意”。
- 本轮 typecheck、lint、build 已重新通过。

## 本轮已经落地到代码的规格

- `docs/research/meshy-ai-cdbf21bf/zh-discover-c676102e/components/WorkspaceHeader.spec.md`
- `docs/research/meshy-ai-cdbf21bf/zh-discover-c676102e/components/SkillArchitecture.spec.md`
- `docs/research/meshy-ai-cdbf21bf/zh-discover-c676102e/components/DenseTopologyGallery.spec.md`

本轮已按上述规格修改 `workspace-header.tsx`、`creation-command-center.tsx`、`surround-gallery.tsx` 和 `model-capability-visual.tsx`。

## 本轮完成清单

### 1. Skill 架构

- 已删除 Skill 中的“图片转 3D”；它保留为基础输入方式，不作为 Skill。
- 单个资产模式的 `技能` 面板已分两组，名称后使用同字号浅色文字解释用途：
  - 创意模板：Chibi 手办、砖块人物、冰箱磁贴、扭蛋玩具、Low Poly、写实模型、动漫角色、玩具风格。
  - 生产工具：游戏资产基础检查、3D 打印基础检查、PBR 材质补全、骨骼绑定、组件拆分。
- 游戏/打印检查文案只承诺基础分析，未承诺 Unity/Unreal Ready、自动 LOD、材料重量、CAD 或制造可行性。
- 创建项目模式下按钮已改为 `项目模板`，包含：制作可动画角色、验证产品外观方案、制作一套游戏道具、拆解场景并制作资产；同样显示用途说明。
- 选择模板只填充/辅助规划提示，不直接生成、不扣积分。

### 2. 中心命令行紧凑化

- 已删除“最多 4 张”及 4 张截断逻辑，没有新增替代限制文案。
- `添加图片`、`技能`/`项目模板`、两个情境建议已放在同一行。
- Skill 展开面板仍在卡片内部流式展开。

### 3. 顶部导航

- 已对齐当前已登录 Meshy 桌面端结构：左侧 Meshy、社区、API、资源、创意工坊；右侧 Agent、分体式工作区按钮、积分、升级、礼物/帮助/通知、头像等。
- Header 高度为 56px，左侧 16px、右侧 20px，导航约 14px；保留当前产品颜色。

### 4. Gallery 能力真实性

- 普通社区卡片静态信息已改成真实资产分类（角色、动物、家具等）。
- hover 和详情已明确写成“骨骼结构示意 / 材质对比预览 / 组件拆分示意”，表示能力演示而非该资产已完成处理。
- 蘑菇守护者等社区卡不再静态标为“骨骼绑定”；用户自己的历史项目卡继续显示真实完成状态或下一步建议。

### 5. 状态文件

- 已更新本文件和 `docs/research/meshy-ai-cdbf21bf/zh-discover-c676102e/CLONE_STATUS.md`，不再恢复已放弃的四边形拓扑方案。

## 验证边界（用户明确要求）

- 优先修改和 build，然后一次桌面端验证。
- 浏览器验证最多 2 轮；单次工具调用超时不要无限重试。
- 同一失败超过 2 次就停止，并清楚说明阻塞原因。
- 不要拆分子 Agent。

## 本地运行

项目依赖已经存在。可优先使用环境自带 pnpm；若 PATH 缺少 Node/pnpm，可使用：

```bash
export PATH="/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH"
pnpm typecheck
pnpm lint
pnpm build
pnpm start -p 3002
```

本地验证地址：`http://localhost:3002/`

## 本轮验证结果

```bash
pnpm typecheck
pnpm lint
pnpm build
```

- 三项均已通过。一次并行验证曾因 `.next/types` 生成竞争导致 `tsc` 找不到临时 `routes.js`，随后按顺序重跑 `pnpm typecheck` 通过。
- 1440px 浏览器基础验证通过：页面可加载，Header 高度 56px，无横向溢出，页面文本中没有“最多 4 张”，Skill 文本中没有“图片转 3D”。
- 浏览器展开菜单验证未继续重试：Browser 工具的等待/点击接口连续失败超过 2 次，按用户边界停止；源码和构建检查已覆盖对应实现。
