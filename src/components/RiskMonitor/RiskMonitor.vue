<template>
  <el-dialog
    v-model="dialogVisible"
    title="申请人信息检查"
    width="75%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading">
      <!-- 检查分组列表 -->
      <el-scrollbar ref="scrollbarRef" height="600px">
        <div class="risk-check-container">
          <el-empty
            v-if="checkGroups.length === 0 && !loading"
            description="暂无客户信息检查结果，请点击重新检查"
            :image-size="100"
          />
          <div v-if="checkGroups.length > 0" class="check-progress-panel">
            <div class="progress-title-row">
              <span class="progress-title">批量检查进度</span>
              <el-tag :type="isCheckCompleted ? 'success' : 'info'" size="small" effect="light">
                {{ isCheckCompleted ? '检查完成' : '检查中' }}
              </el-tag>
            </div>
            <el-progress
              :percentage="checkProgress.percentage"
              :status="isCheckCompleted ? 'success' : undefined"
            />
            <div class="progress-description">
              正在检查 {{ checkProgress.total }} 项客户信息，已完成
              {{ checkProgress.completed }} 项，剩余 {{ checkProgress.pending }} 项
            </div>
          </div>
          <div v-for="group in checkGroups" :key="group.grpId" class="check-group">
            <!-- 分组标题 -->
            <div class="group-header">
              <span class="group-title">{{ group.grpNm }}</span>
              <el-tag :type="getGroupTagType(group)" size="small" class="ml-10px">
                {{ getGroupStatus(group) }}
              </el-tag>
            </div>

            <!-- 检查项表格 -->
            <el-table :data="group.checkResults" border class="w-full group-table">
              <el-table-column prop="chkItmNm" label="处理的任务" min-width="300" />
              <el-table-column label="处理结果" width="120" align="center">
                <template #default="{ row }">
                  <div class="result-icon">
                    <el-icon v-if="row.result === 'pass'" color="#67c23a" :size="20">
                      <CircleCheck />
                    </el-icon>
                    <el-icon v-else-if="row.result === 'warning'" color="#e6a23c" :size="20">
                      <Warning />
                    </el-icon>
                    <el-icon v-else-if="row.result === 'fail'" color="#f56c6c" :size="20">
                      <CircleClose />
                    </el-icon>
                    <el-icon
                      v-else-if="row.result === 'loading'"
                      class="is-loading"
                      color="#409eff"
                      :size="20"
                    >
                      <Loading />
                    </el-icon>
                    <el-icon v-else color="#909399" :size="20">
                      <QuestionFilled />
                    </el-icon>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="message"
                label="提示信息"
                min-width="300"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <div v-if="Array.isArray(row.message)">
                    <div v-for="(msg, index) in row.message" :key="index" class="message-item">
                      {{ index + 1 }}. {{ msg }}
                    </div>
                  </div>
                  <div v-else v-dompurify-html="formatMessage(row.message)"></div>

                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 最终结果 -->
          <div v-if="checkGroups.length > 0" class="final-result">
            <span class="result-label">{{ isCheckCompleted ? '最终结果：' : '当前状态：' }}</span>
            <span :class="['result-text', isCheckCompleted ? finalResult.status : 'checking']">
              {{ isCheckCompleted ? finalResult.text : `正在批量检查（${checkProgress.completed}/${checkProgress.total}）` }}
            </span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button @click="handleRecheck" :disabled="!isCheckCompleted">重新检查</el-button>
      <el-button tpye="" @click="handleConfirm" :disabled="!isCheckCompleted || loading || hasPendingItems">确定</el-button>
      <el-button v-if="showJumpCheck" tpye="" @click="handleConfirmNoCheck">确定(跳过校验)</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed ,nextTick} from 'vue'
import { CircleCheck, Warning, CircleClose, QuestionFilled, Loading } from '@element-plus/icons-vue'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { isRequestCanceled } from '@/config/axios/service'
import { getDictLabel } from '@/utils/dict'
import { ElLoading } from 'element-plus'

defineOptions({ name: 'RiskMonitor' })

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  riskData: {
    type: Object,
    default: () => ({})
  }
})

const showJumpCheck = getDictLabel('config','showJumpCheck') === 'on'



const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const message = useMessage()

// 弹框显示状态
const dialogVisible = ref(false)
// 加载状态
const loading = ref(false)


// 检查是否完成（用于控制确定按钮的禁用状态）
const isCheckCompleted = ref(false)
// 当前展开的分组
const activeGroups = ref<string>('')

// 检查分组数据
const checkGroups = ref<any[]>([])

// 滚顶条引用
const scrollbarRef = ref()

const checkProgress = computed(() => {
  const items = checkGroups.value.flatMap((group) => group.checkResults || [])
  const total = items.length
  const completed = items.filter(
    (item: any) => item.result !== 'pending' && item.result !== 'loading'
  ).length
  const pending = Math.max(total - completed, 0)
  return {
    total,
    completed,
    pending,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  }
})

// 最终结果
const finalResult = computed(() => {
  let totalFailed = 0
  let totalWarning = 0

  checkGroups.value.forEach((group) => {
    if (group.checkResults) {
      totalFailed += group.checkResults.filter((item: any) => item.result === 'fail').length
      totalWarning += group.checkResults.filter((item: any) => item.result === 'warning').length
    }
  })

  if (totalFailed > 0) {
    return {
      status: 'fail',
      text: `未通过 ${totalFailed}.申请信息检查`
    }
  } else if (totalWarning > 0) {
    return {
      status: 'warning',
      text: `通过（${totalWarning}个警告）`
    }
  } else {
    return {
      status: 'pass',
      text: '通过'
    }
  }
})

// 获取分组标签类型
const getGroupTagType = (group: any): 'success' | 'warning' | 'danger' | 'info' => {
  if (!group.checkResults || group.checkResults.length === 0) {
    return 'info'
  }

  const hasPending = group.checkResults.some(
    (item: any) => item.result === 'pending' || item.result === 'loading'
  )
  const hasFail = group.checkResults.some((item: any) => item.result === 'fail')
  const hasWarning = group.checkResults.some((item: any) => item.result === 'warning')

  if (hasPending) return 'info'
  if (hasFail) return 'danger'
  if (hasWarning) return 'warning'
  return 'success'
}

// 检查是否还有待检查的项
const hasPendingItems = computed(()=> {
  return checkGroups.value.some((group)=> {
   if(!group.checkResults) return false
   return group.checkResults.some((item:any) => item.result === 'pending' || item.result === 'loading')
  })
})

// 获取分组状态文本
const getGroupStatus = (group: any): string => {
  if (!group.checkResults || group.checkResults.length === 0) {

    return '待检查'
  }

  const failCount = group.checkResults.filter((item: any) => item.result === 'fail').length
  const warningCount = group.checkResults.filter((item: any) => item.result === 'warning').length
  const completedCount = group.checkResults.filter(
    (item: any) => item.result !== 'pending' && item.result !== 'loading'
  ).length

  if (completedCount < group.checkResults.length) {
    return `检查中 ${completedCount}/${group.checkResults.length}`
  }

  if (failCount > 0) return `${failCount}项未通过`
  if (warningCount > 0) return `${warningCount}项警告`
  return '全部通过'
}


const formatMessage = (msg) => {
  if(!msg) return '检查通过'
  return msg
}


// 监听外部传入的 modelValue
watch(
  () => props.modelValue,
  (val) => {
    // dialogVisible.value = val
    if (val) {
      console.log('zzz',showJumpCheck)
      // 弹框打开时，先加载检查项，再执行检查
      loadRiskMonitorData()
    }
  },
  { immediate: true }
)

// 监听内部 dialogVisible 变化，同步到外部
watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// watch(
//   ()=> checkGroups.value,
//   ()=> {
//     if(!isCheckCompleted.value && scrollbarRef.value) {
//       nextTick(()=> {
//         const scrollbarEl = scrollbarRef.value.$el
//         if(scrollbarEl) {
//           const wrapEl = scrollbarEl.querySelector('.el-scrollbar__wrap')
//           if(wrapEl) {
//             // 滚动到底部
//             wrapEl.scrollTop = wrapEl.scrollHeight
//           }
//         }
//       })
//     }
//   }
// )

let abortController: AbortController | null = null

// 关闭弹框
const handleClose = () => {
  abortController?.abort()
  abortController = null
  dialogVisible.value = false
  emit('update:modelValue', false)
  // 重置数据
  checkGroups.value = []
  activeGroups.value = ''
  isCheckCompleted.value = false 
}

// 取消
const handleCancel = () => {
  handleClose()
  emit('cancel')
}

// 确认
const handleConfirm = async () => {
  // 检查是否有失败项
  let hasFailure = false
  checkGroups.value.forEach((group) => {
    if (group.checkResults?.some((item: any) => item.result === 'fail')) {
      hasFailure = true
    }
  })

  if (hasFailure && !props.riskData.otherParams?.isPass) {
    message.warning('存在未通过的检查项，请处理后再提交')
    return
  }

  emit('confirm',hasFailure)
  handleClose()
}

// 跳过校验的提交
const handleConfirmNoCheck = () => {
  emit('confirm')
  handleClose()
}

// 重新检查
const handleRecheck = async () => {
  await loadRiskMonitorData()
  message.success('重新检查完成')
}

// 加载风险监测数据
const loadRiskMonitorData = async () => {
  try {
    loading.value = true
    isCheckCompleted.value = false
    abortController = new AbortController()

    // 第一步：获取全部检查项（返回数据中包含 txnCd 和 checkItemIds）
    const allCheckItemsResponse = await loadAllCheckItems(abortController.signal)

    // 提取 txnCd（任务ID）和 checkItemIds
    const taskId = allCheckItemsResponse.txnCd
    const checkItemIds = allCheckItemsResponse.checkItemIds || []

    console.log('获取到任务ID:', taskId)
    console.log('提取到的检查项IDs:', checkItemIds)

    // 立即初始化显示所有检查项（初始状态为 loading）
    initCheckGroupsWithLoading(allCheckItemsResponse)

    // 默认展开第一个分组
    if (checkGroups.value.length > 0) {
      activeGroups.value = checkGroups.value[0].grpId
    }

    // 第二步：执行检查，获取检查结果（支持递归补全），传入taskId和checkItemIds
    // 注意：这里 loading.value 不能设为 false，因为后台还在检查
    loading.value = false // 允许用户查看界面，但检查项显示局部loading
    await executeRiskCheckWithRetry(allCheckItemsResponse, taskId, checkItemIds,abortController.signal)
    isCheckCompleted.value = true
  } catch (error) {
    if(!isRequestCanceled(error)){
      console.error('加载风险监测数据失败:', error)
      // message.error('加载数据失败')
    }
    loading.value = false
  }
}

// 加载全部检查项（fxtsALL.json）
const loadAllCheckItems = async (signal: AbortSignal) => {
  try {
    console.log(props.riskData)
    const loadingInstance = ElLoading.service({
      text: '处理中...'
    })
    const res  = await ProcessInstanceApi.riskDetectionStart(props.riskData,{ signal }).finally(()=> {
      loadingInstance.close()
    })
    if(!dialogVisible.value) {
      dialogVisible.value = props.modelValue
    }
    // TODO: 替换为实际API调用
    // const res = await RiskMonitorApi.getAllCheckItems(props.processInstance?.id)
    // 返回的数据格式: { txnCd: "任务ID", listArray: [...] }

    // console.log('加载全部检查项...')
    // console.log('流程实例ID:', props.processInstance?.id)

    // 暂时使用mock数据
    const data = res || {}

    const skipCheck = data?.listArray?.length === 0 

    if(skipCheck) {
     handleConfirmNoCheck()
     return 
    }

     
     

    // 遍历 listArray，提取所有 checkItemIds
    const checkItemIds: string[] = []
    const listArray = data.listArray || []

    listArray.forEach((group: any) => {
      // group 结构: { grpId, grpNm, rskInfArray }
      const rskInfArray = group.rskInfArray || []

      rskInfArray.forEach((item: any) => {
        // item 结构: { chkItmNo, chkItmNm }
        if (item.chkItmNo) {
          checkItemIds.push(item.chkItmNo)
        }
      })
    })

    console.log('提取的检查项IDs:', checkItemIds)
    console.log('检查项总数:', checkItemIds.length)

    // 将 checkItemIds 添加到返回数据中，方便后续使用
    return {
      ...data,
      checkItemIds: checkItemIds
    }
  } catch (error) {
    console.error('获取检查项失败:', error)
    handleClose()
    throw error
  }
}

// 执行风险检查（fxtcId.json）
const executeRiskCheck = async (taskId: string, checkItemIds: string[], signal: AbortSignal) => {
  try {
    // TODO: 替换为实际API调用
    // const res = await RiskMonitorApi.executeCheck({
    //   taskId: taskId,
    //   checkItemIds: checkItemIds  // 检查项ID数组
    // })
    // 返回格式: { code: 0, data: { list: [...] } }
    // return res.data || {}
    const res = await ProcessInstanceApi.riskDetectionResult({txnCd:taskId,modelIds:checkItemIds}, {signal})
    console.log('执行风险检查...')
    console.log('任务ID:', taskId)
    console.log('检查项ID数组:', checkItemIds)
    console.log('风险检测信息:', props.riskData)

    // 暂时使用mock数据
    return res || {}
  } catch (error) {
    console.error('执行风险检查失败:', error)
    throw error
  }
}

// 执行风险检查（带重试机制）
const executeRiskCheckWithRetry = async (
  allCheckItems: any,
  taskId: string,
  allCheckItemIds: string[],
  signal: AbortSignal
) => {
  console.log('开始执行风险检查循环...')
  console.log('全部检查项数量:', allCheckItemIds.length)

  // 已获取到的结果Map（用于存储已返回的检查结果）
  const collectedResults = new Map()

  // 最大重试次数
  const maxRetries = 60
  let retryCount = 0

  // 循环请求，直到获取到所有检查项的结果或达到最大重试次数
  while (retryCount < maxRetries) {
    retryCount++

    // 第一次请求传所有ID，后续请求传缺失的ID
    const requestIds =
      retryCount === 1
        ? allCheckItemIds // 第一次传所有检查项ID
        : allCheckItemIds.filter((id) => !collectedResults.has(id)) // 后续只传缺失的ID

    console.log(`第${retryCount}次检查，请求项数量:`, requestIds.length)

    // 执行检查（传入taskId和检查项ID数组）
    const checkResults: any = await executeRiskCheck(taskId, requestIds, signal)

    // 处理接口返回 data 为 null 的情况
    if (checkResults?.isNull === true) {
      console.warn('接口返回 data 为 null，所有检查项标记为不通过')
      const failMsg = checkResults?.msg || '检查未通过'

      // 将所有请求的检查项标记为失败
      requestIds.forEach((id: string) => {
        collectedResults.set(id, {
          modelId: id,
          status: '2', // 未通过
          message: failMsg,
          isNullResult: true // 标记这是 data 为 null 的结果
        })
      })

      // 更新界面显示
      mergeCheckDataWithNullResult(allCheckItems, requestIds, failMsg)

      // 如果所有项都已处理（包括失败项），跳出循环
      if (collectedResults.size >= allCheckItemIds.length) {
        console.log('所有检查项已处理（包含失败项）')
        break
      }

      // 继续处理其他项
      continue
    }

    const resultList = checkResults.list || []

    // 收集结果
    resultList.forEach((item: any) => {
      collectedResults.set(item.modelId, item)
    })

    console.log('已收集结果数量:', collectedResults.size, '/', allCheckItemIds.length)

    // 找出仍然缺失的检查项
    const stillMissing = allCheckItemIds.filter((id) => !collectedResults.has(id))

    if (stillMissing.length === 0) {
      console.log('所有检查项已完成')
      break
    }

    // 实时更新界面：用当前已有的结果更新，缺失的保持loading状态
    mergeCheckData(allCheckItems, { list: Array.from(collectedResults.values()) }, stillMissing)

    // 如果还有缺失项，延迟后继续请求
    if (stillMissing.length > 0 && retryCount < maxRetries) {
      console.log('仍有缺失项，1秒后重新请求...', stillMissing)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  // 最终合并数据（所有项都已有结果或超时）
  mergeCheckData(allCheckItems, { list: Array.from(collectedResults.values()) }, [])

  if (retryCount >= maxRetries) {
    message.warning('部分检查项未能完成，请稍后重试')
  }
}

// 合并检查数据
const mergeCheckData = (allCheckItems: any, checkResults: any, missingIds: string[] = []) => {
  const listArray = allCheckItems.listArray || []
  const resultList = checkResults.list || []

  // 将结果列表转换为以 modelId 为 key 的 Map
  const resultMap = new Map()
  resultList.forEach((item: any) => {
    resultMap.set(item.modelId, item)
  })

  // 缺失ID的Set，用于快速查找
  const missingIdSet = new Set(missingIds)

  // 遍历分组，为每个检查项添加检查结果
  checkGroups.value = listArray.map((group: any) => {
    const checkResults = (group.rskInfArray || []).map((checkItem: any) => {
      // 用 chkItmNo 去匹配 resultMap 中的 modelId
      const result = resultMap.get(checkItem.chkItmNo)

      let resultStatus = 'pending'
      let message = '待检查'

      // 如果在缺失列表中，显示loading状态
      if (missingIdSet.has(checkItem.chkItmNo)) {
        resultStatus = 'loading'
        message = '检查中...'
      } else if (result) {
        // 处理 data 为 null 的情况（标记为 isNullResult）
        if (result.isNullResult === true) {
          resultStatus = 'fail'
          message = result.message || '检查未通过'
        } else {
          // status: "1"-通过, "4"-警告（也算通过）, "2"-未通过
          if (result.status === '1') {
            // 通过
            resultStatus = 'pass'
            message = '检查通过'
          } else if (result.status === '4') {
            // 警告提示（也算通过）
            resultStatus = 'warning'
            // 显示警告信息
            if (result.message) {
              // 处理message中的分隔符 [~`~]，将其拆分为数组
              if (result.message.includes('[~`~]')) {
                message = result.message.split('[~`~]')
              } else {
                message = result.message
              }
            } else {
              message = '警告提示'
            }
          } else if (result.status === '2') {
            // 未通过
            resultStatus = 'fail'
            if (result.message) {
              // 处理message中的分隔符 [~`~]，将其拆分为数组
              if (result.message.includes('[~`~]')) {
                message = result.message.split('[~`~]')
              } else {
                message = result.message
              }
            } else {
              message = '检查未通过'
            }
          } else {
            // 其他未知状态
            resultStatus = 'warning'
            message = result.message || '其他状态'
          }
        }
      }

      return {
        chkItmNo: checkItem.chkItmNo,
        chkItmNm: checkItem.chkItmNm,
        result: resultStatus,
        message: message
      }
    })

    return {
      grpId: group.grpId,
      grpNm: group.grpNm,
      rskInfArray: group.rskInfArray,
      checkResults: checkResults
    }
  })
}
// 处理 data 为 null 的情况，将所有相关检查项标记为失败
  const mergeCheckDataWithNullResult = (
    _allCheckItems: any,
    failedItemIds: string[],
    failMsg: string
  ) => {
    const failedIdSet = new Set(failedItemIds)

    // 更新 checkGroups，将失败的检查项标记为 fail
    checkGroups.value = checkGroups.value.map((group: any) => {
      const checkResults = (group.checkResults || []).map((checkItem: any) => {
        // 如果检查项在失败列表中，标记为失败
        if (failedIdSet.has(checkItem.chkItmNo)) {
          return {
            ...checkItem,
            result: 'fail',
            message: failMsg
          }
        }
        // 其他项保持原状态
        return checkItem
      })

      return {
        ...group,
        checkResults: checkResults
      }
    })
  }
// 初始化检查分组（所有项初始为 loading 状态）
const initCheckGroupsWithLoading = (allCheckItems: any) => {
  const listArray = allCheckItems.listArray || []

  checkGroups.value = listArray.map((group: any) => {
    const checkResults = (group.rskInfArray || []).map((checkItem: any) => {
      return {
        chkItmNo: checkItem.chkItmNo,
        chkItmNm: checkItem.chkItmNm,
        result: 'loading',
        message: '检查中...'
      }
    })

    return {
      grpId: group.grpId,
      grpNm: group.grpNm,
      rskInfArray: group.rskInfArray,
      checkResults: checkResults
    }
  })
}

// 对外暴露的方法
defineExpose({
  handleClose,
  loadRiskMonitorData
})
</script>

<style scoped lang="scss">
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.risk-check-container {
  padding: 10px;

  .check-progress-panel {
    padding: 14px 16px;
    margin-bottom: 18px;
    background-color: #f5f7fa;
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;

    .progress-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .progress-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }

    .progress-description {
      margin-top: 8px;
      font-size: 13px;
      color: #909399;
    }
  }

  .check-group {
    margin-bottom: 25px;

    &:last-child {
      margin-bottom: 10px;
    }

    .group-header {
      display: flex;
      align-items: center;
      padding: 12px 15px;
      margin-bottom: 10px;
      font-weight: 600;
      background-color: #f5f7fa;
      border: 1px solid var(--el-border-color-light);
      border-radius: 4px;

      .group-title {
        font-size: 15px;
        color: #303133;
      }
    }

    .group-table {
      margin-bottom: 0;
    }
  }

  :deep(.el-table) {
    .el-table__header {
      th {
        font-weight: 600;
        background-color: #fafafa;
      }
    }

    .el-table__body {
      td {
        padding: 12px 0;
      }
    }
  }

  .result-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    .is-loading {
      animation: rotating 2s linear infinite;
    }
  }

  .message-item {
    margin-bottom: 5px;
    line-height: 1.6;
    white-space: wrap;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.final-result {
  padding: 15px;
  margin-top: 20px;
  font-size: 16px;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 4px;

  .result-label {
    margin-right: 10px;
    font-weight: 600;
    color: #606266;
  }

  .result-text {
    font-weight: 600;

    &.pass {
      color: #67c23a;
    }

    &.warning {
      color: #e6a23c;
    }

    &.fail {
      color: #f56c6c;
    }

    &.checking {
      color: #409eff;
    }
  }
}
</style>
