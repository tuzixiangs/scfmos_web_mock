#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const source = resolve(process.argv[2] || 'api-docs/openapi-from-swagger-md.json')
const destination = resolve(process.argv[3] || 'src/config/axios/documentedApiPaths.ts')

if (!existsSync(source)) throw new Error(`未找到 OpenAPI 文件：${source}`)

const openapi = JSON.parse(readFileSync(source, 'utf8'))
const paths = Object.keys(openapi.paths || {})
  .map((path) => path.replace(/^\/admin-api/, ''))
  .sort()

const content = `// 此文件由 scripts/build-real-api-manifest.mjs 根据导入的 OpenAPI 文档自动生成。\n` +
  `// 用于真实接口模式中识别可直接交由内网后端处理的请求。\n` +
  `export const documentedApiPaths = new Set<string>(${JSON.stringify(paths, null, 2)})\n`

writeFileSync(destination, content, 'utf8')
console.log(`已生成 ${paths.length} 条真实接口路径：${destination}`)
