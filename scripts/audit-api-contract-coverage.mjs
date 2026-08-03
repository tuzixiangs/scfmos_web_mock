#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const specFile = resolve(process.argv[2] || 'api-docs/openapi-from-swagger-md.json')
if (!existsSync(specFile)) {
  throw new Error(`未找到 OpenAPI 文件：${specFile}`)
}

const spec = JSON.parse(readFileSync(specFile, 'utf8'))
const documentedPaths = new Set(
  Object.keys(spec.paths || {}).map((path) => path.replace(/^\/admin-api/, ''))
)
const apiFiles = process.argv.slice(3)
if (!apiFiles.length) {
  throw new Error('请传入需要核对的 API 源文件路径')
}

const urls = new Map()
for (const file of apiFiles) {
  const source = readFileSync(resolve(file), 'utf8')
  const matches = source.matchAll(/url\s*:\s*[`'\"]([^`'\"?]+)(?:\?[^`'\"]*)?[`'\"]/g)
  for (const match of matches) {
    const url = match[1].replace(/\$\{[^}]+\}/g, ':id')
    if (!url.startsWith('/')) continue
    const files = urls.get(url) || []
    files.push(file)
    urls.set(url, files)
  }
}

const result = [...urls.entries()].map(([url, files]) => ({
  url,
  documented: documentedPaths.has(url),
  files
}))

const documented = result.filter((item) => item.documented)
const missing = result.filter((item) => !item.documented)
console.log(`已识别 ${result.length} 个前端接口：文档已覆盖 ${documented.length} 个，待补充 ${missing.length} 个。`)
if (missing.length) {
  console.log('\n文档未覆盖的接口（继续由 Mock 或待后端补充）：')
  for (const item of missing) console.log(`- ${item.url}  <- ${item.files.join(', ')}`)
}
