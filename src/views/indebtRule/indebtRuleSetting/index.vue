<template>
  <div class="rule-add">
    <div class="rule-add-content">
      <div v-if="ruleAdd" class="page-header">
        <div class="title">
          <span class="title-icon"></span>
          规则添加
        </div>
      </div>
      <div v-else-if="ruleEdit" class="page-header">
        <div class="title">
          <span class="title-icon"></span>
          规则编辑
        </div>
      </div>
      
      <el-form ref="formRef" :model="formData" :label-width="160" @submit.prevent="ruleAdd ? handleSubmit : submitEdit" class="rule-form">
        <!-- 基本信息区域 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-icon"></span>
            基本信息
          </div>
          <div class="form-grid">
            <el-form-item label="编号">
              <el-input v-model="formData.id" :disabled="ruleEdit" class="uniform-input" />
            </el-form-item>
            <el-form-item label="规则名称">
              <el-input v-model="formData.ruleName" placeholder="请输入规则名称" class="uniform-input" />
            </el-form-item>
            <el-form-item label="A/B/C类规则">
              <el-radio-group v-model="formData.ruleType" @change="onChangeRadio" class="custom-radio-group">
                <el-radio-button value="A">A类-放款前规则</el-radio-button>
                <el-radio-button value="B">B类-授信支持资产规则</el-radio-button>
                <el-radio-button value="C">C类-预警规则</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="预警后未命中是否自动消除" v-if="formData.ruleType === 'C'">
              <el-select v-model="formData.isAutoClear" placeholder="请选择" class="uniform-input">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <!-- 配置信息区域 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-icon"></span>
            配置信息
          </div>
          <div class="form-grid">
            <el-form-item label="业务模式">
              <el-select v-model="formData.bizModel" placeholder="请选择" class="uniform-input">
                <el-option label="应收类" value="YS" />
                <el-option label="预付类" value="YF" />
                <el-option label="存货类" value="CH" />
                <el-option label="通用类" value="TY" />
              </el-select>
            </el-form-item>
            <el-form-item label="产品类型">
              <el-select v-model="formData.decisionStep" placeholder="请选择" class="uniform-input">
                <el-option label="采购" value="CG" />
                <el-option label="存货" value="CH" />
                <el-option label="销售" value="XS" />
                <el-option label="订单融资" value="DDRZ" />
                <el-option label="建筑集采" value="JZJC" />
                <el-option label="六六云链" value="SIXCLOUD" />
              </el-select>
            </el-form-item>
            <el-form-item label="启用状态">
              <el-select v-model="formData.ruleStatus" placeholder="请选择" class="uniform-input">
                <el-option label="开启" value="1" />
                <el-option label="关闭" value="0" />
                <el-option label="大数据开启" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="规则层级">
              <el-select v-model="formData.ruleGroup" placeholder="请选择" class="uniform-input">
                <el-option label="债项" value="0" />
                <el-option label="借据" value="3" />
                <el-option label="出账" value="1" />
                <el-option label="客户" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否补录">
              <el-select v-model="formData.agendaFlag" placeholder="请选择" class="uniform-input">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="预警等级">
              <el-select v-model="formData.warnLevel" placeholder="请选择" class="uniform-input">
                <el-option label="红色预警" value="2" />
                <el-option label="橙色预警" value="1" />
                <el-option label="黄色预警" value="0" />
                <el-option label="提醒预警" value="3" />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <!-- 规则详情区域 -->
        <div class="form-section">
          <div class="section-title">
            <span class="section-icon"></span>
            规则详情
          </div>
          <div class="form-grid">
            <el-form-item label="规则描述" class="full-width">
              <el-input v-model="formData.ruleDescrib" placeholder="请输入规则描述" type="textarea" :rows="3" class="uniform-input" />
            </el-form-item>
            <el-form-item label="是否启用规则前置">
              <el-select v-model="formData.isScript" placeholder="请选择" class="uniform-input">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="规则前置文本" v-if="formData.isScript === '1'" class="full-width">
              <el-input v-model="formData.scriptText" type="textarea" :rows="3" placeholder="请输入规则前置文本" class="uniform-input" />
            </el-form-item>
            <el-form-item label="数据集" class="full-width">
              <el-input v-model="formData.sqlData" type="textarea" :rows="3" placeholder="请输入数据集" class="uniform-input" />
            </el-form-item>
            <el-form-item label="规则表达式" class="full-width">
              <el-input v-model="formData.ruleExpression" placeholder="请输入规则表达式" class="uniform-input" />
            </el-form-item>
          </div>
        </div>

        <!-- 变量列表 -->
        <div class="form-section" v-if="!ruleAdd || formData.id">
          <div class="section-title">
            <span class="section-icon"></span>
            变量配置
          </div>
          <variableList ref="variableListRef" :ruleId="ruleAdd ? undefined : formData.id" />
        </div>

        <!-- 底部按钮 -->
        <div class="form-footer">
          <el-button type="primary" @click="ruleAdd ? handleSubmit : submitEdit" :loading="submitLoading" class="submit-btn">
            {{ ruleAdd ? '保存' : '修改' }}
          </el-button>
          <el-button @click="() => router.push('/indebtRule/indebtRuleList')" class="cancel-btn">
            返回
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import variableList from './components/variableList/index.vue'
import * as Api from './api.js'

const crRuleEdit = (data: any) => {
  return Promise.resolve({ success: true, message: '修改成功' })
}

const queryVarAndContant = (data: any) => {
  return Promise.resolve({
    result: {
      crRuleVarConsts: [
        {
          id: 'RV001',
          ruleId: data.ruleId || 'R001',
          variablesId: 'V001',
          variablesName: '合同剩余可用金额',
          variablesKey: 'contractAvailableAmount',
          argType: 'V'
        },
        {
          id: 'RV002',
          ruleId: data.ruleId || 'R001',
          variablesId: 'V002',
          variablesName: '当前库存数量',
          variablesKey: 'inventoryQuantity',
          argType: 'V'
        },
        {
          id: 'RV003',
          ruleId: data.ruleId || 'R001',
          variablesId: 'V003',
          variablesName: '最新市场单价',
          variablesKey: 'latestMarketPrice',
          argType: 'V'
        }
      ],
      crDtRelaReqList: []
    }
  })
}

// Router
const router = useRouter()
const route = useRoute()

// Form ref
const formRef = ref<FormInstance>()

// Emits
const emit = defineEmits<{
  ok: []
}>()

// 页面模式
const ruleAdd = ref(true)
const ruleEdit = ref(false)

// 提交加载状态
const submitLoading = ref(false)

// 表单数据
const formData = reactive({
  id: '',
  ruleName: '',
  ruleType: 'A',
  isAutoClear: '0',
  bizModel: 'YS',
  decisionStep: '',
  ruleStatus: '0',
  ruleGroup: '0',
  agendaFlag: '0',
  warnLevel: '2',
  ruleDescrib: '',
  isScript: '0',
  scriptText: '',
  sqlData: '',
  ruleExpression: ''
})

// 债项信息、因子、常量数据
const crDtRelaReqList = ref<any[]>([])
const selectedVariable = ref<any[]>([])
const selectedContant = ref<any[]>([])
const diUpdateData = ref<any[]>([])
const svUpdateData = ref<any[]>([])
const scUpdateData = ref<any[]>([])
const debtInfoList = ref<any[]>([])

// 子组件数据传递处理
const dfTransData = (data: any) => {
  crDtRelaReqList.value = data.crDtRelaList
}

const dfupTransData = (data: any) => {
  crDtRelaReqList.value = data.crDtRelaList
}

const svTransData = (data: any) => {
  selectedVariable.value = data
}

const scTransData = (data: any) => {
  selectedContant.value = data
}

const onChangeRadio = () => {
  // 单选框选项发生改变时触发
}

const variableListRef = ref<any>()

// 提交处理 - 新增
const handleSubmit = async (e: Event) => {
  e?.preventDefault()

  submitLoading.value = true

  try {
    const processedVariable = variableListRef.value?.list?.map((item: any) => ({
      ...item,
      variablesId: item.id,
      argType: 'V'
    })) || []

    const processedContant = selectedContant.value.map((item: any) => ({
      ...item,
      constantId: item.id,
      argType: 'C'
    }))

    const data = {
      crDtRelaReqList: crDtRelaReqList.value,
      crRule: {
        ruleClassify: 0,
        id: formData.id,
        ruleType: formData.ruleType,
        type: formData.ruleType,
        isAutoClear: formData.isAutoClear,
        decisionStep: formData.decisionStep,
        bizModel: formData.bizModel,
        ruleStatus: formData.ruleStatus,
        ruleGroup: formData.ruleGroup,
        ruleDescrib: formData.ruleDescrib,
        ruleExpression: formData.ruleExpression,
        warnLevel: formData.warnLevel,
        agendaFlag: formData.agendaFlag,
        ruleName: formData.ruleName,
        isScript: formData.isScript,
        scriptText: formData.scriptText,
        sqlData: formData.sqlData
      },
      crRuleVarConstList: [...processedVariable, ...processedContant]
    }

    await Api.crRuleAdd(data)
    ElMessage.success('保存成功')
    emit('ok')
    router.push('/indebtRule/indebtRuleList')
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  } finally {
    submitLoading.value = false
  }
}

// 提交处理 - 编辑
const submitEdit = async (e: Event) => {
  e?.preventDefault()

  submitLoading.value = true

  try {
    const processedVariable = variableListRef.value?.list?.map((item: any) => ({
      ...item,
      variablesId: item.id,
      argType: 'V'
    })) || []

    const processedContant = selectedContant.value.map((item: any) => ({
      ...item,
      constantId: item.id,
      argType: 'C'
    }))

    if (diUpdateData.value.length > 0) {
      crDtRelaReqList.value[0].id = diUpdateData.value[0].id
    }

    const data = {
      crDtRelaReqList: crDtRelaReqList.value,
      crRule: {
        ruleType: formData.ruleType,
        isAutoClear: formData.isAutoClear,
        id: formData.id,
        decisionStep: formData.decisionStep,
        bizModel: formData.bizModel,
        ruleStatus: formData.ruleStatus,
        ruleGroup: formData.ruleGroup,
        warnLevel: formData.warnLevel,
        ruleDescrib: formData.ruleDescrib,
        ruleExpression: formData.ruleExpression,
        agendaFlag: formData.agendaFlag,
        ruleName: formData.ruleName,
        isScript: formData.isScript,
        scriptText: formData.scriptText,
        sqlData: formData.sqlData
      },
      crRuleVarConstList: [...processedVariable, ...processedContant]
    }

    await Api.crRuleEdit(data)
    ElMessage.success('保存成功')
    emit('ok')
    router.push('/indebtRule/indebtRuleList')
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

// 生命周期 - 初始化
const init = () => {
  const params = route.query as any

  ruleAdd.value = params.ruleAdd === true || params.ruleAdd === 'true'
  ruleEdit.value = params.ruleEdit === true || params.ruleEdit === 'true'

  if (ruleEdit.value) {
    Object.assign(formData, params)
    formData.warnLevel = (params.warnLevel ?? '') + ''

    // 根据id查询规则数据
    if (params.id) {
      queryVarAndContant({ ruleId: params.id }).then((res: any) => {
        const result = res.result

        // 选择的债项因子集
        const seletedVarList = result.crRuleVarConsts.filter((item: any) => {
          return item.argType === 'V'
        })
        const seletedVarListdelId = seletedVarList.map((item: any) => {
          const { id, ...rest } = item
          return { ...rest }
        })
        selectedVariable.value = [...seletedVarListdelId]
        svUpdateData.value = [...seletedVarListdelId]

        // 选择的常量集
        const selectedContantList = result.crRuleVarConsts.filter((item: any) => {
          return item.argType === 'C'
        })
        const selectedContantListDelId = selectedContantList.map((item: any) => {
          const { id, ...rest } = item
          return { ...rest }
        })
        selectedContant.value = [...selectedContantListDelId]
        scUpdateData.value = [...selectedContantListDelId]

        // 债项信息
        diUpdateData.value = result.crDtRelaReqList
        crDtRelaReqList.value = result.crDtRelaReqList
      })
    }
  }
}

// 初始化
init()
</script>

<style scoped lang="scss">
.rule-add {
  margin: 10px 10px 0 0;
  background: #f5f7fa;
  min-height: 100vh;
  padding: 20px;

  .rule-add-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    padding: 30px;
  }

  .page-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
  }

  .title {
    position: relative;
    padding: 0 0 0 12px;
    font-size: 20px;
    font-weight: 600;
    color: #303133;

    .title-icon {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }
  }

  // 表单区域
  .rule-form {
    // 表单区块
    .form-section {
      margin-bottom: 28px;
      padding: 24px;
      background: #fafbfc;
      border-radius: 6px;
      border: 1px solid #e4e7ed;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    // 区块标题
    .section-title {
      position: relative;
      padding: 0 0 16px 12px;
      margin-bottom: 20px;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      border-bottom: 1px dashed #e4e7ed;

      .section-icon {
        position: absolute;
        left: 0;
        top: 2px;
        width: 3px;
        height: 16px;
        // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px;
      }
    }

    // 表单网格布局
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px 24px;

      .full-width {
        grid-column: 1 / -1;
      }
    }

    // 统一输入框样式
    :deep(.uniform-input) {
      width: 100% !important;
      max-width: 100% !important;
    }

    // 表单项
    :deep(.el-form-item) {
      margin-bottom: 16px;

      .el-form-item__label {
        font-size: 14px;
        color: #606266;
      }
    }

    // 自定义单选框组
    :deep(.custom-radio-group) {
      .el-radio-button {
        margin-right: 8px;
        
        .el-radio-button__inner {
          padding: 8px 16px;
          border-radius: 4px;
          transition: all 0.3s ease;
          
          &:hover {
            color: #667eea;
            border-color: #667eea;
          }
        }
        
        &.is-active {
          .el-radio-button__inner {
            // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-color: #667eea;
            color: #fff;
          }
        }
      }
    }

    // 底部按钮
    .form-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      padding: 24px 0 0;
      margin-top: 24px;
      border-top: 1px solid #ebeef5;

      .submit-btn,
      .cancel-btn {
        min-width: 100px;
        height: 36px;
        font-size: 14px;
        border-radius: 6px;
        transition: all 0.3s ease;
      }

      .submit-btn {
        // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
        
        &:active {
          transform: translateY(0);
        }
      }

      .cancel-btn {
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        
        &:hover {
          border-color: #667eea;
          color: #667eea;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .rule-add {
    .rule-add-content {
      padding: 20px;
    }

    .rule-form {
      .form-grid {
        grid-template-columns: 1fr !important;
      }
    }
  }
}
</style>
