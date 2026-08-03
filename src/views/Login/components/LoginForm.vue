<template>
  <div>
    <div>
      <el-form
        v-show="getShow"
        ref="formLogin"
        :model="loginData.loginForm"
        :rules="LoginRules"
        class="login-form"
        label-position="top"
        label-width="120px"
        size="large"
        @keyup.enter="getCode()"
        autocomplete="off"
      >
        <el-row class='loginRow' style="margin-right: -10px; margin-left: -10px">
          <el-col style="display: flex" class="justify-center p-50px pb-20px">
            <img style="width: 132px;height: 132px;" src="@/assets/imgs/platform-mark.svg" alt="供应链原型平台" />
          </el-col>
          <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item>
              <LoginFormTitle style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item prop="username">
              <el-input
                v-model="loginData.loginForm.username"
                placeholder=""
                :prefix-icon="iconAvatar"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item prop="password">
              <el-input
                v-model="loginData.loginForm.password"
                placeholder=""
                :prefix-icon="iconLock"
                show-password
                type="password"
                autocomplete="new-password"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
            <el-form-item>
              <XButton
                :loading="loginLoading"
                :title="t('login.login')"
                class="w-[100%]"
                type="primary"
                @click="getCode()"
              />
            </el-form-item>
          </el-col>
          <Verify
            ref="verify"
            :captchaType="captchaType"
            :imgSize="{ width: '400px', height: '200px' }"
            mode="pop"
            @success="handleLogin"
          />
        </el-row>
      </el-form>
    </div>
    <el-dialog title="修改密码" v-model="dialogVisible"   width="500px"  :close-on-click-modal="false">
      <el-form ref="formRef" :model="passWordForm" v-loading="formLoading" :rules="passRules"  label-width="100px">
        <span style="color: red;margin-left: 40px;">(密码规则：6-12位数字、英文大小写字母、特殊字符的组合)</span>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passWordForm.oldPassword" type="password"  style="width: 320px" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passWordForm.password"  type="password"   style="width: 320px" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="againPassword">
          <el-input v-model="passWordForm.againPassword" type="password"  style="width: 320px" />
        </el-form-item>
        <el-form-item>
          <div style="width: 320px;display: flex;justify-content: flex-end">
            <el-button tpye="" @click="onSubmit(formRef)">确认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {ElLoading, ElMessageBox, type FormRules,type FormInstance} from 'element-plus'
import LoginFormTitle from './LoginFormTitle.vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { updateUserPassword } from '@/api/system/user/profile'
import { useIcon } from '@/hooks/web/useIcon'
import { encrypt } from '@/utils/utils'
import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'
import { LoginStateEnum, useFormValid, useLoginState } from './useLogin'
import {deleteUserCache, useCache} from '@/hooks/web/useCache'
import {forceUpdateUserPassword, loginOut} from "@/api/login";
import {removeToken} from "@/utils/auth";
import * as BusinessApi from "@/api/crm/business";
import * as LeaveApi from "@/api/bpm/leave";
defineOptions({ name: 'LoginForm' })
const { t } = useI18n()
const { wsCache } = useCache()
const message = useMessage()
const iconHouse = useIcon({ icon: 'ep:house' })
const iconAvatar = useIcon({ icon: 'ep:avatar' })
const iconLock = useIcon({ icon: 'ep:lock' })
const formLogin = ref()
const { validForm } = useFormValid(formLogin)
const { setLoginState, getLoginState } = useLoginState()
const { currentRoute, push } = useRouter()
const router = useRouter();
const permissionStore = usePermissionStore()
const redirect = ref<string>('')
const loginLoading = ref(false)
const verify = ref()
const captchaType = ref('blockPuzzle') // blockPuzzle 滑块 clickWord 点击文字
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN)
const formLoading = ref(false) // 表单的加载中
const LoginRules = {
  tenantName: [required],
  username: [required],
  password: [required]
}
const loginData = reactive({
  isShowPassword: false,
  captchaEnable: import.meta.env.VITE_APP_CAPTCHA_ENABLE,
  tenantEnable: import.meta.env.VITE_APP_TENANT_ENABLE,
  loginForm: {
    tenantName: '供应链原型平台',
    username: '',
    password: '',
    captchaVerification: '',
    rememberMe: true // 默认记录我。如果不需要，可手动修改
  }
})
const passWordForm = reactive({
  oldPassword: '',
  password: '',
  againPassword: '',
})
const formRef = ref() // 表单 Ref
const dialogVisible = ref(false)
//密码为6位及以上并且大小写字母、数字、特殊字符四项中有三项，才不是弱密码
const strongRegex = new RegExp('^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[a-z])(?=.*\\W))|((?=.*[A-Z])(?=.*[0-9])(?=.*\\W))|((?=.*[a-z])(?=.*[0-9])(?=.*\\W))).*$');
// 表单校验
const equalToPassword2 = (_rule, value, callback) => {
  if (passWordForm.password !== value) {
    callback(new Error(t('profile.password.diffPwd')))
  } else {
    callback()
  }
}
const equalToPassword1 = (_rule, value, callback) => {
  if (!strongRegex.test(passWordForm.password)) {
    callback(new Error('密码需要由 8-20 位数字、大小写字母、特殊符号组成'))
  } else {
    callback()
  }
}
const passRules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: t('profile.password.oldPwdMsg'), trigger: 'blur' },
    { min: 8, max: 20, message: t('profile.password.pwdRules'), trigger: 'blur' }
  ],
  password: [
    // message: t('profile.password.pwdRules'),
    { required: true, message: t('profile.password.newPwdMsg'), trigger: 'blur' },
    { min: 8, max: 20, message: t('profile.password.pwdRules'), trigger: 'blur' },
    { required: true, validator: equalToPassword1, trigger: 'blur' }
  ],
  againPassword: [
    { required: true, message: t('profile.password.cfPwdMsg'), trigger: 'blur' },
    { required: true, validator: equalToPassword2, trigger: 'blur' }
  ]
})

const getCode = async () => {
  // 情况一，未开启：则直接登录
  if (loginData.captchaEnable === 'false') {
    await handleLogin({})
  } else {
    // 情况二，已开启：则展示验证码；只有完成验证码的情况，才进行登录
    // 弹出验证码
    verify.value.show()
  }
}
// 获取租户 ID
const getTenantId = async () => {
  if (loginData.tenantEnable === 'true') {
    const res = await LoginApi.getTenantIdByName(loginData.loginForm.tenantName)
    authUtil.setTenantId(res)
  }
}

// 记住我
const getLoginFormCache = () => {
  const loginForm = authUtil.getLoginForm()
  if (loginForm) {
    loginData.loginForm = {
      ...loginData.loginForm,
      username: loginForm.username ? loginForm.username : loginData.loginForm.username,
      password: loginForm.password ? loginForm.password : loginData.loginForm.password,
      rememberMe: loginForm.rememberMe,
      tenantName: loginForm.tenantName ? loginForm.tenantName : loginData.loginForm.tenantName
    }
  }
}
// 根据域名，获得租户信息
const getTenantByWebsite = async () => {
  const website = location.host
  const res = await LoginApi.getTenantByWebsite(website)
  if (res) {
    loginData.loginForm.tenantName = res.name
    authUtil.setTenantId(res.id)
  }
}
const loading = ref() // ElLoading.service 返回的实例
// 登录
const handleLogin = async (params) => {
  loginLoading.value = true
  try {
    await getTenantId()
    const data = await validForm()
    if (!data) {
      return
    }
    loginData.loginForm.captchaVerification = params.captchaVerification
    const res = await LoginApi.login({
      // 真实服务的登录接口按接口文档接收原始密码；加密仅保留给历史内网版本。
      password: loginData.loginForm.password,
      rememberMe:loginData.loginForm.rememberMe,
      tenantName:loginData.loginForm.tenantName,
      username:loginData.loginForm.username,
      captchaVerification: loginData.loginForm.captchaVerification,
    })
    if (!res) {
      return
    }
    loading.value = ElLoading.service({
      lock: true,
      text: '正在加载系统中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    authUtil.setLoginForm(loginData.loginForm)


    console.log('loginData.loginForm',loginData.loginForm);
    
    // if (loginData.loginForm.rememberMe) {
    //   authUtil.setLoginForm(loginData.loginForm)
    // } else {
    //   authUtil.removeLoginForm()
    // }
    // if(res.firstLoginFlag!==1){
    //   // 退出
    //   loginOut().then(res=>{
    //     removeToken()
    //     deleteUserCache() // 删除用户缓存
    //     ElMessageBox.confirm('检查到您当前密码强度较弱，请您去修改密码', '温馨提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       dialogVisible.value = true;
    //       passWordForm.oldPassword='';
    //       passWordForm.password='';
    //       passWordForm.againPassword='';
    //       formRef.value?.resetFields()
    //     })
    //   })
    // }else{
      authUtil.setToken(res)
      if (!redirect.value) {
        redirect.value = '/'
      }
      // 判断是否为SSO登录
      if (redirect.value.indexOf('sso') !== -1) {
        window.location.href = window.location.href.replace('/login?redirect=', '')
      } else {
        push({ path: redirect.value || permissionStore.addRouters[0].path })
      }
    // }
  } finally {
    loginLoading.value = false
    loading.value?.close()
  }
}
const onSubmit = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true;
  // 提交请求
  try {
    LoginApi.forceUpdateUserPassword(encrypt(passWordForm.oldPassword),encrypt(passWordForm.againPassword),loginData.loginForm.username).then(res=>{
      formLoading.value = false
      message.success('修改密码成功!新密码是' + passWordForm.againPassword)
      // formLogin.value?.resetFields();
      dialogVisible.value = false;

    })
  } finally {
    formLoading.value = false
  }
}
watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)
onMounted(() => {

   loginData.loginForm.username = ''
   loginData.loginForm.password = ''
   formLogin.value?.resetFields();
  getLoginFormCache()
  getTenantByWebsite()
})
</script>

<style lang="scss" scoped>
.loginRow{
  background-image: linear-gradient(179deg, #FFFFFF 0%, #FFFFFF 53%, rgba(255,255,255,0.81) 100%);
  border-radius: 20px;
  width: 430px;
  box-sizing: border-box;
  padding: 20px 30px;
}
:deep.el-input{
  color: #999999 !important;
  .el-input__inner{
    color: #999999 !important;
  }
}
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.login-code {
  float: right;
  width: 100%;
  height: 38px;

  img {
    width: 100%;
    height: auto;
    max-width: 100px;
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>
