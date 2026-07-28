import { Layout } from '@/utils/routerHelper'

import { customerManagers } from './customerManagers' // 客户管理


const { t } = useI18n()
/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

 alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
 只有一个时，会将那个子路由当做根路由显示在侧边栏，
 若你想不管路由下面的 children 声明的个数都显示你的根路由，
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
 一直显示根路由(默认 false)

 title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

 icon: 'svg-name'          设置该路由的图标

 noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

 breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

 affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

 noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

 activeMenu: '/dashboard'  显示高亮的路由路径

 followAuth: '/dashboard'  跟随哪个路由进行权限过滤

 canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
 }
 **/
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectIndex',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Home/Index.vue'),
        name: 'Index',
        meta: {
          title: t('router.home'),
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('@/views/system/notify/my/index.vue'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: '我的站内信'
        }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    name: 'dict',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'type/data/:dictType',
        component: () => import('@/views/system/dict/data/index.vue'),
        name: 'SystemDictData',
        meta: {
          title: '字典数据',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/system/dict'
        }
      }
    ]
  },

  {
    path: '/codegen',
    component: Layout,
    name: 'CodegenEdit',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'edit',
        component: () => import('@/views/infra/codegen/EditTable.vue'),
        name: 'InfraCodegenEditTable',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '修改生成配置',
          activeMenu: 'infra/codegen/index'
        }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    name: 'JobL',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'job-log',
        component: () => import('@/views/infra/job/logger/index.vue'),
        name: 'InfraJobLog',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '调度日志',
          activeMenu: 'infra/job/index'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/sso',
    component: () => import('@/views/Login/Login.vue'),
    name: 'SSOLogin',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/SingleSignOn',
    component: () => import('@/views/sso/SingleSignOn.vue'),
    name: 'SingleSignOn',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/social-login',
    component: () => import('@/views/Login/SocialLogin.vue'),
    name: 'SocialLogin',
    meta: {
      hidden: true,
      title: t('router.socialLogin'),
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/bpm',
    component: Layout,
    name: 'bpm',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'manager/form/edit',
        component: () => import('@/views/bpm/form/editor/index.vue'),
        name: 'BpmFormEditor',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '设计流程表单',
          activeMenu: '/bpm/manager/form'
        }
      },
      {
        path: 'manager/definition',
        component: () => import('@/views/bpm/model/definition/index.vue'),
        name: 'BpmProcessDefinition',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程定义',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'process-instance/detail',
        component: () => import('@/views/bpm/processInstance/detail/index.vue'),
        name: 'BpmProcessInstanceDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程详情',
          activeMenu: '/bpm/task/my'
        },
        props: (route) => ({
          id: route.query.id,
          taskId: route.query.taskId,
          activityId: route.query.activityId
        })
      },
      {
        path: 'process-instance/report',
        component: () => import('@/views/bpm/processInstance/report/index.vue'),
        name: 'BpmProcessInstanceReport',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '数据报表',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'oa/leave/create',
        component: () => import('@/views/bpm/oa/leave/create.vue'),
        name: 'OALeaveCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '发起 OA 请假',
          activeMenu: '/bpm/oa/leave'
        }
      },
      {
        path: 'oa/leave/detail',
        component: () => import('@/views/bpm/oa/leave/detail.vue'),
        name: 'OALeaveDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '查看 OA 请假',
          activeMenu: '/bpm/oa/leave'
        }
      },
      {
        path: 'manager/model/create',
        component: () => import('@/views/bpm/model/form/index.vue'),
        name: 'BpmModelCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '创建流程',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'manager/model/:type/:id',
        component: () => import('@/views/bpm/model/form/index.vue'),
        name: 'BpmModelUpdate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '修改流程',
          activeMenu: '/bpm/manager/model'
        }
      }
    ]
  },
  {
    path: '/mall/product', // 商品中心
    component: Layout,
    name: 'ProductCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'spu/add',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuAdd',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '商品添加',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'spu/edit/:id(\\d+)',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '商品编辑',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'spu/detail/:id(\\d+)',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '商品详情',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'property/value/:propertyId(\\d+)',
        component: () => import('@/views/mall/product/property/value/index.vue'),
        name: 'ProductPropertyValue',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '商品属性值',
          activeMenu: '/product/property'
        }
      }
    ]
  },
  {
    path: '/mall/trade', // 交易中心
    component: Layout,
    name: 'TradeCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'order/detail/:id(\\d+)',
        component: () => import('@/views/mall/trade/order/detail/index.vue'),
        name: 'TradeOrderDetail',
        meta: { title: '订单详情', icon: 'ep:view', activeMenu: '/mall/trade/order' }
      },
      {
        path: 'after-sale/detail/:id(\\d+)',
        component: () => import('@/views/mall/trade/afterSale/detail/index.vue'),
        name: 'TradeAfterSaleDetail',
        meta: { title: '退款详情', icon: 'ep:view', activeMenu: '/mall/trade/after-sale' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    name: 'MemberCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'user/detail/:id',
        name: 'MemberUserDetail',
        meta: {
          title: '会员详情',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/member/user/detail/index.vue')
      }
    ]
  },
  {
    path: '/pay',
    component: Layout,
    name: 'pay',
    meta: { hidden: true },
    children: [
      {
        path: 'cashier',
        name: 'PayCashier',
        meta: {
          title: '收银台',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/pay/cashier/index.vue')
      }
    ]
  },
  {
    path: '/diy',
    name: 'DiyCenter',
    meta: { hidden: true },
    component: Layout,
    children: [
      {
        path: 'template/decorate/:id',
        name: 'DiyTemplateDecorate',
        meta: {
          title: '模板装修',
          noCache: true,
          hidden: true,
          activeMenu: '/mall/promotion/diy/template'
        },
        component: () => import('@/views/mall/promotion/diy/template/decorate.vue')
      },
      {
        path: 'page/decorate/:id',
        name: 'DiyPageDecorate',
        meta: {
          title: '页面装修',
          noCache: true,
          hidden: true,
          activeMenu: '/mall/promotion/diy/page'
        },
        component: () => import('@/views/mall/promotion/diy/page/decorate.vue')
      }
    ]
  },
  {
    path: '/crm',
    component: Layout,
    name: 'CrmCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'clue/detail/:id',
        name: 'CrmClueDetail',
        meta: {
          title: '线索详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/clue'
        },
        component: () => import('@/views/crm/clue/detail/index.vue')
      },
      {
        path: 'customer/detail/:id',
        name: 'CrmCustomerDetail',
        meta: {
          title: '客户详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/customer'
        },
        component: () => import('@/views/crm/customer/detail/index.vue')
      },
      {
        path: 'business/detail/:id',
        name: 'CrmBusinessDetail',
        meta: {
          title: '商机详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/business'
        },
        component: () => import('@/views/crm/business/detail/index.vue')
      },
      {
        path: 'contract/detail/:id',
        name: 'CrmContractDetail',
        meta: {
          title: '合同详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/contract'
        },
        component: () => import('@/views/crm/contract/detail/index.vue')
      },
      {
        path: 'receivable-plan/detail/:id',
        name: 'CrmReceivablePlanDetail',
        meta: {
          title: '回款计划详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/receivable-plan'
        },
        component: () => import('@/views/crm/receivable/plan/detail/index.vue')
      },
      {
        path: 'receivable/detail/:id',
        name: 'CrmReceivableDetail',
        meta: {
          title: '回款详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/receivable'
        },
        component: () => import('@/views/crm/receivable/detail/index.vue')
      },
      {
        path: 'contact/detail/:id',
        name: 'CrmContactDetail',
        meta: {
          title: '联系人详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/contact'
        },
        component: () => import('@/views/crm/contact/detail/index.vue')
      },
      {
        path: 'product/detail/:id',
        name: 'CrmProductDetail',
        meta: {
          title: '产品详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/product'
        },
        component: () => import('@/views/crm/product/detail/index.vue')
      },
      {
        path: 'audit-work/detail',
        name: 'CrmAuditWorkDetail',
        meta: {
          title: '工单审核详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/audit-work'
        },
        component: () => import('@/views/work/audit/AuditWorkDetail.vue')
      },
     
    ]
  },
  {
    path: '/creditapplication',
    component:Layout,
    name: 'Creditapplication',
    meta:{
      hidden:true,
    },
    children:[
        {
          path:'pendding/create',
          component:()=> import('@/views/creditapplication/pendding/create/index.vue'),
          name:'CreditapplicationPenddingcreate',
          meta:{
            title:'待处理申请-新增',
            noCache:true,
            canTo:true,
            hidden:true
          }
        },
        {
          path:'pendding/peddingDetail',
          component:()=> import("@/views/creditapplication/pendding/peddingDetail/index.vue"),
          name:'CreditApplicationPenddingDetail',
          meta:{
            title:'待处理申请-详情',
            noCache:true,
            canTo:true,
            hidden:false
          }
        },
        {
          path:'creditApplyJob/create',
          component:()=> import("@/views/creditapplication/creditApplyJob/create/index.vue"),
          name:'creditApplyJobCreate',
          meta:{
            title:'授信额度申请-新增',
            noCache:true,
            canTo:true,
            hidden:false
          }
        },
        {
          path:'creditApplyJob/detail',
          component:()=> import("@/views/creditapplication/creditApplyJob/projectCreditDetail/index.vue"),
          name:'creditApplyJobDetail',
          meta:{
            title:'授信额度申请-详情',
            noCache:true,
            canTo:true,
            hidden:false
          }
        },
    ]
  },
  {
    path:"/customeLevel",
    component:Layout,
    name: 'CustomeLevel',
    meta:{
      hidden:true,
    },
    children:[
      {
        path:'ydwkhbmd/detail/:id',
        component:()=> import('@/views/creditapplication/customeLevel/ydwkhbmd/detail/index.vue'),
        name:'YdwkhbmdDetail',
        meta:{
          title:'企业信息-详情',
          noCache:true,
          canTo:true,
          hidden:true
        }
      }
  ]
  },
  // {
  //   path:"/customerInfoMGM",
  //   component:Layout,
  //   name:"CustomerInfoMGM",
  //   meta:{
  //     hidden:true
  //   },
  //   children:[
  //     {
  //       path:'personal/detail/:id',
  //       component: () => import('@/views/customerInfoMGM/personal/customerDetail/index.vue'),
  //       name:"CustomerPersonalDetail",
  //       meta:{
  //         title:"自雇人士-详情",
  //         noCache:true,
  //         canTo:true,
  //         hidden:true
  //       }
  //     },
  //   ]
  // },
  {
    path:"/supplyChainDataApproval",
    component:Layout,
    name:"SupplyChainDataApprovalFront",
    meta:{
      hidden: true
    },
    children:[
      {
        path:'supplyChainDataApplication/detail',
        component: () => import('@/views/supplyChainDataApproval/application/detail/index.vue'),
        name:"SupplyChainDataApplicationDetail",
        meta:{
          title:"决策数据-详情",
          noCache: true,
          canTo: true,
          hidden: true
        }
      },
    ]
  },
  {
    path:"/contractIssuanceMGM",
    component:Layout,
    name:"contractIssuanceMGMFront",
    meta:{
      hidden: true
    },
    children:[
      {
        path:'approvalDetail',
        component: () => import('@/views/contractIssuanceMGM/approvalDetail/index.vue'),
        name:"contractApprovalDetail",
        meta:{
          title:"批复详情",
          noCache: true,
          canTo: true,
          hidden: true
        }
      },
      {
        path:'creditLineDetail',
        component: () => import('@/views/contractIssuanceMGM/creditLineDetail/index.vue'),
        name:"creditLineDetail",
        meta:{
          title:"授信额度详情",
          noCache: true,
          canTo: true,
          hidden: true
        }
      },
      {
        path:'contractDetail',
        component: () => import('@/views/contractIssuanceMGM/contractDetail/index.vue'),
        name:"contractDetail",
        meta:{
          title:"合同详情",
          noCache: true,
          canTo: true,
          hidden: true
        }
      },
      {
        path:'loanDetail',
        component: () => import('@/views/contractIssuanceMGM/loanDetail/index.vue'),
        name:"loanDetail",
        meta:{
          title:"出账详情",
          noCache: true,
          canTo: true,
          hidden: true
        }
      },
    ]
  },
  // 统一的iframe 页面
  {
    path: '/iframe',
    component:Layout,
    name: 'IframeF',
    meta:{
      hidden: true
    },
    children: [
      {
        path:'view',
        component: ()=> import('@/views/common/IFrameView.vue'),
        name: 'IframeView',
        meta: {
          title:"外部页面",
          noCache: true,
          canTo: true,
          hidden: true
        },
      }
    ]
  },
  {
    path: '/indebt/debtRuleManagement',
    component: Layout,
    name: 'DebtRuleManagementDirect',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'supplementApply',
        component: () => import('@/views/indebt/debtRuleManagement/index.vue'),
        name: 'DebtRuleSupplementApplyDirect',
        meta: { title: '债项规则补配申请', noCache: true, canTo: true, hidden: true }
      },
      {
        path: 'supplementApproval',
        component: () => import('@/views/indebt/debtRuleManagement/index.vue'),
        name: 'DebtRuleSupplementApprovalDirect',
        meta: { title: '债项规则补配审批', noCache: true, canTo: true, hidden: true }
      },
      {
        path: 'ruleMaintenance',
        component: () => import('@/views/indebt/debtRuleManagement/index.vue'),
        name: 'DebtRuleMaintenanceDirect',
        meta: { title: '债项规则维护', noCache: true, canTo: true, hidden: true }
      },
      {
        path: 'ruleLibrary',
        component: () => import('@/views/indebt/debtRuleManagement/index.vue'),
        name: 'DebtRuleLibraryDirect',
        meta: { title: '债项规则库管理', noCache: true, canTo: true, hidden: true }
      }
    ]
  },
  {
    path: '/indebt/debtLedgerQuery',
    component: Layout,
    name: 'DebtLedgerQueryDirect',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'orderContractLedgerQuery',
        component: () => import('@/views/indebt/debtLedgerQuery/orderContractLedgerQuery/index.vue'),
        name: 'OrderContractLedgerQueryDirect',
        meta: { title: '订单/合同台账查询', noCache: true, canTo: true, hidden: true }
      },
      {
        path: 'assetLedgerQuery',
        component: () => import('@/views/indebt/debtLedgerQuery/assetLedgerQuery/index.vue'),
        name: 'AssetLedgerQueryDirect',
        meta: { title: '债项资产台账查询', noCache: true, canTo: true, hidden: true }
      },
      {
        path: 'offlineLedgerQuery',
        component: () => import('@/views/indebt/debtLedgerQuery/offlineLedgerQuery/index.vue'),
        name: 'OfflineLedgerQueryDirect',
        meta: { title: '线下台账查询', noCache: true, canTo: true, hidden: true }
      }
    ]
  },
  {
    path: '/projectInfoMana',
    component:Layout,
    name: 'projectInfoManaDetail',
    meta:{
      hidden: true
    },
    children: [
      {
        path:'/paramAdjustApply-detail',
        component: ()=> import('@/views/projectparamconfigerandmanager/paramadjustapply/detail/index.vue'),
        name: 'ParamAdjustApplyDetail',
        meta: {
          title:"项目参数详情",
          noCache: true,
          canTo: true,
          hidden: true
        },
      }
    ]
  }
]

export default remainingRouter
