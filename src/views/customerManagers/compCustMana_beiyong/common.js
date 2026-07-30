import { useCrudSchemas } from '@/hooks/web/useCrudSchemas'

// CrudSchema https://doc.iocoder.cn/vue3/crud-schema/
const crudSchemas = reactive([
  {
    label: '客户名称',
    field: 'customerName',
    isSearch: true,
    table: {
      width: 250
    }
  },
  {
    label: '证件类型',
    field: 'certType',
  },
  {
    label: '证件号',
    field: 'certID',
    isSearch: true,
    table: {
      width: 200
    }
  },
  {
    label: '企业规模',
    field: 'scopeName',
  },
  {
    label: '是否我行定义小微',
    field: 'isSmallScope',
    isSearch: true,
    table: {
      width: 150
    }
  },
  {
    label: '主办客户经理',
    field: 'managerUserName',
    table: {
      width: 130
    }
  },
  {
    label: '主办机构',
    field: 'customerName',
    table: {
      width: 150
    }
  },
  {
    label: '核心客户号',
    field: 'MFCustomerID',
  },
  {
    label: '客户主办权',
    field: 'belongAttribute',
  },
  {
    label: '信息维护权',
    field: 'belongAttribute2',
  },
  {
    label: '信息查看权',
    field: 'belongAttribute1',
  },
  {
    label: '业务申办权',
    field: 'belongAttribute3',
  },
  {
    label: '暂存标志',
    field: 'tempSaveFlag',
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)
