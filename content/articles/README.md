# 文章管理

这个目录包含了所有的文章内容，每个文章都是一个独立的 `.md` 文件。

## 文章格式

每篇文章都使用 YAML front matter 来存储元数据，格式如下：

```yaml
---
title: 
  zh: "中文标题"
  en: "English Title"
date: "2024-01-15"
readTime: 8
category:
  zh: "分类名称"
  en: "Category Name"
tags: ["标签1", "标签2", "标签3"]
---
```

## 文章内容

文章内容使用标准的 Markdown 格式编写，支持：

- 标题（# ## ###）
- 代码块（```）
- 列表（- *）
- 链接
- 图片
- 表格
- 等等

## 添加新文章

1. 在 `content/articles/` 目录下创建一个新的 `.md` 文件
2. 文件名使用 kebab-case 格式，例如：`my-new-article.md`
3. 在文件开头添加 YAML front matter
4. 编写文章内容
5. 保存文件

## 文章列表

示例文章：

- `frontend-journey.md` - 我的前端开发之路