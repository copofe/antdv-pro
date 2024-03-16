<script setup lang="ts">
import { AlipayCircleFilled, LockOutlined, MobileOutlined, TaobaoCircleFilled, UserOutlined, WeiboCircleFilled } from '@ant-design/icons-vue'
import GlobalLayoutFooter from '::/view/layouts/components/global-footer/index.vue'
import { getQueryParam } from '::/view/utils/tools'
import type { LoginMobileParams, LoginParams } from '::/entities/user.model'
import { userAuthUsecase } from '::/usecases/user'
import { useAsyncFunc } from '::/view/composables/useAsyncFunc'
import { generateDynamicRoutes } from '::/view/router/generate-route'

const message = useMessage()
const notification = useNotification()
const appStore = useAppStore()
const userStore = useUserStore()
const { layoutSetting } = storeToRefs(appStore)
const router = useRouter()
const loginModel = reactive({
  username: undefined,
  password: undefined,
  mobile: undefined,
  code: undefined,
  type: 'account',
  remember: true,
})
const { t } = useI18nLocale()
const formRef = shallowRef()
const codeLoading = shallowRef(false)
const resetCounter = 60
const { counter, pause, reset, resume, isActive } = useInterval(1000, {
  controls: true,
  immediate: false,
  callback(count) {
    if (count) {
      if (count === resetCounter)
        pause()
    }
  },
})
async function getCode() {
  codeLoading.value = true
  try {
    await formRef.value.validate(['mobile'])
    setTimeout(() => {
      reset()
      resume()
      codeLoading.value = false
      message.success('验证码是：123456')
    }, 3000)
  }
  catch (error) {
    codeLoading.value = false
  }
}

async function submit() {
  let params: LoginParams | LoginMobileParams

  if (loginModel.type === 'account') {
    params = {
      username: loginModel.username,
      password: loginModel.password,
    } as unknown as LoginParams
  }
  else {
    params = {
      mobile: loginModel.mobile,
      code: loginModel.code,
      type: 'mobile',
    } as unknown as LoginMobileParams
  }
  try {
    const { user } = await userAuthUsecase.login(params)
    userStore.userInfo = user
    const { menuData, routerData } = await generateDynamicRoutes()
    userStore.menuData = menuData
    userStore.routerData = routerData
    // 获取当前是否存在重定向的链接，如果存在就走重定向的地址
    const redirect = getQueryParam('redirect', '/')
    router.replace({
      path: redirect,
    }).then(() => {
      notification.success({
        message: '登录成功',
        description: '欢迎回来！',
        duration: 3,
      })
    })
  }
  catch (error: any) {
    notification.error({
      message: error.message,
    })
  }
}

const { isLoading, run } = useAsyncFunc(submit)
</script>

<template>
  <div class="login-container">
    <div class="flex justify-center items-center">
      <div class="ant-pro-form-login-main rounded bg-white dark:bg-black">
        <!-- 登录头部 -->
        <div
          class="flex justify-between items-center p-4 mb-0.5"
        >
          <div class="flex items-center">
            <span class="ant-pro-form-login-logo">
              <img class="w-full h-full object-cover" src="/logo.svg">
            </span>
            <span class="ant-pro-form-login-title">
              Antdv Pro
            </span>
            <span class="ant-pro-form-login-desc self-end">
              {{ t("pages.layouts.userLayout.title") }}
            </span>
          </div>
          <div class="login-lang flex justify-center items-center gap-4 relative z-11 text-lg">
            <span
              class="flex justify-center items-center cursor-pointer"
              @click="appStore.toggleTheme(layoutSetting.theme === 'dark' ? 'light' : 'dark')"
            >
              <!-- 亮色和暗黑模式切换按钮 -->
              <template v-if="layoutSetting.theme === 'light'">
                <carbon-moon />
              </template>
              <template v-else>
                <carbon-sun />
              </template>
            </span>
            <a-dropdown>
              <span hover="bg-[var(--hover-color)]" class="transition-all-300 flex items-center h-12 cursor-pointer">
                <CarbonLanguage class="anticon" />
              </span>
              <template #overlay>
                <SelectLang />
              </template>
            </a-dropdown>
          </div>
        </div>
        <a-divider class="!m-0" />
        <!-- 登录主体 -->
        <div class="box-border flex min-h-[520px]">
          <!-- 登录框左侧 -->
          <div class="ant-pro-form-login-main-left min-h-[520px] flex justify-center items-center">
            <img src="::/view/assets/images/login-left.png" class="h-5/6 w-5/6">
          </div>
          <a-divider type="vertical" class="ant-pro-login-divider m-0 min-h-[520px]" />
          <!-- 登录框右侧 -->
          <div class="ant-pro-form-login-main-right px-5 w-[335px] flex justify-center items-center flex-col relative z-11">
            <div class="text-center py-6 text-2xl">
              {{ t('pages.login.tips') }}
            </div>
            <a-tabs v-model:activeKey="loginModel.type" centered>
              <a-tab-pane key="account" :tab="t('pages.login.accountLogin.tab')" />
              <a-tab-pane key="mobile" :tab="t('pages.login.phoneLogin.tab')" />
            </a-tabs>
            <a-form
              ref="formRef" :model="loginModel" :rules="loginModel.type === 'account' ? {
                username: [{ required: true, message: t('pages.login.username.required') }],
                password: [{ required: true, message: t('pages.login.password.required') }],
              } : {
                mobile: [
                  { required: true, message: t('pages.login.phoneNumber.required') },
                  {
                    pattern: /^(86)?1([38][0-9]|4[579]|5[0-35-9]|6[6]|7[0135678]|9[89])[0-9]{8}$/,
                    message: t('pages.login.phoneNumber.invalid'),
                  },
                ],
                code: [{ required: true, message: t('pages.login.captcha.required') }],
              }" @submit="run"
            >
              <template v-if="loginModel.type === 'account'">
                <a-form-item name="username">
                  <a-input
                    v-model:value="loginModel.username" allow-clear
                    autocomplete="off"
                    :placeholder="t('pages.login.username.placeholder')" size="large"
                  >
                    <template #prefix>
                      <UserOutlined />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="password">
                  <a-input-password
                    v-model:value="loginModel.password" allow-clear
                    :placeholder="t('pages.login.password.placeholder')" size="large"
                  >
                    <template #prefix>
                      <LockOutlined />
                    </template>
                  </a-input-password>
                </a-form-item>
              </template>
              <template v-if="loginModel.type === 'mobile'">
                <a-form-item
                  name="mobile"
                >
                  <a-input
                    v-model:value="loginModel.mobile" allow-clear
                    :placeholder="t('pages.login.phoneNumber.placeholder')" size="large"
                  >
                    <template #prefix>
                      <MobileOutlined />
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="code">
                  <div class="flex items-center">
                    <a-input
                      v-model:value="loginModel.code"
                      style="flex: 1 1 0%; transition: width 0.3s ease 0s; margin-right: 8px;" allow-clear
                      :placeholder="t('pages.login.captcha.placeholder')" size="large"
                    >
                      <template #prefix>
                        <LockOutlined />
                      </template>
                    </a-input>
                    <a-button :loading="codeLoading" :disabled="isActive" size="large" @click="getCode">
                      <template v-if="!isActive">
                        {{ t('pages.login.phoneLogin.getVerificationCode') }}
                      </template>
                      <template v-else>
                        {{ resetCounter - counter }} {{ t('pages.getCaptchaSecondText') }}
                      </template>
                    </a-button>
                  </div>
                </a-form-item>
              </template>
              <div class="mb-6 flex-between">
                <a-checkbox v-model:checked="loginModel.remember">
                  {{ t('pages.login.rememberMe') }}
                </a-checkbox>
                <a>{{ t('pages.login.forgotPassword') }}</a>
              </div>
              <a-button type="primary" block :loading="isLoading" size="large" html-type="submit">
                {{ t('pages.login.submit') }}
              </a-button>
            </a-form>
            <a-divider>
              <span class="text-slate-500">{{ t('pages.login.loginWith') }}</span>
            </a-divider>
            <div class="ant-pro-form-login-other">
              <AlipayCircleFilled class="icon" />
              <TaobaoCircleFilled class="icon" />
              <WeiboCircleFilled class="icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div :data-theme="layoutSetting.theme" class="py-6 px-12 fixed bottom-0 z-11 w-screen text-sm">
      <GlobalLayoutFooter
        :copyright="layoutSetting.copyright" icp="鲁ICP备2023021414号-2"
      >
        <template #renderFooterLinks>
          <footer-links />
        </template>
      </GlobalLayoutFooter>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  overflow: auto;
  background: var(--bg-color-container);
}

.login-lang {
  height: 40px;
  line-height: 44px;
}

.ant-pro-form-login-container {
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  padding: 32px 0;
  overflow: auto;
  background: inherit
}

.ant-pro-form-login-header a {
  text-decoration: none
}

.ant-pro-form-login-title {
  color: var(--text-color);
  font-weight: 600;
  font-size: 33px;
  line-height: 1;
}

.ant-pro-form-login-logo {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  vertical-align: top
}

.ant-pro-form-login-desc {
  color: var(--text-color-1);
  font-size: 14px;
  margin-left: 16px
}

.ant-pro-form-login-main-right {
  .ant-tabs-nav-list {
    margin: 0 auto;
    font-size: 16px;
  }

  .ant-pro-form-login-other {
    line-height: 22px;
    text-align: center
  }

}

.ant-pro-form-login-main{
  box-shadow: var(--c-shadow);
}

.icon {
  margin-left: 8px;
  color: var(--text-color-2);
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
  transition: color .3s;

  &:hover {
    color: var(--pro-ant-color-primary);
  }
}
.login-media(@width:100%) {
  .ant-pro-form-login-main{
    width: @width;
  }
  .ant-pro-form-login-main-left{
    display: none;
  }
  .ant-pro-form-login-main-right{
    width: 100%;
  }
  .ant-pro-form-login-desc{
    display: none;
  }
}
@media (min-width : 992px) {
  .ant-pro-form-login-main-left{
    width: 700px;
  }
}
@media(min-width:768px) and (max-width:991px){
  .ant-pro-login-divider{
    display: none;
  }
  .login-media(400px)
}
@media screen and (max-width:767px) {
  .login-media(350px);

  .ant-pro-login-divider{
    display: none;
  }
}
</style>
