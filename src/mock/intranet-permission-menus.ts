export interface IntranetPermissionMenu {
  id: number
  parentId: number
  name: string
  path: string
  component: string | null
  componentName: string | null
  icon: string | null
  visible: boolean
  keepAlive: boolean
  alwaysShow: boolean
  children: IntranetPermissionMenu[] | null
}

/**
 * 从内网 get-permission-info 响应中提取的菜单树。
 * 仅保留菜单配置；本地 Mock 的用户、部门与权限仍使用脱敏演示数据。
 */
export const intranetPermissionMenus: IntranetPermissionMenu[] = JSON.parse(String.raw`
[
  {
    "id": 1169,
    "parentId": 0,
    "name": "客户管理",
    "path": "/customerManagers",
    "component": null,
    "componentName": null,
    "icon": null,
    "visible": true,
    "keepAlive": true,
    "alwaysShow": true,
    "children": [
      {
        "id": 1170,
        "parentId": 1169,
        "name": "公司客户管理",
        "path": "compCustMana",
        "component": "customerManagers/compCustMana/index",
        "componentName": "/compCustMana",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1171,
        "parentId": 1169,
        "name": "个人客户管理",
        "path": "indCustMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1172,
            "parentId": 1171,
            "name": "自雇人士管理",
            "path": "selfEmpMana",
            "component": "/customerManagers/indCustMana/personal/index",
            "componentName": "selfEmpMana",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1173,
            "parentId": 1171,
            "name": "受薪人士管理",
            "path": "salaryEarner",
            "component": "/customerManagers/indCustMana/sxrs/index",
            "componentName": "salaryEarner",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1290,
            "parentId": 1171,
            "name": "自雇人士详情",
            "path": "customerPersonalDetail/:id",
            "component": "customerManagers/indCustMana/personal/customerDetail/index",
            "componentName": "CustomerPersonalDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1291,
            "parentId": 1171,
            "name": "受薪人士详情",
            "path": "sxrsDetail/:id",
            "component": "customerManagers/indCustMana/sxrs/customerDetail/index",
            "componentName": "sxrsDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1174,
        "parentId": 1169,
        "name": "异地企业开户管理",
        "path": "openCorpBankAcct",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1175,
            "parentId": 1174,
            "name": "异地企业开户白名单认定申请",
            "path": "YDWKHQYWhiteListApply",
            "component": "toXd/index",
            "componentName": "YDWKHQYWhiteListApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1176,
            "parentId": 1174,
            "name": "异地企业开户调用申请",
            "path": "YDQYKHOpenAccountApply",
            "component": "toXd/index",
            "componentName": "YDQYKHOpenAccountApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1177,
        "parentId": 1169,
        "name": "客户资质管理",
        "path": "customerQuaMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1180,
            "parentId": 1177,
            "name": "征信查询审批",
            "path": "creditInqAppr",
            "component": "toXd/index",
            "componentName": "ZXQueryApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1288,
        "parentId": 1169,
        "name": "公司客户管理详情",
        "path": "compCustManalDetail",
        "component": "customerManagers/compCustMana/customerDetail/index",
        "componentName": "compCustManalDetail",
        "icon": "ep:arrow-left",
        "visible": false,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1349,
        "parentId": 1169,
        "name": "核心客户管理",
        "path": "coreCustomerManage",
        "component": "customerManagers/coreCustomerManage/index",
        "componentName": "coreCustomerManage",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1350,
        "parentId": 1169,
        "name": "链属客户管理",
        "path": "chainCustomer",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1351,
            "parentId": 1350,
            "name": "链属个人客户",
            "path": "chainPersonCustomer",
            "component": "customerManagers/chainCustomer/chainPersonCustomer/index",
            "componentName": "chainPersonCustomer",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1352,
            "parentId": 1350,
            "name": "链属公司客户",
            "path": "chainCompanyCus",
            "component": "customerManagers/chainCustomer/chainCompanyCus/index",
            "componentName": "chainCompanyCus",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1353,
            "parentId": 1350,
            "name": "链属公司详情页",
            "path": "compCustManalDetail",
            "component": "customerManagers/chainCustomer/chainCompanyCus/customerDetail/index",
            "componentName": "chainCompanyDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1354,
            "parentId": 1350,
            "name": "链属个人详情页",
            "path": "chainPersonCusDetail/:id",
            "component": "customerManagers/chainCustomer/chainPersonCustomer/customerDetail/index",
            "componentName": "chainPersonCusDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      }
    ]
  },
  {
    "id": 1182,
    "parentId": 0,
    "name": "项目管理",
    "path": "/projectMana",
    "component": null,
    "componentName": null,
    "icon": null,
    "visible": true,
    "keepAlive": true,
    "alwaysShow": true,
    "children": [
      {
        "id": 1183,
        "parentId": 1182,
        "name": "项目协审管理",
        "path": "projectCollReviMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1245,
            "parentId": 1183,
            "name": "项目协审申请",
            "path": "projectCollReviApply",
            "component": "projectMana/projectCollReviMana/projectCollReviApply/index",
            "componentName": "projectCollReviApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1249,
            "parentId": 1183,
            "name": "项目协审查询",
            "path": "projectCollReviComplete",
            "component": "projectMana/projectCollReviMana/projectCollReviComplete/index",
            "componentName": "projectCollReviComplete",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1289,
            "parentId": 1183,
            "name": "项目协审详情",
            "path": "projectCollReviManaDetail",
            "component": "projectMana/projectCollReviManaDetail/index",
            "componentName": "projectCollReviManaDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1184,
        "parentId": 1182,
        "name": "项目信息管理",
        "path": "projectInfoMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1447,
            "parentId": 1184,
            "name": "项目详情",
            "path": "projectDetails",
            "component": "projectparamconfigerandmanager/projectInfoQuery/details/index",
            "componentName": "ProjectInfoQueryProjectDetails",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1185,
            "parentId": 1184,
            "name": "项目参数调整申请",
            "path": "ParamAdjustApply",
            "component": "projectparamconfigerandmanager/paramadjustapply/index",
            "componentName": "ParamAdjustApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1427,
            "parentId": 1184,
            "name": "项目信息维护",
            "path": "maintainProjectInfo",
            "component": "projectparamconfigerandmanager/maintainProjectInfo/index",
            "componentName": "MaintainProjectInfo",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1187,
            "parentId": 1184,
            "name": "项目信息查询",
            "path": "ProjectInfoQuery",
            "component": "projectparamconfigerandmanager/projectInfoQuery/index",
            "componentName": "ProjectInfoQuery",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1705,
            "parentId": 1184,
            "name": "项目信息预录入申请",
            "path": "preInputApply",
            "component": "projectparamconfigerandmanager/preInputApply/index",
            "componentName": "preInputApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1707,
            "parentId": 1184,
            "name": "项目信息预录入维护申请",
            "path": "preInputMaintianApply",
            "component": "projectparamconfigerandmanager/preInputMaintianApply/index",
            "componentName": "preInputMaintianApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1725,
            "parentId": 1184,
            "name": "项目预录入详情",
            "path": "preInputApplyDetail",
            "component": "projectparamconfigerandmanager/preInputApply/detail/index",
            "componentName": "preInputApplyDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1188,
        "parentId": 1182,
        "name": "项目授信管理",
        "path": "projectCreditMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1189,
            "parentId": 1188,
            "name": "授信额度申请",
            "path": "sxedsq",
            "component": "projectMana/projectCreditMana/sxedsq/index",
            "componentName": "sxedsq",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1193,
            "parentId": 1188,
            "name": "批复变更申请",
            "path": "pfbgsq",
            "component": "projectMana/projectCreditMana/pfbgsq/index",
            "componentName": "pfbgsq",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1194,
            "parentId": 1188,
            "name": "项目授信审批",
            "path": "xmsxsp",
            "component": "projectMana/projectCreditMana/xmsxsp/index",
            "componentName": "xmsxsp",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1195,
        "parentId": 1182,
        "name": "项目合同管理",
        "path": "projectcontractSignMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1196,
            "parentId": 1195,
            "name": "合同登记",
            "path": "contractRegi",
            "component": "projectMana/projectcontractSignMana/contractRegister/index",
            "componentName": "contractRegiPro",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1367,
            "parentId": 1195,
            "name": "项目额度合同审批",
            "path": "applyQuotaContraCheck",
            "component": "contractIssuanceMGM/applyQuotaContraCheck/index",
            "componentName": "applyQuotaContraCheck",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1368,
            "parentId": 1195,
            "name": "项目业务合同审批",
            "path": "creditBusContraCheck",
            "component": "contractIssuanceMGM/creditBusContraCheck/index",
            "componentName": "creditBusContraCheck",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1199,
            "parentId": 1195,
            "name": "项目合同补签审批",
            "path": "DzhtSupplyApprove",
            "component": "toXd/index",
            "componentName": "DzhtSupplyApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1345,
        "parentId": 1182,
        "name": "签约发放管理",
        "path": "projectSign",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1346,
            "parentId": 1345,
            "name": "放贷申请",
            "path": "mortgageApplication",
            "component": "projectMana/projectSign/loanApplication/index",
            "componentName": "mortgageApplication",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1348,
            "parentId": 1345,
            "name": "放贷审批",
            "path": "proLoanApproval",
            "component": "projectMana/projectSign/signAppliApprCheck/index",
            "componentName": "proLoanApproval",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      }
    ]
  },
  {
    "id": 1205,
    "parentId": 0,
    "name": "链属客户业务管理",
    "path": "/singBusMana",
    "component": null,
    "componentName": null,
    "icon": null,
    "visible": true,
    "keepAlive": true,
    "alwaysShow": true,
    "children": [
      {
        "id": 1206,
        "parentId": 1205,
        "name": "渠道/大供进件管理",
        "path": "channelEntryMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1207,
            "parentId": 1206,
            "name": "电子渠道进件管理",
            "path": "elecChannelAppMana",
            "component": "/elecChannelAppMana/index",
            "componentName": "elecChannelAppMana",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1465,
            "parentId": 1206,
            "name": "电子渠道进件详情",
            "path": "elecChannelAppMana/detail",
            "component": "singBusMana/channelEntryMana/elecChannelAppMana/elecChannelAppManaDetail/index",
            "componentName": "elecChannelAppManaDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1208,
            "parentId": 1206,
            "name": "多级融资进件管理",
            "path": "financingAppliMGM",
            "component": "singBusMana/channelEntryMana/financingAppliMGM/index",
            "componentName": "financingAppliMGM",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1209,
            "parentId": 1206,
            "name": "大供进件管理",
            "path": "applicationMGM",
            "component": "singBusMana/channelEntryMana/applicationMGM/index",
            "componentName": "applicationMGM",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1448,
            "parentId": 1206,
            "name": "多级融资详情",
            "path": "financingAppliMGM/detail",
            "component": "singBusMana/channelEntryMana/financingAppliMGM/detail/index",
            "componentName": "financingAppliMGMDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1210,
            "parentId": 1206,
            "name": "大供未通过结果通知",
            "path": "dgNoPassNotify",
            "component": "singBusMana/channelEntryMana/dgNoPassNotify/index",
            "componentName": "dgNoPassNotify",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1425,
            "parentId": 1206,
            "name": "大供进件详情",
            "path": "applicationMGMDetail",
            "component": "singBusMana/channelEntryMana/applicationMGM/applicationMGMDetail/index",
            "componentName": "applicationMGMDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1211,
        "parentId": 1205,
        "name": "授信申请管理",
        "path": "creditAppMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1212,
            "parentId": 1211,
            "name": "授信额度申请",
            "path": "creditLineApp",
            "component": "creditapplication/creditLimitApply/index",
            "componentName": "creditLineApp1",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1213,
            "parentId": 1211,
            "name": "单笔业务授信申请",
            "path": "singBatCreditApp",
            "component": "creditapplication/singleCreditApplication/index",
            "componentName": "singBatCreditApp",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1216,
            "parentId": 1211,
            "name": "批复变更申请",
            "path": "apprChangApp",
            "component": "creditapplication/linkedApprovalChangeRequest/index",
            "componentName": "apprChangApp",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1217,
            "parentId": 1211,
            "name": "单户授信审批",
            "path": "apprChangeAppr",
            "component": "reviewapproval/credit/index",
            "componentName": "apprChangeAppr",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1218,
        "parentId": 1205,
        "name": "链属客户签约发放管理",
        "path": "signDistMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1219,
            "parentId": 1218,
            "name": "合同登记",
            "path": "contractRegi",
            "component": "contractIssuanceMGM/contractRegister/index",
            "componentName": "contractRegi",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1369,
            "parentId": 1218,
            "name": "链属客户额度合同审批",
            "path": "applyQuotaContraCheck",
            "component": "singBusMana/signDistMana/applyQuotaContraCheck/index",
            "componentName": "singApplyQuotaContraCheck",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1370,
            "parentId": 1218,
            "name": "链属客户业务合同审批",
            "path": "creditBusContraCheck",
            "component": "singBusMana/signDistMana/creditBusContraCheck/index",
            "componentName": "singCreditBusContraCheck",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1285,
            "parentId": 1218,
            "name": "合同补签审批",
            "path": "DzhtSupplyApprove",
            "component": "toXd/index",
            "componentName": "DzhtSupplyApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1221,
            "parentId": 1218,
            "name": "放贷申请",
            "path": "loanApp",
            "component": "contractIssuanceMGM/loanApplication/index",
            "componentName": "loanApp",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1222,
            "parentId": 1218,
            "name": "放贷审批",
            "path": "loanAppr",
            "component": "contractIssuanceMGM/loanAppliApprCheck/index",
            "componentName": "loanAppr",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1223,
        "parentId": 1205,
        "name": "决策数据管理",
        "path": "supplyChainDataApproval",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1224,
            "parentId": 1223,
            "name": "决策数据申请",
            "path": "supplyChainDataApplication",
            "component": "supplyChainDataApproval/application/index",
            "componentName": "SupplyChainDataApplication",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1226,
            "parentId": 1223,
            "name": "决策数据查询",
            "path": "WhiteListAutoFullQuery",
            "component": "supplyChainDataApproval/decisionDataCheck/index",
            "componentName": "DecisionDataCheck",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      }
    ]
  },
  {
    "id": 1227,
    "parentId": 0,
    "name": "贷后管理",
    "path": "/postlendingMana",
    "component": null,
    "componentName": null,
    "icon": null,
    "visible": true,
    "keepAlive": true,
    "alwaysShow": true,
    "children": [
      {
        "id": 1228,
        "parentId": 1227,
        "name": "授信台账",
        "path": "ContractMain",
        "component": "toXd/index",
        "componentName": "ContractMain",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1229,
        "parentId": 1227,
        "name": "贷后检查管理",
        "path": "postLendingCheckMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1230,
            "parentId": 1229,
            "name": "贷后检查",
            "path": "AfterCheckApply",
            "component": "toXd/index",
            "componentName": "AfterCheckApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1231,
            "parentId": 1229,
            "name": "贷后检查认定",
            "path": "AfterCheckApprove",
            "component": "toXd/index",
            "componentName": "AfterCheckApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1233,
            "parentId": 1229,
            "name": "贷后检查白名单审批",
            "path": "WAfterCheckApprove",
            "component": "toXd/index",
            "componentName": "WAfterCheckApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1236,
        "parentId": 1227,
        "name": "风险预警管理",
        "path": "ResolutionMain",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1259,
            "parentId": 1236,
            "name": "预警信号排查认定申请",
            "path": "WarningSignalApply",
            "component": "toXd/index",
            "componentName": "WarningSignalApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1263,
            "parentId": 1236,
            "name": "预警信号排查认定复核",
            "path": "WarningSignalApprove",
            "component": "toXd/index",
            "componentName": "WarningSignalApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1264,
            "parentId": 1236,
            "name": "预警信号监测申请",
            "path": "ResolutionApply",
            "component": "toXd/index",
            "componentName": "ResolutionApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1265,
            "parentId": 1236,
            "name": "预警信号监测复核",
            "path": "ResolutionApprove",
            "component": "toXd/index",
            "componentName": "ResolutionApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1256,
            "parentId": 1236,
            "name": "预警解除与调整申请",
            "path": "WarningRemoveApply",
            "component": "toXd/index",
            "componentName": "WarningRemoveApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1257,
            "parentId": 1236,
            "name": "预警解除与调整复核",
            "path": "WarningRemoveApprove",
            "component": "toXd/index",
            "componentName": "WarningRemoveApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1258,
            "parentId": 1236,
            "name": "预警信号台账管理",
            "path": "WarningSignalBookKeeping",
            "component": "toXd/index",
            "componentName": "WarningSignalBookKeeping",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1237,
        "parentId": 1227,
        "name": "还款管理",
        "path": "repayMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1238,
            "parentId": 1237,
            "name": "提前还款申请复核",
            "path": "PreReturnApprove",
            "component": "toXd/index",
            "componentName": "PreReturnApprove",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      }
    ]
  },
  {
    "id": 1239,
    "parentId": 0,
    "name": "债项管理",
    "path": "/indebt",
    "component": null,
    "componentName": null,
    "icon": null,
    "visible": true,
    "keepAlive": true,
    "alwaysShow": true,
    "children": [
      {
        "id": 1760,
        "parentId": 1239,
        "name": "存货类",
        "path": "",
        "component": null,
        "componentName": "InventoryCategoryDirectory",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
      {
        "id": 1726,
        "parentId": 1760,
        "name": "存货类商品管理",
        "path": "inventoryGoods",
        "component": "indebt/inventoryGoods/index",
        "componentName": "InventoryGoodsManagement",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1727,
        "parentId": 1760,
        "name": "仓库管理",
        "path": "warehouseManagement",
        "component": "indebt/warehouseManagement/index",
        "componentName": "WarehouseManagement",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1728,
        "parentId": 1760,
        "name": "订单/合同信息修改",
        "path": "orderContractModification",
        "component": "indebt/orderContractModification/index",
        "componentName": "OrderContractModification",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1729,
        "parentId": 1760,
        "name": "存货类价格管理",
        "path": "inventoryPriceManagement",
        "component": "indebt/inventoryPriceManagement/index",
        "componentName": "InventoryPriceManagement",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1730,
        "parentId": 1760,
        "name": "债项资产到港管理",
        "path": "assetArrivalManagement",
        "component": "indebt/assetArrivalManagement/index",
        "componentName": "AssetArrivalManagement",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1731,
        "parentId": 1760,
        "name": "债项资产管理",
        "path": "assetManagement",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1732,
            "parentId": 1731,
            "name": "债项资产入库申请",
            "path": "assetManagement/inboundApplication",
            "component": "indebt/assetManagement/index",
            "componentName": "AssetManagementInboundApplication",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1733,
            "parentId": 1731,
            "name": "债项资产入库审批",
            "path": "assetManagement/inboundApproval",
            "component": "indebt/assetManagement/index",
            "componentName": "AssetManagementInboundApproval",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1734,
            "parentId": 1731,
            "name": "债项资产出库申请",
            "path": "assetManagement/outboundApplication",
            "component": "indebt/assetOutboundManagement/index",
            "componentName": "AssetOutboundManagementOutboundApplication",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1735,
            "parentId": 1731,
            "name": "债项资产出库审批",
            "path": "assetManagement/outboundApproval",
            "component": "indebt/assetOutboundManagement/index",
            "componentName": "AssetOutboundManagementOutboundApproval",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1736,
        "parentId": 1760,
        "name": "债项台账查询",
        "path": "debtLedgerQuery",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1737,
            "parentId": 1736,
            "name": "线下台账更新申请",
            "path": "offlineLedgerUpdate",
            "component": "indebt/debtLedgerQuery/offlineLedgerUpdate/index",
            "componentName": "OfflineLedgerUpdate",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1738,
            "parentId": 1736,
            "name": "订单/合同台账查询",
            "path": "orderContractLedgerQuery",
            "component": "indebt/debtLedgerQuery/orderContractLedgerQuery/index",
            "componentName": "OrderContractLedgerQuery",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1741,
            "parentId": 1736,
            "name": "债项资产台账查询",
            "path": "assetLedgerQuery",
            "component": "indebt/debtLedgerQuery/assetLedgerQuery/index",
            "componentName": "AssetLedgerQuery",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1744,
            "parentId": 1736,
            "name": "线下台账查询",
            "path": "offlineLedgerQuery",
            "component": "indebt/debtLedgerQuery/offlineLedgerQuery/index",
            "componentName": "OfflineLedgerQuery",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1747,
            "parentId": 1736,
            "name": "债项资产风险台账查询",
            "path": "assetRiskLedgerQuery",
            "component": "indebt/debtLedgerQuery/assetRiskLedgerQuery/index",
            "componentName": "AssetRiskLedgerQuery",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
            "id": 1750,
            "parentId": 1760,
            "name": "债项规则管理",
            "path": "debtRuleManagement",
            "component": null,
            "componentName": null,
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": [
              { "id": 1751, "parentId": 1750, "name": "债项规则补配申请", "path": "supplementApply", "component": "indebt/debtRuleManagement/index", "componentName": "DebtRuleSupplementApply", "icon": null, "visible": true, "keepAlive": true, "alwaysShow": true, "children": null },
              { "id": 1752, "parentId": 1750, "name": "债项规则补配审批", "path": "supplementApproval", "component": "indebt/debtRuleManagement/index", "componentName": "DebtRuleSupplementApproval", "icon": null, "visible": true, "keepAlive": true, "alwaysShow": true, "children": null },
              { "id": 1753, "parentId": 1750, "name": "债项规则维护", "path": "ruleMaintenance", "component": "indebt/debtRuleManagement/index", "componentName": "DebtRuleMaintenance", "icon": null, "visible": true, "keepAlive": true, "alwaysShow": true, "children": null },
              { "id": 1754, "parentId": 1750, "name": "债项规则库管理", "path": "ruleLibrary", "component": "indebt/debtRuleManagement/index", "componentName": "DebtRuleLibrary", "icon": null, "visible": true, "keepAlive": true, "alwaysShow": true, "children": null }
            ]
      }
        ]
      }
    ]
  },
  {
    "id": 1200,
    "parentId": 0,
    "name": "综合管理",
    "path": "/integratedMana",
    "component": null,
    "componentName": null,
    "icon": null,
    "visible": true,
    "keepAlive": true,
    "alwaysShow": true,
    "children": [
      {
        "id": 1201,
        "parentId": 1200,
        "name": "用印管理",
        "path": "sealMana",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1202,
            "parentId": 1201,
            "name": "用印申请",
            "path": "SealApply",
            "component": "toXd/index",
            "componentName": "SealApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1203,
            "parentId": 1201,
            "name": "用印审批",
            "path": "ApproveSealApply",
            "component": "toXd/index",
            "componentName": "ApproveSealApply",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 1204,
        "parentId": 1200,
        "name": "快速统计查询",
        "path": "QuickSearch",
        "component": "toXd/index",
        "componentName": "QuickSearch",
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": null
      },
      {
        "id": 1363,
        "parentId": 1200,
        "name": "模型建设管理",
        "path": "modelConstruction",
        "component": null,
        "componentName": null,
        "icon": null,
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 1385,
            "parentId": 1363,
            "name": "模型新增申请",
            "path": "modeApplication",
            "component": "integratedMana/modelConstruction/modeApplication/index",
            "componentName": "modeApplication",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1387,
            "parentId": 1363,
            "name": "模型变更申请",
            "path": "modelChangeApplication",
            "component": "integratedMana/modelConstruction/modelChangeApplication/index",
            "componentName": "modelChangeApplication",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1408,
            "parentId": 1363,
            "name": "申请详情页",
            "path": "modelConstructionDetail",
            "component": "integratedMana/modelConstruction/modeApplication/detail/index",
            "componentName": "modelConstructionDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1605,
            "parentId": 1363,
            "name": "变更申请详情页",
            "path": "modelChangeDetail",
            "component": "integratedMana/modelConstruction/modelChangeApplication/detail/index",
            "componentName": "modelChangeDetail",
            "icon": null,
            "visible": false,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 1685,
            "parentId": 1363,
            "name": "模型建设进度查询",
            "path": "modelJdCx",
            "component": "integratedMana/modelConstruction/modelJdCx/index",
            "componentName": "ModelDevProgressQuery",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      }
    ]
  },
  {
    "id": 23,
    "parentId": 0,
    "name": "工作流程",
    "path": "/bpm",
    "component": null,
    "componentName": null,
    "icon": null,
    "visible": true,
    "keepAlive": true,
    "alwaysShow": true,
    "children": [
      {
        "id": 24,
        "parentId": 23,
        "name": "流程管理",
        "path": "manager",
        "component": null,
        "componentName": null,
        "icon": "ep:base",
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 90,
            "parentId": 24,
            "name": "流程分类",
            "path": "category",
            "component": "bpm/category/index",
            "componentName": "BpmCategory",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 102,
            "parentId": 24,
            "name": "流程模型",
            "path": "model",
            "component": "bpm/model/index",
            "componentName": "BpmModel",
            "icon": "fa-solid:project-diagram",
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 103,
            "parentId": 24,
            "name": "流程实例",
            "path": "process-instance/manager",
            "component": "bpm/processInstance/manager/index",
            "componentName": "BpmProcessInstanceManager",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 104,
            "parentId": 24,
            "name": "流程任务",
            "path": "process-task",
            "component": "bpm/task/manager/index",
            "componentName": "BpmManagerTask",
            "icon": null,
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      },
      {
        "id": 25,
        "parentId": 23,
        "name": "任务管理",
        "path": "task",
        "component": null,
        "componentName": null,
        "icon": "fa:tasks",
        "visible": true,
        "keepAlive": true,
        "alwaysShow": true,
        "children": [
          {
            "id": 95,
            "parentId": 25,
            "name": "我的流程",
            "path": "my",
            "component": "bpm/processInstance/index",
            "componentName": "BpmProcessInstanceMy",
            "icon": "fa-solid:book",
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 99,
            "parentId": 25,
            "name": "待办任务",
            "path": "todo",
            "component": "bpm/task/todo/index",
            "componentName": "BpmTodoTask",
            "icon": "fa:slack",
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          },
          {
            "id": 170,
            "parentId": 25,
            "name": "已办任务",
            "path": "done",
            "component": "bpm/task/done/index",
            "componentName": "BpmDoneTask",
            "icon": "fa:delicious",
            "visible": true,
            "keepAlive": true,
            "alwaysShow": true,
            "children": null
          }
        ]
      }
    ]
  }
]
`) as IntranetPermissionMenu[]
