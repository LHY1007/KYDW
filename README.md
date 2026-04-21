# KYDW Academic Team Website

这是一个纯静态网站仓库，已配置 **GitHub Pages 自动发布**。

## 已完成的发布配置

- 工作流文件：`.github/workflows/static.yml`
- 自动触发：

  - 支持 `workflow_dispatch` 手动发布
- 发布前校验：检查首页、样式、渲染脚本和 `data/*.json` 是否存在
- 产物处理：自动生成 `.nojekyll`，避免 Jekyll 干扰静态资源

## 你需要在 GitHub 页面做的一次性设置

1. 打开仓库 **Settings → Pages**。
2. 在 **Build and deployment** 里选择：
   - **Source = GitHub Actions**
3. 保存后，推送到默认分支（例如 `main`）即可自动发布。



## 发布后的访问地址

通常为：

- `https://<你的GitHub用户名>.github.io/<仓库名>/`

如果仓库是用户主页仓库（如 `<用户名>.github.io`），则地址为根域名。

## 本地预览（推荐）

因为页面依赖 `fetch` 读取 `data/*.json`，不要直接双击 HTML，建议用本地静态服务器：

```bash
python -m http.server 8000
```

然后访问：

- `http://localhost:8000/`

## 内容更新方式

- 人员：`data/members.json`
- 活动：`data/activities.json`
- 成果：`data/publications.json`
- 亮点：`data/highlights.json`
- 新闻：`data/news.json`

修改这些 JSON 后提交到默认分支即可上线。

## 常见“没有反应”排查

1. 看 **Actions** 页是否有 `Deploy static content to Pages` 工作流运行记录。

3. 有运行但失败：点开日志看 `Validate core files` 哪个文件缺失。
4. 运行成功但页面还是旧内容：
   - 等 1-3 分钟 CDN 刷新
   - 强制刷新浏览器（`Ctrl/Cmd + Shift + R`）
   - 确认访问的是正确地址（项目仓库通常要带仓库名路径）

