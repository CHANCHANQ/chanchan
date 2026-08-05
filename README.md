# 作品集网站 · 部署说明

这个文件夹就是完整网站，需要整个文件夹一起上传，不要只传 `index.html`。

## 本地预览

```bash
node _serve.js
```

然后浏览器打开 `http://localhost:4173`。

## 生成网络链接（三选一）

### 1. Netlify Drop（最快）

1. 打开 https://app.netlify.com/drop
2. 把整个 `portfolio-site` 文件夹拖进页面
3. 等待部署完成，复制 `https://xxx.netlify.app` 链接

### 2. Vercel

1. 打开 https://vercel.com/new
2. 拖入 `portfolio-site` 文件夹
3. 点击 Deploy，完成后复制链接

### 3. 妙搭 / 其他静态托管

把整个文件夹上传到妙搭静态托管或任意静态网站托管，入口文件选择 `index.html`。

## 注意事项

- 视频在 `assets/videos`，图片在 `assets/images`，必须随站点一起部署。
- 当前素材约 187MB，正式对外发布前建议先压缩图片与视频。
