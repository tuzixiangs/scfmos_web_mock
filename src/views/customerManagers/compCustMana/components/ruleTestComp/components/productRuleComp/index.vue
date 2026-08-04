<template>
  <div class="product-rule-comp">
    <el-collapse v-model="activeNames" expand-icon-position="left" @change="collapseChange">
      <el-collapse-item :title="prod.title" :name="prod.id" v-for="prod in productList" :key="prod">
        <template #title>
          <div class="collapse-title">
            <div class="flex items-center gap-10px">
              <span>
                {{ prod.title }}
              </span>
              <!-- <el-button class="ml-10px" size="small" @click.stop="productPreSelect">商品类预选</el-button>
              <strong> 预选商品：商品大类：螺丝、钢材、铝材</strong> -->
            </div>

            <div class="collapse-title-2" @click.stop>
              <div class="collapse-item" v-show="prod.isDebtManagement">
                <span class="item-label">债项管理方式：</span>
                <el-radio-group v-model="prod.model">
                  <el-radio-button value="1">线上</el-radio-button>
                  <el-radio-button value="2">线下</el-radio-button>
                </el-radio-group>
              </div>
              <div class="collapse-item">
                <span class="item-label">债项管理认定：</span>
                <el-switch v-model="prod.isDebtManagement" @change="isDebtManagementChange(prod)" />
              </div>

              <!-- <div class="collapse-item">
                <span class="item-label">类型：</span>
                <el-radio-group v-model="prod.type">
                  <el-radio value="1">单笔</el-radio>
                  <el-radio value="2">池</el-radio>
                </el-radio-group>
              </div> -->
            </div>
          </div>
        </template>

        <div class="ml-30px">
          <div v-animateShow="prod.isDebtManagement && prod.model == 1">
            <selComClassComp ref="selComClassCompRef" @add="addComClass" />

            <el-card class="mt-20px">
              <template #header>
                <div class="flex justify-between">
                  <span class="card-header">八项纪律</span>
                  <div>
                    <el-button v-show="!prod.show8" type="primary" link :icon="ArrowDown" @click="prod.show8 = true">展开</el-button>
                    <el-button v-show="prod.show8" type="primary" link :icon="ArrowUp" @click="prod.show8 = false">收起</el-button>
                  </div>
                </div>
              </template>
              <div v-animateShow="prod.show8">
                <commonTable
                  :title="stage.title"
                  v-for="stage in prod.precessStageList"
                  :key="stage.title"
                  @settingClick="emit('settingClick')"
                />
              </div>
              <div v-show="!prod.show8" style="text-align: center; color: #acacac;">
                ---=== 内容已折叠 ===---
              </div>
            </el-card>

            <el-card class="mt-20px">
              <template #header>
                <span class="card-header">价衰配置</span>
              </template>
              <devalueSettingComp />
            </el-card>
          </div>
          <div v-show="!prod.isDebtManagement || prod.model != 1">
            <span>线下债项登记说明：</span>
            <el-input
              class="mt-10px"
              type="textarea"
              placeholder="请输入线下债项登记说明"
              maxlength="1000"
              show-word-limit
              rows="5"
            ></el-input>
            <UploadFile class="mt-10px" :limit="1" />
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <selectCommodityComp ref="selectCommodityCompRef" />
    <!-- <selCompClassPop -->
  </div>
</template>

<script setup>
import commonTable from './commonTable.vue'
import selectCommodityComp from '../commonComp/selectCommodity/index.vue'
import devalueSettingComp from '../devalueSettingComp/index.vue'
import selComClassComp from './components/selComClass/index.vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

const props = defineProps({})

const emit = defineEmits(['settingClick'])

const _precessStageList = [
  { title: '方案配置' },
  { title: '金额核定' },
  { title: '发货管理' },
  { title: '货值管理' },
  { title: '提货管理' },
  { title: '巡库管理' }
]

const productList = reactive([
  { title: '产品方案1', id: 1, precessStageList: [], show8: true, isDebtManagement: false, type: '' },
  { title: '产品方案2', id: 2, precessStageList: [], show8: true, isDebtManagement: false, type: '' },
  { title: '产品方案3', id: 3, precessStageList: [], show8: true, isDebtManagement: false, type: '' },
  { title: '产品方案4', id: 4, precessStageList: [], show8: true, isDebtManagement: false, type: '' }
])

const activeNames = ref([])

const collapseChange = (val) => {
  productList.forEach((v) => {
    if (val.includes(v.id)) {
      renderStageList(v)
    }
  })
}

const isDebtManagementChange = (prod) => {
  if (!activeNames.value.includes(prod.id)) {
    activeNames.value.push(prod.id)
    collapseChange(activeNames.value)
  }
}

const renderStageList = async (list) => {
  if (list.precessStageList.length > 0) return

  for (let i = 0; i < _precessStageList.length; i++) {
    list.precessStageList.push(_precessStageList[i])
    await nextTick()
    await new Promise((res) => setTimeout(res, 0))
  }
}

const selectCommodityCompRef = ref()
const productPreSelect = () => {
  selectCommodityCompRef.value.open()
}

onMounted(async () => {
  await nextTick()
  activeNames.value = [productList[0]?.id]
  collapseChange(activeNames.value)
})
</script>

<style lang="scss" scoped>
.product-rule-comp {
  :deep(.el-collapse) {
    border: 1px solid #ccc;
    border-radius: 4px;
    border-right: unset;
    overflow: hidden;

    .collapse-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &-2 {
        display: flex;
        gap: 25px;
        align-items: center;
      }

      .collapse-item {
        display: flex;
        align-items: center;
        gap: 8px;

        .item-label {
          font-size: 14px;
          color: #606266;
          white-space: nowrap;
        }
      }
    }

    .el-collapse-item__header {
      min-height: 40px;
      height: 40px;
      padding-left: 10px;
    }
  }

  :deep(.el-collapse-item__title) {
    font-weight: bold;
  }
}
</style>
