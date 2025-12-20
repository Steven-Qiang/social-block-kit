# 社交平台自动拉黑工具

针对社交平台关键词搜索用户（如「日报」「新闻」等营销号）进行批量拉黑的油猴脚本。支持抖音、哔哩哔哩等平台，并提供黑名单清理功能。

[![Release](https://github.com/Steven-Qiang/social-block-kit/actions/workflows/release.yml/badge.svg)](https://github.com/Steven-Qiang/social-block-kit/actions/workflows/release.yml)
[![License](https://img.shields.io/github/license/Steven-Qiang/social-block-kit)](./LICENSE)
[![Version](https://img.shields.io/github/package-json/v/Steven-Qiang/social-block-kit)](./package.json)

<div align="center">
  <img src="https://github.com/Steven-Qiang/social-block-kit/blob/main/assets/screenshot.douyin.png?raw=true" width="45%" alt="抖音拉黑界面" />
  <img src="https://github.com/Steven-Qiang/social-block-kit/blob/main/assets/screenshot.bilibili.png?raw=true" width="45%" alt="B站拉黑界面" />
</div>

<div align="center">
  <img src="https://github.com/Steven-Qiang/social-block-kit/blob/main/assets/screenshot.template.png?raw=true" width="45%" alt="预设管理界面" />
  <img src="https://github.com/Steven-Qiang/social-block-kit/blob/main/assets/screenshot.block-cleaner.png?raw=true" width="45%" alt="黑名单清理界面" />
</div>

## 特性

- 🎯 关键词搜索用户
- 🚫 批量自动拉黑
- 🗑️ 一键清理黑名单
- 📊 实时进度显示
- ⏸️ 支持暂停/停止
- 🔄 自动跳过已拉黑用户
- ✅ 过滤认证用户（仅B站）
- 🌐 多平台支持（抖音、哔哩哔哩）
- 🎨 自适应界面
- 🤝 社区预设模板
- 📋 预设管理功能

## 支持平台

- ✅ [抖音网页版](https://www.douyin.com)
- ✅ [哔哩哔哩](https://www.bilibili.com)
- 🔄 更多平台开发中...

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/)
2. [点击安装脚本](https://github.com/Steven-Qiang/social-block-kit/releases/latest/download/social-block-kit.user.js)
3. 访问支持的平台网页版

## 使用

### 批量拉黑

1. 登录对应平台网页版
2. 右上角出现控制面板
3. 输入关键词（如：新闻、日报）
4. 设置拉黑数量
5. 点击开始

### 清理黑名单（仅B站）

1. 访问 [B站黑名单页面](https://account.bilibili.com/account/blacklist)
2. 面板自动切换为清理模式
3. 点击「开始清理黑名单」
4. 等待清理完成

### 预设管理

1. 点击「⚙️ 预设管理」切换到预设页面
2. 查看和管理现有预设模板
3. 点击「同步社区」获取最新社区预设
4. 创建自定义预设或导入分享的预设

### 社区贡献

欢迎贡献新的预设模板！访问 [block-kit-templates](https://github.com/Steven-Qiang/block-kit-templates) 仓库：

1. Fork 仓库
2. 添加新的 JSON 预设文件
3. 提交 Pull Request
4. 审核通过后所有用户都能同步到你的预设