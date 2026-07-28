const chineseInitialBoundaries = [
  '阿',
  '八',
  '擦',
  '搭',
  '蛾',
  '发',
  '噶',
  '哈',
  '击',
  '喀',
  '垃',
  '妈',
  '拿',
  '哦',
  '啪',
  '期',
  '然',
  '撒',
  '塌',
  '挖',
  '昔',
  '压',
  '匝'
]
const chineseInitialLetters = 'ABCDEFGHJKLMNOPQRSTWXYZ'

const getChineseInitial = (character: string) => {
  for (let index = chineseInitialBoundaries.length - 1; index >= 0; index -= 1) {
    if (character.localeCompare(chineseInitialBoundaries[index]!, 'zh-Hans-CN') >= 0) {
      return chineseInitialLetters[index] || 'X'
    }
  }
  return 'X'
}

/** 将中文、英文名称转换为适合商品分类编码的首字母。 */
export const getCategoryNameInitials = (name: string) => {
  const initials = Array.from(name.trim()).reduce((result, character) => {
    if (/[a-z0-9]/i.test(character)) return `${result}${character.toUpperCase()}`
    if (/^[\u4e00-\u9fff]$/u.test(character)) return `${result}${getChineseInitial(character)}`
    return result
  }, '')

  return initials.slice(0, 12) || 'X'
}

/**
 * 在同一层级的编码发生首字母冲突时，以 -2、-3… 的后缀保持编码唯一。
 * 页面预览和 Mock 保存共用此规则，避免展示值与保存结果不一致。
 */
export const createUniqueCategoryCode = (baseCode: string, existingCodes: string[]) => {
  const existingCodeSet = new Set(existingCodes)
  if (!existingCodeSet.has(baseCode)) return baseCode

  let sequence = 2
  while (existingCodeSet.has(`${baseCode}-${sequence}`)) sequence += 1
  return `${baseCode}-${sequence}`
}

export const generateInventoryGoodsCodes = (names: {
  largeCategoryName: string
  middleCategoryName: string
  smallCategoryName: string
}) => {
  const largeCategoryCode = getCategoryNameInitials(names.largeCategoryName)
  const middleCategoryCode = `${largeCategoryCode}-${getCategoryNameInitials(
    names.middleCategoryName
  )}`

  return {
    largeCategoryCode,
    middleCategoryCode,
    smallCategoryCode: `${middleCategoryCode}-${getCategoryNameInitials(names.smallCategoryName)}`
  }
}
