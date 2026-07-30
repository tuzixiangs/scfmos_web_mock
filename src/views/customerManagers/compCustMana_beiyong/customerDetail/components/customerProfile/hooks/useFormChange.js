import { ElMessage } from 'element-plus'
/**
 * 处理表单动态事件：change、blur等
 * @param {*} props
 */
export default function useFormChange(props, refList) {
  // 选择框change事件
  const formSelectChange = (formInfo) => {
    switch (formInfo['colname']) {
      case 'nraflag':
        // 控制指定控件显隐
        if (props.formData[formInfo['colname']] == '1') {
          refList.dynamicFormRef.value.showColumnByColName('brizefname')
        } else {
          refList.dynamicFormRef.value.hideColumnByColName('brizefname')
        }
        break
      case 'listingcorpornot':
        props.formData.boursename = ''
        props.formData.stockcode = ''
        break
      default:
        break
    }
  }

  // 点击打开弹窗事件
  const formSelectInputClick = (formInfo) => {
    if(formInfo.colname == 'regioncodename'  ){
      if(props.formData.countrycode != 'CHN'){
        return ElMessage.warning('所选国家不是中国，无需选择地区！')
      }
    }
    refList.mapRefs.value[`select${formInfo.colname}InputRef`].open(formInfo)
  }

  // 弹窗确认回调事件
  const popConfirm = (colname, item) => {
    switch (colname) {
      case 'orgtypename': // 控股类型
        props.formData.orgtype = item.key
        props.formData.orgtypename = item.title
        break
      case 'surplusindustryname': // 是否两高一剩行业
        props.formData.surplusindustry = item.key
        props.formData.surplusindustryname = item.title
        break
      case 'supercorpname': // 上级公司名称
        props.formData.supercorp = item.customerID
        props.formData.supercorpname = item.customerName
        break
      case 'countrycodename': // 所在国家
        props.formData.countrycode = item.key
        props.formData.countrycodename = item.title
        break
      case 'regioncodename': // 注册省市区
        props.formData.regioncode = item.key
        props.formData.regioncodename = item.title
        props.formData.registeradd = item.title
        console.log('111')
        console.log(item.key)
        if (item.key == '710000') {//台湾
          props.formData.countrycode = 'TWN'
          props.formData.countrycodename = '台湾（中国的省）'
        }else if(item.key == '810000'){//香港
          props.formData.countrycode = 'HKG'
          props.formData.countrycodename = '香港（中国特别行政区）'
        }else if(item.key == '820000'){//澳门
          props.formData.countrycode = 'MAC'
          props.formData.countrycodename = '澳门（中国特别行政区）'
        }
        if (item.key) popConfirm('officeaddcodename', item) // 选择注册省市区也把办公省市区选上
        break
      case 'officeaddcodename': // 办公省市区
        props.formData.officeaddcode = item.key
        props.formData.officeaddcodename = item.title
        props.formData.officeadd = item.title
        break
      case 'industrytypename': // 国标行业分类
        props.formData.industrytype = item.key
        props.formData.industrytypename = item.title
        break  
      case 'industrytypexlname': // 绿色贷款
        props.formData.industrytypexl = item.key
        props.formData.industrytypexlname = item.title
        break
      default:
        break
    }
  }

  /**
   * 自定义字段显隐逻辑
   */
  const customVisible = {
    // 信贷产品方案
    // loanproductcategory: () => props.formData['gylflag'] !== '03',
  }


  /**
   * 自定义字段必录逻辑
   */
  const customRequired = {
    //是否分支机构字段值为 “1-是” 时，“上级机构类型” 字段必输。
    supercorporgtype :() => props.formData['branchflag'] == '1',
    //国标行业分类为 “J-金融业” 时，“人行企业规模” 字段通过提示语句控制必输，提示语句：请输入人行企业规模
    pbcsize: () => props.formData['industrytype']?.startsWith('J'),
    //国标行业分类为以下类型时，绿色贷款（IndustryTypeXL）字段通过提示语句控制必输，提示语句：请输入绿色贷款
    // 
    // C2613-无机盐制造
    // C2614-有机化学原料制造
    // C2619-其他基础化学原料制造
    // C2651-初级形态塑料及合成树脂制造
    // C2911-轮胎制造
    // C3811-发电机及发电机组制造
    industrytypexlname:()=> ['C2613','C2614','C2619','C2651','C2911','C3811'].includes(props.formData['industrytype']),
    //基本帐户号不为空时，“基本帐户行” 字段必输。todo
    boursename:()=> props.formData['listingcorpornot'] != '2',
    stockcode:()=> props.formData['listingcorpornot'] != '2'
  }

  /**
   * 自定义字段只读逻辑
   */
  const customReadonly = {
    boursename:()=> props.formData['listingcorpornot'] == '2',
    stockcode:()=> props.formData['listingcorpornot'] == '2'
  }

  return {
    formSelectChange,
    formSelectInputClick,
    popConfirm,
    customVisible,
    customRequired,
    customReadonly
  }
}
