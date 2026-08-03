<template>
  <ContentWrap>
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-row>

        <el-col :span="12">
          <el-form-item label="申报方式" prop="appType">
            <el-select v-model="formData.appType" placeholder="请选择" class="w-1/1">
              <el-option
                v-for="item in appTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生方式" prop="occurrenceType">
            <el-select v-model="formData.occurrenceType" @change="handleOccurrenceType" placeholder="请选择发生类型" class="w-1/1">
              <el-option
                v-for="item in occurrenceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"

              />
            </el-select>
          </el-form-item>
        </el-col>
       
        
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户类型" prop="customerType">
            <el-select v-model="formData.customerType" placeholder="请选择客户类型" class="w-1/1">
              <el-option
                v-for="item in customerTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="核心企业编号" prop="customerNo">
            <el-input
              v-model="formData.customerNo"
              placeholder="请点击选择客户"
              readonly
              @click="openCustomerDialog"
            >
              <template #append>
                <el-button @click="openCustomerDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
       
      </el-row>
      <!-- 续作业务选择（仅当发生类型为"续作"时显示） -->
     <el-row v-if="formData.occurrenceType === '084'">
        <el-col :span="12">
          <el-form-item label="续作业务" prop="relativeContract" required>
            <el-input
              v-model="formData.relativeContract"
              placeholder="请点击选择续作业务"
              readonly
              @click="openRenewalBusinessDialog"
            >
              <template #append>
                <el-button @click="openRenewalBusinessDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
       
      </el-row> 
      <!-- 复议业务选择（仅当发生类型为"复议"时显示） -->
      <!-- <el-row v-if="formData.occurrenceType === '088'">
        <el-col :span="12">
          <el-form-item label="复议业务" prop="reconsiderBusiness" required>
            <el-input
              v-model="formData.reconsiderBusiness"
              placeholder="请点击选择复议业务"
              readonly
              @click="openReconsiderBusinessDialog"
            >
              <template #append>
                <el-button @click="openReconsiderBusinessDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
       
      </el-row> -->
      <!-- 关联展期业务选择（仅当发生类型为"展期"时显示） -->
      <!-- <el-row v-if="formData.occurrenceType === '095'">
        <el-col :span="12">
          <el-form-item label="关联展期业务" prop="extensionBusiness" required>
            <el-input
              v-model="formData.extensionBusiness"
              placeholder="请点击选择关联展期业务"
              readonly
              @click="openExtensionBusinessDialog"
            >
              <template #append>
                <el-button @click="openExtensionBusinessDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        
      </el-row> -->

       <!-- 提额业务选择（仅当发生类型为"提额"时显示） -->
       <el-row v-if="formData.occurrenceType === '098'">
        <!-- <el-col :span="12">
          <el-form-item label="提额业务" prop="extensionBusiness" required>
            <el-input
              v-model="formData.tieyw"
              placeholder="请点击选择提额业务"
              readonly
              @click="openTieDialog"
            >
              <template #append>
                <el-button @click="openTieDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col> -->
        <!-- <el-col :span="12">
          <el-form-item label="业务编号" prop="extensionBusinessNo">
            <el-input
              v-model="formData.extensionBusinessNo"
              placeholder="请先选择关联展期业务"
              readonly
            />
          </el-form-item>
        </el-col> -->
      </el-row>
      <!-- 业务品种（展期时不显示） -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="核心企业名称" prop="customerName">
            <el-input v-model="formData.customerName" placeholder="请先选择客户编号" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.occurrenceType !== '095' ">
          <el-form-item label="业务品种" prop="businessType">
            <el-input
              v-model="formData.businessType"
              placeholder="请先选择客户"
              readonly
            >
            <template #append>
                <el-button @click="openBusinessTypeDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
       
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发生日期" prop="occurrenceDate">
            <el-date-picker
              v-model="formData.occurrenceDate"
              type="date"
              disabled
              value-format="YYYY-MM-DD"
              placeholder="选择发生日期"
              class="w-1/1"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item  label="供应链项目" prop="relaTeamWork">
            <el-input
              v-model="formData.projectName"
              placeholder="请点击供应链项目"
              readonly
              @click="openRelaTeamWorkDialog"
            >
              <template #append>
                <el-button @click="openRelaTeamWorkDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

     <!-- <el-row v-if="formData.businessTypeNo == '3005' && formData.occurrenceType == '080'">
        <el-col :span="12">
          <el-form-item label="关联白名单编号 " prop="relativeWhiteListNo">
            <el-input v-model="formData.relativeWhiteListNo">
              <template #append>
                <el-button @click="openRelativeWhiteListNoDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关联群授信 " prop="relativeGYLED">
            <el-input v-model="formData.relativeGYLED" >
              <template #append>
                <el-button @click="openRelativeGYLEDDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <!-- 操作按钮 -->
    <div class="flex justify-end gap-10px mt-20px">
      <el-button :loading="formLoading" tpye="" @click="submitForm">提 交</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </ContentWrap>

  <!-- 客户选择对话框 -->
  <Dialog v-model="customerDialogVisible" title="选择客户" width="800px">
    <!-- 搜索栏 -->
    <el-form
      ref="customerQueryFormRef"
      :inline="true"
      :model="customerQueryParams"
      label-width="68px"
    >
      <el-form-item label="客户编号" prop="customerNo">
        <el-input
          v-model="customerQueryParams.customerID"
          class="!w-240px"
          clearable
          placeholder="请输入客户编号"
          @keyup.enter="getCustomerList"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="customerQueryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
          @keyup.enter="getCustomerList"
        />
      </el-form-item>
      <el-form-item label="证件编号" prop="certId">
        <el-input
          v-model="customerQueryParams.certId"
          class="!w-240px"
          clearable
          placeholder="请输入证件编号"
          @keyup.enter="getCustomerList"
        />
      </el-form-item>
      <el-form-item label="证件类型" prop="certTypeName">
        <el-input
          v-model="customerQueryParams.certTypeName"
          class="!w-240px"
          clearable
          placeholder="请输入证件类型"
          @keyup.enter="getCustomerList"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getCustomerList">查询</el-button>
        <el-button @click="resetCustomerQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      v-loading="customerLoading"
      :data="customerList"
      height="300px"
      highlight-current-row
      @row-click="handleCustomerRowClick"
    >
      <el-table-column label="客户编号" prop="customerID" min-width="180" />
      <el-table-column label="客户名称" prop="customerName" min-width="200" />
      <el-table-column label="客户类型" prop="customerType" width="120" />
      <el-table-column label="证件号码" prop="phone" min-width="180" />
      <el-table-column label="证件类型" prop="address" min-width="200" show-overflow-tooltip />
    </el-table>
    <!-- 分页 -->
    <div class="bank-pagination">
      <Pagination
        v-model:limit="customerQueryParams.pageSize"
        v-model:page="customerQueryParams.pageNo"
        :total="customerQueryTotal"
        @pagination="getCustomerList"
      />
    </div>
  </Dialog>

   <!-- 合作项目对话 -->
  <Dialog v-model="relaTeamWorkVisible" title="选择客户" width="800px">
    <!-- 搜索栏 -->
    <el-form
      ref="relaTeamWorkFormRef"
      :inline="true"
      :model="relaTeamWorkParams"
      label-width="108px"
    >
      <el-form-item label="供应链项目" prop="projectName">
        <el-input
          v-model="relaTeamWorkParams.projectName"
          class="!w-240px"
          clearable
          placeholder="请输入供应链项目编号/项目"
          @keyup.enter="getRelaTeamWorkList"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getRelaTeamWorkList">查询</el-button>
        <el-button @click="resetRelaTeamWorkQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      v-loading="relaTeamWorkLoading"
      :data="relaTeamWorkList"
      height="300px"
      highlight-current-row
      @row-click="handleRelaTeamWorkRowClick"
    >
      <el-table-column label="供应链项目编号" prop="projectID" min-width="180" />
      <el-table-column label="供应链项目名称" prop="projectName" min-width="200" />
    </el-table>
    <!-- 分页 -->
    <div class="bank-pagination">
      <Pagination
        v-model:limit="relaTeamWorkParams.pageSize"
        v-model:page="relaTeamWorkParams.pageNo"
        :total="relaTeamWorkTotal"
        @pagination="getRelaTeamWorkList"
      />
    </div>
  </Dialog>

  <!-- 业务品种选择对话框 -->
  <Dialog v-model="businessTypeDialogVisible" :close-on-click-modal="false" title="选择业务品种" width="600px">
    <div v-loading="businessTypeLoading"
    >
      <el-tree
        ref="businessTypeTreeRef"
        :data="businessTypeTreeData"
        :props="treeProps"
        :default-expand-all="true"
        highlight-current
        node-key="typeNo"
        @node-click="handleBusinessTypeNodeClick"
      />
    </div>
  </Dialog>

  <!-- 复议业务选择对话框 -->
  <Dialog v-model="reconsiderBusinessDialogVisible" title="选择复议业务" width="800px">
    <!-- 搜索栏 -->
    <el-form
      ref="reconsiderQueryFormRef"
      :inline="true"
      :model="reconsiderQueryParams"
      label-width="90px"
    >
      <el-form-item label="业务编号" prop="businessNo">
        <el-input
          v-model="reconsiderQueryParams.businessNo"
          class="!w-200px"
          clearable
          placeholder="请输入业务编号"
          @keyup.enter="getReconsiderBusinessList"
        />
      </el-form-item>
      <el-form-item label="业务名称" prop="businessName">
        <el-input
          v-model="reconsiderQueryParams.businessName"
          class="!w-200px"
          clearable
          placeholder="请输入业务名称"
          @keyup.enter="getReconsiderBusinessList"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getReconsiderBusinessList">查询</el-button>
        <el-button @click="resetReconsiderQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      v-loading="reconsiderLoading"
      :data="reconsiderBusinessList"
      height="300px"
      highlight-current-row
      @row-click="handleReconsiderBusinessRowClick"
    >
      <el-table-column label="业务编号" prop="businessNo" min-width="150" />
      <el-table-column label="业务名称" prop="businessName" min-width="200" />
      <el-table-column label="业务类型" prop="businessType" width="120" />
      <el-table-column label="申请金额" prop="amount" width="120" />
      <el-table-column label="申请日期" prop="applyDate" width="120" />
    </el-table>
  </Dialog>

  <!-- 关联展期业务选择对话框 -->
  <Dialog v-model="extensionBusinessDialogVisible" title="选择关联展期业务" width="800px">
    <!-- 搜索栏 -->
    <el-form
      ref="extensionQueryFormRef"
      :inline="true"
      :model="extensionQueryParams"
      label-width="80px"
    >
      <el-form-item label="业务编号" prop="businessNo">
        <el-input
          v-model="extensionQueryParams.businessNo"
          class="!w-200px"
          clearable
          placeholder="请输入业务编号"
          @keyup.enter="getExtensionBusinessList"
        />
      </el-form-item>
      <el-form-item label="业务名称" prop="businessName">
        <el-input
          v-model="extensionQueryParams.businessName"
          class="!w-200px"
          clearable
          placeholder="请输入业务名称"
          @keyup.enter="getExtensionBusinessList"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getExtensionBusinessList">查询</el-button>
        <el-button @click="resetExtensionQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      v-loading="extensionLoading"
      :data="extensionBusinessList"
      height="300px"
      highlight-current-row
      @row-click="handleExtensionBusinessRowClick"
    >
      <el-table-column label="业务编号" prop="businessNo" min-width="150" />
      <el-table-column label="业务名称" prop="businessName" min-width="200" />
      <el-table-column label="业务类型" prop="businessType" width="120" />
      <el-table-column label="申请金额" prop="amount" width="120" />
      <el-table-column label="到期日期" prop="maturityDate" width="120" />
    </el-table>
  </Dialog>

  <!-- 续作业务选择对话框 -->
  <Dialog v-model="renewalBusinessDialogVisible" title="选择续作业务" width="800px">
    <!-- 搜索栏 -->
    <el-form
      ref="renewalQueryFormRef"
      :inline="true"
      :model="renewalQueryParams"
      label-width="90px"
    >
      <el-form-item label="合同流水号" prop="serialNo">
        <el-input
          v-model="renewalQueryParams.serialNo"
          class="!w-200px"
          clearable
          placeholder="请输入合同流水号"
          @keyup.enter="getRenewalBusinessList"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="renewalQueryParams.customerName"
          class="!w-200px"
          clearable
          placeholder="请输入客户名称"
          @keyup.enter="getRenewalBusinessList"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getRenewalBusinessList">查询</el-button>
        <el-button @click="resetRenewalQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      v-loading="renewalLoading"
      :data="renewalBusinessList"
      height="300px"
      highlight-current-row
      @row-click="handleRenewalBusinessRowClick"
    >
      <el-table-column label="合同流水号" prop="serialNo" min-width="150" />
      <el-table-column label="业务品种" prop="businessTypeName" min-width="200" />
      <el-table-column label="客户名称" prop="customerName" width="120" />
      <el-table-column label="额度金额" prop="businessSum" width="120" />
      <el-table-column label="敞口金额" prop="exposureSum" width="120" />
    </el-table>
  </Dialog>

  <!-- 提额业务选择对话框 -->
  <Dialog v-model="tieBusinessDialogVisible" title="选择提额业务" width="880px">
    <!-- 搜索栏 -->
    <el-form
      ref="tieQueryFormRef"
      :inline="true"
      :model="tieQueryParams"
      label-width="80px"
    >
      <el-form-item label="合同流水号" prop="serialNo">
        <el-input
          v-model="tieQueryParams.serialNo"
          class="!w-200px"
          clearable
          placeholder="合同流水号"
          @keyup.enter="getTieYwList"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="businessName">
        <el-input
          v-model="tieQueryParams.customerName"
          class="!w-200px"
          clearable
          placeholder="客户名称"
          @keyup.enter="getTieYwList"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="tieBusinessList">查询</el-button>
        <el-button @click="resetTieQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      v-loading="tieLoading"
      :data="tieBusinessList"
      height="300px"
      highlight-current-row
      @row-click="handleTieBusinessRowClick"
    >
      <el-table-column label="合同流水号" prop="serialNo" min-width="150" />
      <el-table-column label="业务品种" prop="businessTypeName" min-width="200" />
      <el-table-column label="客户名称" prop="customerName" width="120" />
      <el-table-column label="额度金额" prop="businessSum" width="120" />
      <el-table-column label="敞口金额 " prop="exposureSum" width="120" />
    </el-table>
  </Dialog>

<!-- 关联白名单选择对话框 -->
  <Dialog v-model="relativeWhiteListNoDialogVisible" title="选择关联白名单" width="950px">
    <!-- 搜索栏 -->
    <el-form
      ref="relativeWhiteListNoFormRef"
      :inline="true"
      :model="relativeWhiteListNoParams"
      label-width="160px"
    >
      <el-form-item label="申请流水号" prop="serialno">
        <el-input
          v-model="relativeWhiteListNoParams.serialno"
          class="!w-200px"
          clearable
          placeholder="请输入申请流水号"
          @keyup.enter="getrelativeWhiteList"
        />
      </el-form-item>
      <el-form-item label="供应链合作项目名称" prop="projectname">
        <el-input
          v-model="relativeWhiteListNoParams.projectname"
          class="!w-200px"
          clearable
          placeholder="请输入业务名称"
          @keyup.enter="getrelativeWhiteList"
        />
      </el-form-item>
      <el-form-item label="借款人编号" prop="borrowerid">
        <el-input
          v-model="relativeWhiteListNoParams.borrowerid"
          class="!w-200px"
          clearable
          placeholder="请输入借款人编号"
          @keyup.enter="getrelativeWhiteList"
        />
      </el-form-item>
      <el-form-item label="借款人名称" prop="borrowername">
        <el-input
          v-model="relativeWhiteListNoParams.borrowername"
          class="!w-200px"
          clearable
          placeholder="请输入借款人名称"
          @keyup.enter="getrelativeWhiteList"
        />
      </el-form-item>
      <el-form-item label="证件号码" prop="certid">
        <el-input
          v-model="relativeWhiteListNoParams.certid"
          class="!w-200px"
          clearable
          placeholder="请输入证件号码"
          @keyup.enter="getrelativeWhiteList"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getrelativeWhiteList">查询</el-button>
        <el-button @click="resetRelativeWhiteListNQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <el-table
      v-loading="relativeWhiteListNoLoading"
      :data="relativeWhiteListNoBusinessList"
      height="300px"
      highlight-current-row
      @row-click="handleRelativeWhiteListNoRowClick"
    >
      <el-table-column label="申请流水号" prop="serialno" min-width="180" />
      <el-table-column label="供应链合作项目名称" prop="projectname" min-width="200" />
      <el-table-column label="债项/产品方案" prop="productname" width="120" />
      <el-table-column label="借款人编号 " prop="borrowerid" width="160" />
      <el-table-column label="借款人名称 " prop="borrowername" width="120" />
      <el-table-column label="证件号码 " prop="certid" width="180" /> 
    </el-table>

     <!-- 分页 -->
     <div class="bank-pagination" >
      <Paginatio
        v-model:limit="relativeWhiteListNoParams.pageSize"
        v-model:page="relativeWhiteListNoParams.pageNo"
        :total="relativeWhiteListTotal"
        @pagination="getrelativeWhiteList"
      />
      </div>
  </Dialog>
<!-- 关联群授信择对话框 -->
<Dialog v-model="relatedGroupCreditVisible" title="关联群授信" width="950px">
 <!-- 搜索栏 -->
 <el-form
      ref="relatedGroupCreditFormRef"
      :inline="true"
      :model="relatedGroupCreditParams"
      label-width="160px"
    >
      <el-form-item label="合同流水号" prop="serialNo">
        <el-input
          v-model="relatedGroupCreditParams.serialNo"
          class="!w-200px"
          clearable
          placeholder="请输入合同流水号"
          @keyup.enter="getRelativeGYLEDList"
        />
      </el-form-item>
    
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="relatedGroupCreditParams.customerName"
          class="!w-200px"
          clearable
          placeholder="请输入客户名称"
          @keyup.enter="getRelativeGYLEDList"
        />
      </el-form-item>
    
      <el-form-item>
        <el-button @click="getRelativeGYLEDList">查询</el-button>
        <el-button @click="resetRelativeGYLEDListNQuery">重置</el-button>
      </el-form-item>
    </el-form>


    <!-- 列表 -->
    <el-table
      v-loading="relatedGroupCreditLoading"
      :data="relatedGroupCreditList"
      height="300px"
      highlight-current-row
      @row-click="handlerelatedGroupCreditClick"
    >
      <el-table-column label="申请流水号" prop="serialNo" min-width="180" />
      <el-table-column label="业务品种" prop="businessTypeName" min-width="200" />
      <el-table-column label="客户名称" prop="customerName" width="120" />
      <el-table-column label="合作方类型 " prop="typeName" width="160" />
      <el-table-column label="合作项目名称 " prop="projectName" width="120" />
      <el-table-column label="合同金额 " prop="businessSum" width="180" /> 
      <el-table-column label="敞口金额 " prop="exposureSum" width="180" /> 
      <el-table-column label="币种 " prop="currencyName" width="180" /> 
      <el-table-column label="起始日 " prop="putOutDate" width="180" /> 
      <el-table-column label="到期日 " prop="maturity" width="180" /> 
    </el-table>


    <div slot="footer" class="dialog-footer">
     <!-- 分页 -->
      <Pagination
        v-model:limit="relatedGroupCreditParams.pageSize"
        v-model:page="relatedGroupCreditParams.pageNo"
        :total="relativeGYLEDListTotal"
        @pagination="getRelativeGYLEDList"
      />
    </div>
</Dialog>


</template>

<script lang="ts" setup>
import { appTypeOptions,customerTypeOptions } from '../const'
import { applicationPenddingApi as penddingApi } from '@/api/creditapplication/pendding'
import { creditApplyJobApi } from "@/api/creditapplication/creditApplyJob"
import { useTagsViewStoreWithOut } from '@/store/modules/tagsView'
import {formatDate} from '@/utils/formatTime'
import { useUserStore } from '@/store/modules/user' 

defineOptions({ name: 'creditApplyJobCreate' })

const message = useMessage()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStoreWithOut()
const userStore = useUserStore()
console.log('userStore',userStore.getUser);

const props = defineProps({
  creditSourceFlag:String
})


// 发生类型选项（从接口加载）
const occurrenceTypeOptions = ref<Array<{ label: string; value: string }>>([])

// 加载发生类型选项
const loadOccurrenceTypeOptions = async () => {
  try {
    const res = await penddingApi.getOccurrenceTypeList({
      codeNo:'OccurType',
      applyType:'CreditLineApply'
    })
  console.log('res',res)
    if (res) {
      // 将接口返回的数据转换为选项格式
      occurrenceTypeOptions.value = res.map((item: any) => ({
        label: item.itemname,
        value: item.itemno
      }))
      console.log('发生类型选项加载成功:', occurrenceTypeOptions.value)
    }
  } catch (error) {
    console.error('加载发生类型失败:', error)
    message.error('加载发生类型失败')
  }
}

// 设置页签标题
onMounted(() => {
  const title = route.query.title as string
  if (title) {
    nextTick(() => {
      tagsViewStore.updateVisitedView({
        ...route,
        meta: {
          ...route.meta,
          title: title
        },
        title: title
      } as any)
    })
  }

  // 加载发生类型选项
  loadOccurrenceTypeOptions()
})

const formRef = ref()
const formLoading = ref(false)

// 客户选择对话框
const customerDialogVisible = ref(false)
const customerLoading = ref(false)
const customerQueryTotal =ref(0)
const customerQueryFormRef = ref()
const customerList = ref<any[]>([])
const customerQueryParams = reactive({
  customerID: undefined,
  customerName: undefined,
  pageNo: 1,
  pageSize: 10,
  certId:undefined,
  certTypeName:undefined
})

/** 打开客户选择对话框 */
const openCustomerDialog = () => {
  // 检查是否已选择客户类型
  if (!formData.value.customerType) {
    message.warning('请先选择客户类型')
    return
  }
  resetCustomerQuery();
  customerDialogVisible.value = true
  getCustomerList()
}

/** 获取客户列表 */
const getCustomerList = async () => {
  try {
    customerLoading.value = true
    const customerType = formData.value.customerType
    const fapi = customerType==='01' ? penddingApi.getCustomerList :  creditApplyJobApi.qryPeerCustomerPage
    // 调用接口获取客户列表
    const res = await fapi({
      customerID: customerQueryParams.customerID,
      customerName: customerQueryParams.customerName,
      pageNo: customerQueryParams.pageNo,
      pageSize: customerQueryParams.pageSize,
      certId:customerQueryParams.certId,
      certTypeName:customerQueryParams.certTypeName
    })

    if (res ) {
      // 将接口返回的数据格式转换为表格需要的格式
      customerList.value = (res.list || []).map((item: any) => ({
        customerID: item.customerID,
        customerName: item.customerName,
        customerType: item.customerTypeName,
        phone: item.certID, // 暂时用证件号显示在电话列
        address: item.certTypeName // 暂时用证件类型显示在地址列
      }))

      customerQueryTotal.value=res.total
    }
  } catch (error) {
    console.error('获取客户列表失败:', error)
    message.error('获取客户列表失败')
  } finally {
    customerLoading.value = false
  }
}

/** 重置客户查询 */
const resetCustomerQuery = () => {
  customerQueryFormRef.value?.resetFields()
  customerQueryParams.customerID = undefined
  customerQueryParams.customerName = undefined
  getCustomerList()
}

/** 点击客户行 */
const handleCustomerRowClick = async (row: any) => {
  formData.value.customerNo = row.customerID
  formData.value.customerName = row.customerName
  customerDialogVisible.value = false

  // 选择客户后，加载业务品种树
  await loadBusinessTypeTree()

  // 加载完成后，自动打开业务品种选择弹框
  nextTick(() => {
    if(formData.value.occurrenceType !== '098') {
      openBusinessTypeDialog()
    }
  })
}


// 合作项目对话框
const relaTeamWorkVisible = ref(false)
const relaTeamWorkLoading = ref(false)
const relaTeamWorkTotal =ref(0)
const relaTeamWorkFormRef = ref()
const relaTeamWorkList = ref<any[]>([])
const relaTeamWorkParams = reactive({
  customerID: undefined,
  projectName: undefined,
  pageNo: 1,
  pageSize: 10
})


/** 打开合作项目对话框 */

const openRelaTeamWorkDialog = () => {
  // 检查是否已选择客户类型
  if (!formData.value.customerType) {
    message.warning('请先选择客户类型')
    return
  }
  relaTeamWorkVisible.value = true
  getRelaTeamWorkList()
}



/** 获取客户列表 */
const getRelaTeamWorkList = async () => {
  try {
    customerLoading.value = true
    // const customerType = formData.value.customerType
    const fapi = creditApplyJobApi.qryCooperativeProjectPage 
    // 调用接口获取客户列表
    const res = await fapi({
      customerID:  formData.value.customerNo,
      projectName: relaTeamWorkParams.projectName,
      businessType:  formData.value.businessTypeNo,
      pageNo: relaTeamWorkParams.pageNo,
      pageSize: relaTeamWorkParams.pageSize
    })

    if (res ) {
      // 将接口返回的数据格式转换为表格需要的格式
      relaTeamWorkList.value = (res.list || []).map((item: any) => ({
        projectID:item.projectID,
        projectName: item.projectName,
      }))

      customerQueryTotal.value=res.total
    }
  } catch (error) {
    console.error('获取客户列表失败:', error)
  } finally {
    customerLoading.value = false
  }
}

/** 重置客户查询 */
const resetRelaTeamWorkQuery = () => {
  customerQueryFormRef.value?.resetFields()
  customerQueryParams.customerID = undefined
  relaTeamWorkParams.projectName = ''
  customerQueryParams.customerName = undefined
  getCustomerList()
}

/** 点击客户行 */
const handleRelaTeamWorkRowClick = async (row: any) => {
  formData.value.relaTeamWork = row.projectID
  formData.value.projectName = row.projectName
  relaTeamWorkVisible.value = false

}







// 业务品种选择对话框
const businessTypeDialogVisible = ref(false)
const businessTypeTreeRef = ref()
const businessTypeLoading = ref(false)
const treeProps = {
  children: 'children',
  label: 'typeName'
}

// 业务品种树形数据（从接口动态加载）
const businessTypeTreeData = ref<any[]>([])

// 加载业务品种树
const loadBusinessTypeTree = async () => {
  try {
    businessTypeLoading.value = true

    // 根据客户类型加载对应的业务品种树
    const res = await creditApplyJobApi.qryBusinessVarietyTree({
      customerType: formData.value.customerType || '01'
    })

    if (res) {
      businessTypeTreeData.value = res
      console.log('业务品种树加载成功，节点数量:', res.length)
    }
  } catch (error) {
    console.error('加载业务品种树失败:', error)
    message.error('加载业务品种树失败')
  } finally {
    businessTypeLoading.value = false
  }
}

/** 打开业务品种选择对话框 */
const openBusinessTypeDialog = () => {
  if (!formData.value.customerNo) {
    message.warning('请先选择客户')
    return
  }
  businessTypeDialogVisible.value = true
}

/** 点击业务品种树节点 */
const handleBusinessTypeNodeClick = (data: any) => {
  // 只允许选择叶子节点（没有子节点的节点）
  if (data.leaf === true || !data.children || data.children.length === 0) {
    formData.value.businessType = data.typeName
    formData.value.businessTypeNo = data.typeNo
    businessTypeDialogVisible.value = false

     toDogetGylxm()

  } else {
    message.info('请选择具体的业务品种')
  }
}


const toDogetGylxm = async ()=> {
  try {
    customerLoading.value = true
    // const customerType = formData.value.customerType
    const fapi = creditApplyJobApi.qryCooperativeProjectPage 
    // 调用接口获取客户列表
    const res = await fapi({
      customerID:  formData.value.customerNo,
      projectName: relaTeamWorkParams.projectName,
      businessType:  formData.value.businessTypeNo,
      pageNo: relaTeamWorkParams.pageNo,
      pageSize: relaTeamWorkParams.pageSize
    })

    if (res && res.list.length === 1) {

      // console.log('自动请求结果',res);

      handleRelaTeamWorkRowClick(res.list[0])
      
      // 将接口返回的数据格式转换为表格需要的格式
      // relaTeamWorkList.value = (res.list || []).map((item: any) => ({
      //   projectID:item.projectID,
      //   projectName: item.projectName,
      // }))

      // customerQueryTotal.value=res.total
    }else{
      formData.value.relaTeamWork = undefined
      formData.value.projectName = undefined
    }
  } catch (error) {
    console.error('获取客户列表失败:', error)
  } finally {
    customerLoading.value = false
  }
}

// 续作业务选择对话框
const renewalBusinessDialogVisible = ref(false)
const renewalLoading = ref(false)
const renewalQueryFormRef = ref()
const renewalBusinessList = ref<any[]>([])
const renewalQueryParams = reactive({
  serialNo: undefined,
  customerName: undefined
})



/** 打开续作业务选择对话框 */
const openRenewalBusinessDialog = () => {
  if (!formData.value.customerNo) {
    message.warning('请先选择客户')
    return
  }
  renewalBusinessDialogVisible.value = true
  getRenewalBusinessList()
}

/** 获取续作业务列表 */
const getRenewalBusinessList =async () => {
  renewalLoading.value = true
  console.log(' customerQueryParams.customerNo',formData.value.customerNo);
  
  // 模拟接口调用
  try {
    const res = await penddingApi.creditQrySequelBusinessPage({...renewalQueryParams,
      customerID: formData.value.customerNo,
      businessType: formData.value.businessTypeNo,
    })
  console.log('res',res)
    if (res&&res.list) {
      // 将接口返回的数据转换为选项格式
      renewalBusinessList.value = res.list
      renewalLoading.value = false
      console.log('续作加载成功:', occurrenceTypeOptions.value)
    }
  } catch (error) {
    console.error('续作加载成功失败:', error)
    message.error('续作加载成功失败')
  } 
  
}

/** 重置续作业务查询 */
const resetRenewalQuery = () => {
  renewalQueryFormRef.value?.resetFields()
  renewalQueryParams.serialNo = undefined
  renewalQueryParams.customerName = undefined
  getRenewalBusinessList()
}

/** 点击续作业务行 */
const handleRenewalBusinessRowClick = (row: any) => {
  formData.value.relativeContract = row.serialNo
  renewalBusinessDialogVisible.value = false
}

// 复议业务选择对话框
const reconsiderBusinessDialogVisible = ref(false)
const reconsiderLoading = ref(false)
const reconsiderQueryFormRef = ref()
const reconsiderBusinessList = ref<any[]>([])
const reconsiderQueryParams = reactive({
  businessNo: undefined,
  businessName: undefined
})


/** 打开复议业务选择对话框 */
const openReconsiderBusinessDialog = () => {
  if (!formData.value.customerNo) {
    message.warning('请先选择客户')
    return
  }
  reconsiderBusinessDialogVisible.value = true
  getReconsiderBusinessList()
}

/** 获取复议业务列表 */
const getReconsiderBusinessList = async () => {
  if(!formData.value.businessTypeNo) {
    message.warning('请先选择业务品种')
    return
  }

  reconsiderLoading.value = true
  // 模拟接口调用
  console.log(' customerQueryParams.customerNo',formData.value);
  try {
    const res = await penddingApi.qryReconsiderationBusinessPage({
      customerID: formData.value.customerNo,
      businessType: formData.value.businessTypeNo
    })
  console.log('res',res)
    if (res&&res.list) {
      // 将接口返回的数据转换为选项格式
      reconsiderBusinessList.value = res.list
      reconsiderLoading.value = false
      console.log('复议加载成功:', occurrenceTypeOptions.value)
    }
  } catch (error) {
    console.error('复议加载成功失败:', error)
    message.error('复议加载成功失败')
  } 

}

/** 重置复议业务查询 */
const resetReconsiderQuery = () => {
  reconsiderQueryFormRef.value?.resetFields()
  reconsiderQueryParams.businessNo = undefined
  reconsiderQueryParams.businessName = undefined
  getReconsiderBusinessList()
}

/** 点击复议业务行 */
const handleReconsiderBusinessRowClick = (row: any) => {
  formData.value.reconsiderBusiness = row.serialNo
  formData.value.reconsiderBusinessNo = row.businessNo
  reconsiderBusinessDialogVisible.value = false
}

// 关联展期业务选择对话框
const extensionBusinessDialogVisible = ref(false)
const extensionLoading = ref(false)
const extensionQueryFormRef = ref()
const extensionBusinessList = ref<any[]>([])
const extensionQueryParams = reactive({
  businessNo: undefined,
  businessName: undefined
})



/** 打开关联展期业务选择对话框 */
const openExtensionBusinessDialog = () => {
  if (!formData.value.customerNo) {
    message.warning('请先选择客户')
    return
  }
  extensionBusinessDialogVisible.value = true
  getExtensionBusinessList()
}

/** 获取关联展期业务列表 */
const getExtensionBusinessList =async () => {
  extensionLoading.value = true
  try {
    const res = await penddingApi.qryRelatedExtensionBusinessPage({
      customerID: formData.value.customerNo,
    })
  console.log('res',res)
    if (res) {
      // 将接口返回的数据转换为选项格式
      extensionBusinessList.value = res.list
      extensionLoading.value = false
      console.log('关联展期数据加载成功:', occurrenceTypeOptions.value)
    }
  } catch (error) {
    console.error('关联展期数据成功失败:', error)
    message.error('关联展期数据成功失败')
  } 
}

/** 重置关联展期业务查询 */
const resetExtensionQuery = () => {
  extensionQueryFormRef.value?.resetFields()
  extensionQueryParams.businessNo = undefined
  extensionQueryParams.businessName = undefined
  getExtensionBusinessList()
}

/** 点击关联展期业务行 */
const handleExtensionBusinessRowClick = (row: any) => {
  formData.value.extensionBusiness = row.businessName
  formData.value.extensionBusinessNo = row.businessNo
  extensionBusinessDialogVisible.value = false
}




// 关联白名单选择对话框
const relativeWhiteListNoDialogVisible = ref(false)
const relativeWhiteListNoLoading = ref(false)
const relativeWhiteListNoFormRef = ref()
const relativeWhiteListTotal =ref(0)
const relativeWhiteListNoBusinessList = ref<any[]>([])
const relativeWhiteListNoParams = reactive({
  serialno: undefined,
  projectname: undefined,
  borrowername: undefined,
  certid:undefined,
  borrowerid:undefined,
  pageSize:5,
  pageNo:1
})


/** 打开关联白名单对话框 */
const openRelativeWhiteListNoDialog = () => {
  if (!formData.value.customerNo) {
    message.warning('请先选择客户')
    return
  }
  relativeWhiteListNoDialogVisible.value = true
   getrelativeWhiteList()
}

/** 重置关联白名单查询 */
const resetRelativeWhiteListNQuery = () => {
  // relativeWhiteListNoFormRef.value?.resetFields()
  // relativeWhiteListNoFormRef.businessNo = undefined
  // relativeWhiteListNoFormRef.businessName = undefined
    getrelativeWhiteList()
}

/** 点击关联白名单业务行 */
const handleRelativeWhiteListNoRowClick = (row: any) => {
  formData.value.relativeWhiteListNo = row.serialno
  relativeWhiteListNoDialogVisible.value = false
}

const  getrelativeWhiteList =async () => {
  relativeWhiteListNoLoading.value = true
  try {
    const res = await penddingApi.getWhiteApplyList({
      CustomerID: formData.value.customerNo,
    })

    console.log('res',res);
    

    if (res) {
      // 将接口返回的数据转换为选项格式
      relativeWhiteListNoBusinessList.value = res.list
      relativeWhiteListNoLoading.value = false
      relativeWhiteListTotal.value = res.total
      console.log('关联白名单数据加载成功:', relativeWhiteListNoBusinessList.value)
    }
  } catch (error) {
    console.error('关联白名单数据成功失败:', error)
    message.error('关联白名单数据成功失败')
  } 
}



// 关联授信群选择对话框
const relatedGroupCreditVisible = ref(false)
const relatedGroupCreditLoading = ref(false)
const relatedGroupCreditFormRef = ref()
const relativeGYLEDListTotal =  ref(0)
const relatedGroupCreditList = ref<any[]>([])
const relatedGroupCreditParams = reactive({
  serialNo: undefined,
  businessTypeName: undefined,
  customerName:undefined,
  typeName:undefined,
  projectName:undefined,
  pageNo:1,
  pageSize:5,
})


const openRelativeGYLEDDialog = () => {
  if (!formData.value.customerNo) {
    message.warning('请先选择客户')
    return
  }
  relatedGroupCreditVisible.value = true
   getRelativeGYLEDList()
}

/** 重置关联群授信*/
const resetRelativeGYLEDListNQuery = () => {
  relatedGroupCreditFormRef.value?.resetFields()
  relatedGroupCreditParams.serialNo = undefined
  relatedGroupCreditParams.customerName = undefined
  getRelativeGYLEDList()
}


const getRelativeGYLEDList = async () => {
  relatedGroupCreditLoading.value = true
  try {
    const fap =  penddingApi.qryRelatedGroupCreditGrantPage
    // 调用接口获取客户列表
    const res = await fap({
      serialNo: relatedGroupCreditParams.serialNo,
      customerName: relatedGroupCreditParams.customerName,
      pageNo: relatedGroupCreditParams.pageNo,
      pageSize: relatedGroupCreditParams.pageSize
    })
    // console.log('res',res);
    if (res) {
      // 将接口返回的数据转换为选项格式
      relatedGroupCreditList.value = res.list
      relatedGroupCreditLoading.value = false
      relativeGYLEDListTotal.value = res.total
      console.log('关联白名单数据加载成功:', relatedGroupCreditList.value)
    }
  } catch (error) {
    console.error('关联白名单数据成功失败:', error)
    message.error('关联白名单数据成功失败')
  } 
}

/** 点击关联授信群业务行 */
const handlerelatedGroupCreditClick = (row: any) => {
  formData.value.relativeGYLED = row.serialNo
  relatedGroupCreditVisible.value = false
}

// 提额选择对话框
const tieBusinessDialogVisible = ref(false)
const tieLoading = ref(false)
const tieQueryFormRef = ref()
const tieTotal =  ref(0)
const tieBusinessList = ref<any[]>([])
const tieQueryParams = reactive({
  serialNo: undefined,
  customerName:undefined,
  pageNo:1,
  pageSize:5,
})


const openTieDialog = () => {
  if (!formData.value.customerNo) {
    message.warning('请先选择客户')
    return
  }
  tieBusinessDialogVisible.value = true
  getTieYwList()
}



const getTieYwList = async () => {
  tieLoading.value = true
  try {
    const res = await penddingApi.qryIncreaseBusinessPage({customerID:formData.value.customerNo,})
    // console.log('res',res);
    if (res) {
      // 将接口返回的数据转换为选项格式
      tieBusinessList.value = res.list
      tieLoading.value = false
      tieTotal.value = res.total
      console.log('业务品种列表数据加载成功:', tieBusinessList.value)
    }
  } catch (error) {
    console.error('业务品种列表数据失败:', error)
    message.error('业务品种列表数据失败')
  } 
}

const resetTieQuery =() =>{
  tieQueryFormRef.value?.resetFields()
  tieQueryParams.serialNo = undefined
  tieQueryParams.customerName = undefined
  getTieYwList()
}

const handleTieBusinessRowClick = (row) => {
  // formData.value.tieyw = row.serialNo
  tieBusinessDialogVisible.value = false
}






// 表单数据
const formData = ref({
  appType: '按核心企业申报',
  creditSourceFlag: '01',
  occurrenceType: '080', // 发生类型 - 默认"新增"
  customerType: '01', // 客户类型 - 默认"公司客户"
  customerNo: "", // 客户编号
  customerName: "", // 客户名称
  projectName:"",
  relaTeamWork:"",// 合作项目
  //renewalBusiness: undefined, // 续作业务名称
  relativeContract: "", // 续作业务编号
 // reconsiderBusiness: undefined, // 复议业务名称
  // reconsiderBusinessNo: undefined, // 复议业务编号
 // extensionBusiness: undefined, // 关联展期业务名称
 // extensionBusinessNo: undefined, // 关联展期业务编号
  businessType: "", // 业务品种名称
  businessTypeNo: "", // 业务品种编号
  relativeWhiteListNo:"", // 关联白名单账号
  relativeGYLED:"",// 关联群授信
  occurrenceDate: formatDate(new Date(),'YYYY-MM-DD'), // 发生日期 现在不能传
  //registerOrg: undefined, // 登记机构
  registerUser: userStore.getUser.nickname, // 登记人
  registerDate:formatDate(new Date(),'YYYY-MM-DD'),  // 登记日期
  // tieyw: undefined, //后端还没定
})

// 表单校验规则
const formRules = reactive({
  appType: [{ required: true, message: '申报方式不能为空', trigger: 'change' }],
  occurrenceType: [{ required: true, message: '发生类型不能为空', trigger: 'change' }],
  customerType: [{ required: true, message: '客户类型不能为空', trigger: 'blur' }],
  relativeContract: [{ required: true, message: '续作业务不能为空', trigger: 'blur' }],
  customerNo: [{ required: true, message: '客户编号不能为空', trigger: 'blur' }],
  businessType: [{ required: true, message: '业务品种不能为空', trigger: 'blur' }],
  extensionBusiness:[{
    validator:(_rule:any,value:any,callback:any) => {
      if(formData.value.occurrenceType==='095' && !value){
      callback(new Error('关联展期业务不能为空'))
      }else {
        callback()
      }
    },
    trigger:'blur'
  }],
  renewalBusiness:[{
    validator:(_rule:any,value:any,callback:any) => {
      if(formData.value.occurrenceType==='084' && !value){
      callback(new Error('续作业务不能为空'))
      }else {
        callback()
      }
    },
    trigger:'blur'
  }],
  reconsiderBusiness:[{
    validator:(_rule:any,value:any,callback:any) => {
      if(formData.value.occurrenceType==='088' && !value){
      callback(new Error('复议业务不能为空'))
      }else {
        callback()
      }
    },
    trigger:'blur'
  }],
  //必输。
  relaTeamWork: [{ validator:(_rule:any,value:any,callback:any) => {
    console.log('value.',value);
    
      if(!value){
        callback(new Error('合作项目不能为空'))
      }else {
        callback()
      }
    },
    required:true,
    trigger:'blur'}],
})

// 监听客户类型变化，清空相关字段
watch(
  () => formData.value.customerType,
  (newVal, oldVal) => {
    // 只有在已有旧值的情况下才清空（避免初始化时清空默认值）
    if (oldVal !== undefined && newVal !== oldVal) {
      // 清空客户相关字段
      formData.value.customerNo = undefined
      formData.value.customerName = undefined

      // 清空业务品种相关字段
      formData.value.businessType = undefined
      formData.value.businessTypeNo = undefined

      // 清空续作/复议/展期业务字段
      // formData.value.renewalBusiness = undefined
       formData.value.relativeContract = undefined
      // formData.value.reconsiderBusiness = undefined
      // formData.value.reconsiderBusinessNo = undefined
      // formData.value.extensionBusiness = undefined
     // formData.value.extensionBusinessNo = undefined

      // 切换清空
      formData.value.projectName = ''
      formData.value.relaTeamWork = ''

      // 清空业务品种树数据
      businessTypeTreeData.value = []

      console.log('客户类型已改变，已清空相关字段')
    }
  }
)

// 监听发生类型变化，清空对应的业务字段
watch(
  () => formData.value.occurrenceType,
  (newVal, oldVal) => {
    if (oldVal !== undefined && newVal !== oldVal) {
      // 当发生类型改变时，清空对应的业务字段
      if (newVal !== '084') {
        // 不是续作，清空续作业务
        formData.value.renewalBusiness = undefined
        formData.value.relativeContract = undefined
      }
      if (newVal !== '088') {
        // 不是复议，清空复议业务
        formData.value.reconsiderBusiness = undefined
        formData.value.reconsiderBusinessNo = undefined
      }
      if (newVal !== '095') {
        // 不是展期，清空展期业务
        formData.value.extensionBusiness = undefined
        formData.value.extensionBusinessNo = undefined
      }
    }
  }
)
// 监听发生名称变化，清空对应的需做业务
watch(
  () => formData.value.customerName,
  (newVal, oldVal) => {
    if (oldVal !== undefined && newVal !== oldVal) {
       formData.value.relativeContract = undefined
    }
  }
)

const emit = defineEmits(['update:modelValue','close','handleSuccess'])

/** 提交表单 */
const submitForm = async () => {
  // 表单校验
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => {})
  if (!valid) return
  
  try {
    formLoading.value = true
    var coreviewmethod = '';
    if(formData.value.occurrenceType == '080'){
      coreviewmethod ='01'
    }else if(formData.value.occurrenceType == '084'){
       coreviewmethod = '02'
    }
     const paramsTemp = {
       coreviewmethod:coreviewmethod,
       projectid:formData.value.relaTeamWork
     }
     console.log(paramsTemp)
   //调用前置校验
    const flag =  await creditApplyJobApi.getProjectcoreviewApplyCount(paramsTemp)
    if(flag == 0 && formData.value.occurrenceType === '084'){
        return message.error('所关联的项目需要存在对应审批通过的新增或续作协审')
    }
    const params = {
          creditSourceFlag:props.creditSourceFlag,
          occurType:formData.value.occurrenceType,
          customerID:formData.value.customerNo,
          businessType:formData.value.businessTypeNo,
          relativeWhiteListNo:formData.value.relativeWhiteListNo,
          relativeGYLED:formData.value.relativeGYLED,
          relaTeamWork:formData.value.relaTeamWork,
          relativeContract:formData.value.relativeContract
     }
    // TODO: 调用新增接口
    const res =  await creditApplyJobApi.saveCreditLimitApply(params)
    message.success('新增成功')
    emit('update:modelValue',false)
    // emit('close')
    emit('handleSuccess',res)
    // goDetail()
   
    // 返回列表页
    // router.back()
  } catch (error) {
    console.error('新增失败：', error)
    emit('update:modelValue',false)
  } finally {
    formLoading.value = false
  }
}


const goDetail = (row) => {
  // emit('goDetail')
  const detailPath = `/creditapplication/creditApplyJob/detail`
  router.push({
    path: detailPath,
    query: {
      objectType:"CreditApply",
      serialNo : row.objectNo,
      t: Date.now() // 解决重复打开相同详情，详情页面不加载的问题
    }
  })
}


let preValue =''

const handleOccurrenceType = (val) => {
  // formData.occurrenceType

 if(val !== preValue) {
   console.log('值发生了变化');
      formData.value.customerNo = undefined
      formData.value.customerName = undefined

      // 清空业务品种相关字段
      formData.value.businessType = undefined
      formData.value.businessTypeNo = undefined

      
       formData.value.relativeContract = undefined
       formData.value.projectName = ''
      formData.value.relaTeamWork = ''

      // 清空业务品种树数据
      businessTypeTreeData.value = []
 }
 preValue = val
}

/** 取消操作 */
const handleCancel = () => {
  // router.back()
  emit('close')
}
</script>
<style scoped lang="scss">
.detail-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}

// 分页组件样式调整

.bank-pagination {
  padding: 16px 0;
  
  :deep(.el-pagination) {
    justify-content: center;
    
    .el-pagination__sizes {
      margin-right: 24px;
      
      .el-select {
        margin-right: 0;
      }
    }
    
    .btn-prev,
    .btn-next {
      min-width: 36px;
      height: 32px;
      margin: 0 6px;
      padding: 0 8px;
    }
    
    .el-pager {
      margin: 0 8px;
      
      li {
        min-width: 36px;
        height: 32px;
        margin: 0 4px;
        line-height: 32px;
      }
    }
    
    .el-pagination__jump {
      margin-left: 24px;
      
      .el-input {
        width: 60px;
        margin: 0 10px;
        
        .el-input__inner {
          padding: 0 8px;
        }
      }
    }
    
    // 增加整体间距
    .el-pagination__total {
      margin-right: 16px;
    }
  }
}

.dialog-footer {
  height: 50px;
}
</style>
