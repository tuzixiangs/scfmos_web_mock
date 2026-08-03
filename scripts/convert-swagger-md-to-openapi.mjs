#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const [sourceFile, outputFile = 'api-docs/openapi-from-swagger-md.json'] = process.argv.slice(2)

if (!sourceFile) {
  throw new Error('用法：node scripts/convert-swagger-md-to-openapi.mjs <接口文档.md> [输出文件.json]')
}

const markdown = readFileSync(resolve(sourceFile), 'utf8').replace(/\r\n/g, '\n')
const title = (markdown.match(/^#\s+(.+)$/m)?.[1] || '供应链系统接口').trim()
const host = (markdown.match(/^\*\*HOST\*\*:\s*(.+)$/m)?.[1] || '').trim()
const typeMap = {
  integer: 'integer',
  number: 'number',
  boolean: 'boolean',
  array: 'array',
  file: 'string',
  string: 'string',
  object: 'object'
}

const readCodeExample = (section, heading) => {
  const match = section.match(
    new RegExp('\\*\\*' + heading + '\\*\\*:\\s*[\\s\\S]*?```(?:javascript|json)?\\s*([\\s\\S]*?)\\s*```')
  )
  if (!match) return undefined
  try {
    return JSON.parse(match[1])
  } catch {
    return undefined
  }
}

const schemaFromExample = (value) => {
  if (Array.isArray(value)) return { type: 'array', items: value.length ? schemaFromExample(value[0]) : {} }
  if (value === null) return { nullable: true }
  if (typeof value === 'object') {
    return {
      type: 'object',
      properties: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, schemaFromExample(item)]))
    }
  }
  if (typeof value === 'number') return { type: Number.isInteger(value) ? 'integer' : 'number', example: value }
  if (typeof value === 'boolean') return { type: 'boolean', example: value }
  return { type: 'string', example: String(value ?? '') }
}

const markdownTableRows = (section) => {
  const table = section.match(/\*\*请求参数\*\*:\s*([\s\S]*?)(?=\n\*\*响应状态\*\*|\n\*\*响应参数\*\*|\n\*\*响应示例\*\*|$)/)
  if (!table) return []
  return table[1]
    .split('\n')
    .filter((line) => line.trim().startsWith('|') && !/^\|\s*-+/.test(line))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 5 && cells[0] !== '参数名称')
    .map(([name, description, location, required, dataType]) => ({
      name: name.replace(/&emsp;/g, '').trim(),
      description,
      location: location.toLowerCase(),
      required: required === 'true',
      dataType: dataType.toLowerCase()
    }))
    .filter((item) => item.name)
}

const paths = {}
const operationCounts = new Map()
let group = title
let endpointCount = 0

const sections = markdown.split(/(?=^#\s|^##\s)/m)
for (const section of sections) {
  const h1 = section.match(/^#\s+(.+)$/m)
  if (h1 && !section.match(/^##\s/m)) {
    group = h1[1].trim()
    continue
  }

  const h2 = section.match(/^##\s+(.+)$/m)
  const address = section.match(/\*\*接口地址\*\*:\s*`([^`]+)`/)
  const requestMethod = section.match(/\*\*请求方式\*\*:\s*`?([A-Z]+)`?/)
  if (!h2 || !address || !requestMethod) continue

  const path = address[1].trim()
  const method = requestMethod[1].toLowerCase()
  const requestType = (section.match(/\*\*请求数据类型\*\*:\s*`([^`]+)`/)?.[1] || 'application/json')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
  const parameters = markdownTableRows(section)
  const requestExample = readCodeExample(section, '请求示例')
  const responseExample = readCodeExample(section, '响应示例') || { code: 0, data: {}, msg: '' }
  const parameterList = parameters
    .filter((item) => ['query', 'header', 'path'].includes(item.location))
    .map((item) => ({
      name: item.name,
      in: item.location,
      required: item.location === 'path' ? true : item.required,
      description: item.description || undefined,
      schema: { type: typeMap[item.dataType] || 'string' }
    }))
  const bodyParameter = parameters.find((item) => item.location === 'body')
  const content = {}
  if (bodyParameter || requestExample) {
    const schema = requestExample ? schemaFromExample(requestExample) : { type: 'object' }
    for (const contentType of requestType) content[contentType] = { schema, example: requestExample }
  }

  const baseOperationId = `${method}_${path.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')}`
  const seen = operationCounts.get(baseOperationId) || 0
  operationCounts.set(baseOperationId, seen + 1)
  const operation = {
    tags: [group],
    summary: h2[1].trim(),
    operationId: seen ? `${baseOperationId}_${seen + 1}` : baseOperationId,
    parameters: parameterList.length ? parameterList : undefined,
    requestBody: Object.keys(content).length ? { required: Boolean(bodyParameter?.required), content } : undefined,
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: schemaFromExample(responseExample),
            example: responseExample
          }
        }
      }
    }
  }
  Object.keys(operation).forEach((key) => operation[key] === undefined && delete operation[key])
  paths[path] ||= {}
  if (paths[path][method]) {
    paths[path][`x-duplicate-${method}-${seen + 1}`] = operation
  } else {
    paths[path][method] = operation
  }
  endpointCount += 1
}

const document = {
  openapi: '3.0.3',
  info: { title, version: '1.0.0', description: '由 Swagger Markdown 文档转换，用于导入 Apifox。' },
  servers: host ? [{ url: host, description: '内网接口环境' }] : [],
  paths,
  components: {
    securitySchemes: {
      Authorization: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  }
}

const target = resolve(outputFile)
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, `${JSON.stringify(document, null, 2)}\n`)
console.log(JSON.stringify({ output: target, endpointCount, pathCount: Object.keys(paths).length }, null, 2))
