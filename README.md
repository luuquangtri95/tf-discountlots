# Hướng dẫn Cài đặt và Phát triển

## Yêu cầu hệ thống

- Node.js version ≥ 18.20

## Cài đặt

1. Cài đặt các dependencies:

```bash
npm install
```

## Khởi chạy dự án

1. Kiểm tra đã đăng nhập vào đúng Shopify Partner bằng lệnh:

```bash
shopify theme info
```

2. Chạy ở môi trường development:

```bash
npm run dev
```

> **Lưu ý:** Để cấu hình store development, vui lòng tham khảo file mẫu `shopify.theme.toml.example`

## Cấu trúc và Build Assets

### Thư mục làm việc

Thư mục `app` chỉ dùng để phát triển và chỉnh sửa các file SCSS và JavaScript:

- SCSS: `app/styles`
- JavaScript: `app/scripts`

> **Lưu ý:** Không chỉnh sửa trực tiếp các file trong thư mục `assets`. Mọi thay đổi về styles và scripts cần được thực hiện trong thư mục `app`.

### Phát triển Liquid Templates

Các file `.liquid` được phát triển theo cấu trúc chuẩn của Shopify:

- `sections/`: Chứa các section có thể tái sử dụng
- `blocks/`: Chứa các block có thể tái sử dụng
- `snippets/`: Chứa các snippet nhỏ có thể được render vào các file khác
- `templates/`: Chứa các template chính của theme
- `layout/`: Chứa các file layout

> **Lưu ý:** Tuân thủ các quy tắc và best practices của Shopify khi phát triển liquid templates.

### Quy trình build

- Files từ thư mục `app/scripts` và `app/styles` sẽ được tự động build và output vào thư mục `assets`
- Để quản lý code tốt hơn, bạn có thể tách components thành các files riêng biệt trong:
  - `app/scripts/common`: Cho JavaScript components
  - `app/styles/common`: Cho SCSS components

### Quy tắc Minify

Quy tắc đặt tên file để xác định việc minify:

- Files có tên kết thúc bằng `.min.js` hoặc `.min.css` sẽ được minify tự động
- Files không có `.min` trong tên sẽ giữ nguyên định dạng readable
- Ví dụ:
  - `app/scripts/main.min.js` -> sẽ được minify
  - `app/scripts/debug.js` -> sẽ không được minify
  - `app/styles/theme.min.css` -> sẽ được minify
  - `app/styles/custom.css` -> sẽ không được minify

---

# Installation and Development Guide

## System Requirements

- Node.js version ≥ 18.20

## Installation

1. Install dependencies:

```bash
npm install
```

## Run Project

1. Check if you have logged into the correct Shopify Partner using the command:

```bash
shopify theme info
```

2. Run in development environment:

```bash
npm run dev
```

> **Note:** To configure development store, please refer to `shopify.theme.toml.example`

## Structure and Build Assets

### Working Directory

The `app` directory is only used for developing and editing SCSS and JavaScript files:

- SCSS: `app/styles`
- JavaScript: `app/scripts`

> **Note:** Do not edit files directly in the `assets` directory. All style and script changes should be made in the `app` directory.

### Liquid Templates Development

Liquid files are developed following Shopify's standard structure:

- `sections/`: Contains reusable sections
- `blocks/`: Contains reusable blocks
- `snippets/`: Contains small snippets that can be included in other files
- `templates/`: Contains main theme templates
- `layout/`: Contains layout files

> **Note:** Follow Shopify's rules and best practices when developing liquid templates.

### Build Process

- Files from `app/scripts` and `app/styles` will be automatically built and output to the `assets` directory
- For better code management, you can separate components into individual files in:
  - `app/scripts/common`: For JavaScript components
  - `app/styles/common`: For SCSS components

### Minify Rules

File naming rules for minification:

- Files ending with `.min.js` or `.min.css` will be automatically minified
- Files without `.min` in the name will remain in readable format
- Examples:
  - `app/scripts/main.min.js` -> will be minified
  - `app/scripts/debug.js` -> will not be minified
  - `app/styles/theme.min.css` -> will be minified
  - `app/styles/custom.css` -> will not be minified
