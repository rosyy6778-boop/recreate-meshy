# Cloudflare Pages 部署说明

本项目是纯前端 Next.js 演示站，已配置为静态导出，构建产物位于 `out`。

## 第一次连接 GitHub

1. 登录 Cloudflare Dashboard，进入 **Workers & Pages**。
2. 点击 **Create application**，选择 **Pages**。
3. 选择 **Import an existing Git repository**。
4. 授权 Cloudflare 访问 GitHub 仓库 `rosyy6778-boop/recreate-meshy`。
5. 使用以下构建配置：

| 配置项 | 值 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Next.js (Static HTML Export)` |
| Build command | `pnpm build` |
| Build output directory | `out` |
| Root directory | `/` |

如果 Cloudflare 无法自动识别 pnpm，可增加环境变量：

| 变量 | 值 |
| --- | --- |
| `NODE_VERSION` | `24` |

首次部署完成后会得到一个类似 `recreate-meshy.pages.dev` 的临时地址。

## 绑定现有域名的子域名

假设已有域名为 `example.com`，希望使用 `meshy.example.com`：

1. 打开 **Workers & Pages > 当前 Pages 项目 > Custom domains**。
2. 点击 **Set up a domain**。
3. 输入完整子域名 `meshy.example.com` 并确认。
4. 如果域名 DNS 已由同一 Cloudflare 账户管理，Cloudflare 会自动创建 DNS 记录并签发 HTTPS 证书。
5. 等待 Custom domains 页面状态变为 **Active** 后，用浏览器访问该子域名。

不要只在 DNS 页面手动添加 CNAME 而跳过 Pages 项目的 **Set up a domain**，否则 Pages 无法识别这个自定义域名。

如果域名 DNS 不在 Cloudflare 管理，需要在当前 DNS 服务商处增加：

| Type | Name | Target |
| --- | --- | --- |
| `CNAME` | `meshy` | `<你的-pages-项目>.pages.dev` |

仍然要先在 Pages 的 **Custom domains** 中添加该子域名，再创建 CNAME。

## 后续自动同步

Cloudflare Pages 连接 GitHub 后，每次向 `main` 分支推送新提交，都会自动构建并更新正式站点：

```bash
git add -A
git commit -m "描述本次修改"
git push origin main
```

可以在 **Workers & Pages > 当前项目 > Deployments** 查看构建日志和发布状态。其他分支或 Pull Request 可以生成独立预览地址，不影响正式子域名。

## 本地部署前检查

```bash
pnpm typecheck
pnpm lint
pnpm build
```

构建成功后，静态文件会生成到 `out`。
