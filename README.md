# MCP 服务器

基于 Node.js 实现的管理控制协议服务器。

## 功能特性

- 系统时间获取服务
- 模块化架构，易于扩展
- RESTful API 设计
- 全面的日志记录
- 单元测试覆盖率
- 插件系统（未来扩展）
- 可配置设置

## 安装

```bash
npm install
```

## 使用方法

```bash
# 启动服务器
npm start

# 开发模式（自动重载）
npm run dev

# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage
```

## API 端点

### 获取当前时间

```
GET /api/time
```

参数：
- `format`: 响应格式（`timestamp`、`formatted` 或 `both`）
  - `timestamp`: 返回 Unix 时间戳（默认）
  - `formatted`: 返回格式化字符串（YYYY-MM-DD HH:MM:SS）
  - `both`: 返回时间戳和格式化时间

响应示例：

时间戳格式：
```json
{
  "success": true,
  "data": {
    "timestamp": 1678901234
  }
}
```

格式化格式：
```json
{
  "success": true,
  "data": {
    "formatted": "2023-03-15 18:27:14"
  }
}
```

两种格式：
```json
{
  "success": true,
  "data": {
    "timestamp": 1678901234,
    "formatted": "2023-03-15 18:27:14"
  }
}
```

### 健康检查

```
GET /api/health
```

响应：
```json
{
  "status": "OK",
  "timestamp": "2023-03-15T18:27:14.123Z",
  "service": "MCP Server"
}
```

## 配置

服务器可以使用环境变量进行配置：

- `PORT`: 服务器端口（默认：3000）
- `HOST`: 服务器主机（默认：localhost）
- `LOG_LEVEL`: 日志级别（默认：info）
- `LOG_FILE`: 日志文件路径（默认：logs/mcp-server.log）
- `PLUGINS_ENABLED`: 启用插件系统（默认：false）
- `PLUGINS_DIRECTORY`: 插件目录路径（默认：./plugins）
- `REQUEST_LOGGING`: 启用请求日志记录（默认：true）

## 架构

服务器采用分层架构：

```
┌─────────────────┐
│   Controller    │ ← 处理 HTTP 请求/响应
├─────────────────┤
│    Service      │ ← 实现业务逻辑
├─────────────────┤
│    Utility      │ ← 提供通用辅助函数
└─────────────────┘
```

- **控制器层**: 处理 HTTP 请求和响应
- **服务层**: 实现业务逻辑
- **工具层**: 提供通用辅助函数
- **中间件层**: 处理横切关注点（日志记录、错误处理）
- **配置层**: 管理应用程序设置

## 测试

运行单元测试：

```bash
npm test
```

运行测试并生成覆盖率报告：

```bash
npm run test:coverage
```

## 扩展服务器

### 添加新端点

1. 在 `src/services/` 中创建新服务
2. 在 `src/controllers/` 中创建新控制器
3. 在 `src/routes/` 中添加路由
4. 在 `src/routes/index.js` 中注册路由

### 插件系统

服务器包含用于未来扩展的插件系统。启用方法：

1. 在环境变量中设置 `PLUGINS_ENABLED=true`
2. 将插件文件放置在插件目录中（默认：`./plugins`）
3. 插件应导出至少包含 `name` 属性的对象

插件结构示例：
```javascript
// plugins/examplePlugin.js
module.exports = {
  name: 'example-plugin',
  version: '1.0.0',
  init: function(server) {
    // 插件初始化代码
    console.log('示例插件已初始化');
  }
};
```

## 错误处理

服务器实现了统一的错误处理系统：

- 自定义 `MCPError` 类用于应用程序特定错误
- 全局错误处理中间件
- 一致的错误响应格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

## 日志记录

服务器使用 Winston 进行日志记录，支持文件和控制台传输。日志包括：

- 请求/响应日志
- 错误日志
- 应用程序事件
- 调试信息

日志格式：
```
{"level":"info","message":"传入请求","timestamp":"2023-03-15T18:27:14.123Z","service":"mcp-server","method":"GET","url":"/api/time","ip":"::1"}
```