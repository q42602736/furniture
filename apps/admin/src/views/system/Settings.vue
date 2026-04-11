<template>
  <div>
    <!--begin::导航标签-->
    <ul class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8">
      <li class="nav-item">
        <a
          class="nav-link text-active-primary pb-4"
          :class="{ active: activeTab === 'profile' }"
          href="javascript:;"
          @click="activeTab = 'profile'"
        >
          <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
          管理员信息
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link text-active-primary pb-4"
          :class="{ active: activeTab === 'password' }"
          href="javascript:;"
          @click="activeTab = 'password'"
        >
          <KTIcon icon-name="lock-2" icon-class="fs-4 me-1" />
          修改密码
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link text-active-primary pb-4"
          :class="{ active: activeTab === 'payment' }"
          href="javascript:;"
          @click="switchTab('payment')"
        >
          <KTIcon icon-name="wallet" icon-class="fs-4 me-1" />
          支付配置
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link text-active-primary pb-4"
          :class="{ active: activeTab === 'shipping' }"
          href="javascript:;"
          @click="switchTab('shipping')"
        >
          <KTIcon icon-name="delivery" icon-class="fs-4 me-1" />
          物流配置
        </a>
      </li>
    </ul>
    <!--end::导航标签-->

    <!--begin::管理员信息-->
    <div v-show="activeTab === 'profile'" class="card card-flush">
      <div class="card-header">
        <div class="card-title">
          <h3 class="fw-bold m-0">管理员资料</h3>
        </div>
      </div>
      <div class="card-body pt-2">
        <div class="d-flex align-items-center mb-8">
          <div class="symbol symbol-60px me-5">
            <span class="symbol-label bg-light-primary fs-1 fw-bold text-primary">
              {{ (authStore.user?.username || 'A')[0].toUpperCase() }}
            </span>
          </div>
          <div>
            <span class="text-gray-800 fs-3 fw-bold">{{ authStore.user?.realName || authStore.user?.username }}</span>
            <div class="text-muted fs-7">{{ authStore.user?.role === 'superadmin' ? '超级管理员' : '管理员' }}</div>
          </div>
        </div>
        <div class="separator my-5"></div>
        <div class="row mb-5">
          <label class="col-lg-4 col-form-label fw-semibold text-muted fs-6">账号</label>
          <div class="col-lg-8">
            <span class="fw-bold fs-6 text-gray-800">{{ authStore.user?.username }}</span>
          </div>
        </div>
        <div class="row mb-5">
          <label class="col-lg-4 col-form-label fw-semibold text-muted fs-6">姓名</label>
          <div class="col-lg-8">
            <span class="fw-bold fs-6 text-gray-800">{{ authStore.user?.realName || '-' }}</span>
          </div>
        </div>
        <div class="row mb-5">
          <label class="col-lg-4 col-form-label fw-semibold text-muted fs-6">角色</label>
          <div class="col-lg-8">
            <span class="badge badge-light-primary fs-7 fw-semibold">{{ authStore.user?.role }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--end::管理员信息-->

    <!--begin::修改密码-->
    <div v-show="activeTab === 'password'" class="card card-flush">
      <div class="card-header">
        <div class="card-title">
          <h3 class="fw-bold m-0">修改密码</h3>
        </div>
      </div>
      <div class="card-body pt-2">
        <div class="mw-450px">
          <div class="mb-5">
            <label class="form-label required fw-semibold fs-6">原密码</label>
            <input v-model="pwdForm.oldPassword" type="password" class="form-control form-control-solid" />
          </div>
          <div class="mb-5">
            <label class="form-label required fw-semibold fs-6">新密码</label>
            <input v-model="pwdForm.newPassword" type="password" class="form-control form-control-solid" />
            <div class="form-text">密码至少 6 位字符</div>
          </div>
          <div class="mb-5">
            <label class="form-label required fw-semibold fs-6">确认新密码</label>
            <input v-model="pwdForm.confirmPassword" type="password" class="form-control form-control-solid" />
          </div>
          <!--begin::提示消息-->
          <div v-if="pwdError" class="alert alert-danger d-flex align-items-center p-5 mb-5">
            <KTIcon icon-name="information-5" icon-class="fs-2hx text-danger me-4" />
            <div class="d-flex flex-column">
              <span>{{ pwdError }}</span>
            </div>
          </div>
          <div v-if="pwdSuccess" class="alert alert-success d-flex align-items-center p-5 mb-5">
            <KTIcon icon-name="check-circle" icon-class="fs-2hx text-success me-4" />
            <div class="d-flex flex-column">
              <span>{{ pwdSuccess }}</span>
            </div>
          </div>
          <!--end::提示消息-->
          <div class="d-flex gap-3">
            <button class="btn btn-primary" :disabled="pwdSaving" @click="changePassword">
              <span v-if="pwdSaving" class="spinner-border spinner-border-sm align-middle me-1"></span>
              {{ pwdSaving ? '修改中...' : '修改密码' }}
            </button>
            <button class="btn btn-light" @click="resetPwdForm">重置</button>
          </div>
        </div>
      </div>
    </div>
    <!--end::修改密码-->

    <!--begin::支付配置-->
    <div v-show="activeTab === 'payment'" class="card card-flush">
      <div class="card-header">
        <div class="card-title">
          <h3 class="fw-bold m-0">支付配置</h3>
        </div>
      </div>
      <div class="card-body pt-2">
        <div v-if="configLoading" class="d-flex justify-content-center py-10">
          <span class="spinner-border text-primary"></span>
        </div>
        <div v-else>
          <!--begin::微信支付-->
          <h4 class="fw-bold text-gray-800 mb-5">
            <span class="bullet bullet-dot bg-success me-2 h-10px w-10px"></span>
            微信支付
          </h4>
          <div class="row mb-5">
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">AppID</label>
              <input v-model="paymentForm.wechat_app_id" type="text" class="form-control form-control-solid" placeholder="微信公众号/小程序 AppID" />
            </div>
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">商户号 (MchID)</label>
              <input v-model="paymentForm.wechat_mch_id" type="text" class="form-control form-control-solid" placeholder="微信支付商户号" />
            </div>
          </div>
          <div class="row mb-5">
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">API 密钥</label>
              <input v-model="paymentForm.wechat_api_key" type="password" class="form-control form-control-solid" placeholder="APIv3 密钥" />
            </div>
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">启用状态</label>
              <div class="form-check form-switch form-check-custom form-check-solid mt-2">
                <input v-model="paymentForm.wechat_enabled" class="form-check-input h-25px w-45px" type="checkbox" />
                <label class="form-check-label fw-semibold text-muted ms-3">{{ paymentForm.wechat_enabled ? '已启用' : '未启用' }}</label>
              </div>
            </div>
          </div>

          <div class="separator my-8"></div>

          <!--begin::支付宝-->
          <h4 class="fw-bold text-gray-800 mb-5">
            <span class="bullet bullet-dot bg-primary me-2 h-10px w-10px"></span>
            支付宝
          </h4>
          <div class="row mb-5">
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">AppID</label>
              <input v-model="paymentForm.alipay_app_id" type="text" class="form-control form-control-solid" placeholder="支付宝应用 AppID" />
            </div>
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">启用状态</label>
              <div class="form-check form-switch form-check-custom form-check-solid mt-2">
                <input v-model="paymentForm.alipay_enabled" class="form-check-input h-25px w-45px" type="checkbox" />
                <label class="form-check-label fw-semibold text-muted ms-3">{{ paymentForm.alipay_enabled ? '已启用' : '未启用' }}</label>
              </div>
            </div>
          </div>
          <div class="row mb-5">
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">应用私钥</label>
              <textarea v-model="paymentForm.alipay_private_key" class="form-control form-control-solid" rows="3" placeholder="RSA2 应用私钥"></textarea>
            </div>
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">支付宝公钥</label>
              <textarea v-model="paymentForm.alipay_public_key" class="form-control form-control-solid" rows="3" placeholder="支付宝公钥"></textarea>
            </div>
          </div>

          <!--begin::提示消息-->
          <div v-if="configMsg" class="alert d-flex align-items-center p-5 mb-5" :class="configMsgType === 'success' ? 'alert-success' : 'alert-danger'">
            <KTIcon :icon-name="configMsgType === 'success' ? 'check-circle' : 'information-5'" :icon-class="'fs-2hx me-4 ' + (configMsgType === 'success' ? 'text-success' : 'text-danger')" />
            <div class="d-flex flex-column"><span>{{ configMsg }}</span></div>
          </div>
          <!--end::提示消息-->

          <div class="d-flex gap-3">
            <button class="btn btn-primary" :disabled="configSaving" @click="savePaymentConfig">
              <span v-if="configSaving" class="spinner-border spinner-border-sm align-middle me-1"></span>
              {{ configSaving ? '保存中...' : '保存配置' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end::支付配置-->

    <!--begin::物流配置-->
    <div v-show="activeTab === 'shipping'" class="card card-flush">
      <div class="card-header">
        <div class="card-title">
          <h3 class="fw-bold m-0">物流配置</h3>
        </div>
      </div>
      <div class="card-body pt-2">
        <div v-if="configLoading" class="d-flex justify-content-center py-10">
          <span class="spinner-border text-primary"></span>
        </div>
        <div v-else class="mw-650px">
          <div class="mb-5">
            <label class="form-label fw-semibold fs-6">默认物流公司</label>
            <select v-model="shippingForm.default_company" class="form-select form-select-solid">
              <option value="">请选择</option>
              <option value="sf">顺丰速运</option>
              <option value="yt">圆通速递</option>
              <option value="zt">中通快递</option>
              <option value="sto">申通快递</option>
              <option value="yunda">韵达速递</option>
              <option value="jd">京东物流</option>
              <option value="ems">中国邮政EMS</option>
              <option value="other">其他</option>
            </select>
          </div>
          <div class="row mb-5">
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">默认运费（元）</label>
              <input v-model.number="shippingForm.default_fee" type="number" min="0" step="0.01" class="form-control form-control-solid" placeholder="如 10.00" />
              <div class="form-text">下单时的默认运费</div>
            </div>
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">免运费门槛（元）</label>
              <input v-model.number="shippingForm.free_threshold" type="number" min="0" step="0.01" class="form-control form-control-solid" placeholder="如 99.00" />
              <div class="form-text">订单金额达到此值免运费，设为 0 表示不免运费</div>
            </div>
          </div>

          <div class="separator my-5"></div>
          <h5 class="fw-bold text-gray-800 mb-5">发货地址</h5>

          <div class="row mb-5">
            <div class="col-lg-4 mb-5">
              <label class="form-label fw-semibold fs-6">省份</label>
              <input v-model="shippingForm.sender_province" type="text" class="form-control form-control-solid" placeholder="如 广东省" />
            </div>
            <div class="col-lg-4 mb-5">
              <label class="form-label fw-semibold fs-6">城市</label>
              <input v-model="shippingForm.sender_city" type="text" class="form-control form-control-solid" placeholder="如 深圳市" />
            </div>
            <div class="col-lg-4 mb-5">
              <label class="form-label fw-semibold fs-6">区县</label>
              <input v-model="shippingForm.sender_district" type="text" class="form-control form-control-solid" placeholder="如 南山区" />
            </div>
          </div>
          <div class="mb-5">
            <label class="form-label fw-semibold fs-6">详细地址</label>
            <input v-model="shippingForm.sender_address" type="text" class="form-control form-control-solid" placeholder="街道/门牌号" />
          </div>
          <div class="row mb-5">
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">联系人</label>
              <input v-model="shippingForm.sender_name" type="text" class="form-control form-control-solid" placeholder="发货联系人姓名" />
            </div>
            <div class="col-lg-6 mb-5">
              <label class="form-label fw-semibold fs-6">联系电话</label>
              <input v-model="shippingForm.sender_phone" type="text" class="form-control form-control-solid" placeholder="发货联系电话" />
            </div>
          </div>

          <!--begin::提示消息-->
          <div v-if="configMsg" class="alert d-flex align-items-center p-5 mb-5" :class="configMsgType === 'success' ? 'alert-success' : 'alert-danger'">
            <KTIcon :icon-name="configMsgType === 'success' ? 'check-circle' : 'information-5'" :icon-class="'fs-2hx me-4 ' + (configMsgType === 'success' ? 'text-success' : 'text-danger')" />
            <div class="d-flex flex-column"><span>{{ configMsg }}</span></div>
          </div>
          <!--end::提示消息-->

          <div class="d-flex gap-3">
            <button class="btn btn-primary" :disabled="configSaving" @click="saveShippingConfig">
              <span v-if="configSaving" class="spinner-border spinner-border-sm align-middle me-1"></span>
              {{ configSaving ? '保存中...' : '保存配置' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <!--end::物流配置-->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/core/api'

const authStore = useAuthStore()
const activeTab = ref('profile')

// ========== 修改密码 ==========
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwdSaving = ref(false)
const pwdError = ref('')
const pwdSuccess = ref('')

function resetPwdForm() {
  Object.assign(pwdForm, { oldPassword: '', newPassword: '', confirmPassword: '' })
  pwdError.value = ''
  pwdSuccess.value = ''
}

async function changePassword() {
  pwdError.value = ''
  pwdSuccess.value = ''

  if (!pwdForm.oldPassword || !pwdForm.newPassword) {
    pwdError.value = '请填写完整'
    return
  }
  if (pwdForm.newPassword.length < 6) {
    pwdError.value = '新密码至少6位'
    return
  }
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    pwdError.value = '两次密码不一致'
    return
  }

  pwdSaving.value = true
  try {
    await api.put('/admin-auth/password', {
      oldPassword: pwdForm.oldPassword,
      newPassword: pwdForm.newPassword,
    })
    pwdSuccess.value = '密码修改成功'
    Object.assign(pwdForm, { oldPassword: '', newPassword: '', confirmPassword: '' })
  } catch (err: any) {
    pwdError.value = err.message || '修改失败'
  } finally {
    pwdSaving.value = false
  }
}

// ========== 系统配置（支付 & 物流） ==========
const configLoading = ref(false)
const configSaving = ref(false)
const configMsg = ref('')
const configMsgType = ref<'success' | 'error'>('success')
let configLoaded = false

const paymentForm = reactive({
  wechat_app_id: '',
  wechat_mch_id: '',
  wechat_api_key: '',
  wechat_enabled: false,
  alipay_app_id: '',
  alipay_private_key: '',
  alipay_public_key: '',
  alipay_enabled: false,
})

const shippingForm = reactive({
  default_company: '',
  default_fee: 0,
  free_threshold: 0,
  sender_province: '',
  sender_city: '',
  sender_district: '',
  sender_address: '',
  sender_name: '',
  sender_phone: '',
})

function switchTab(tab: string) {
  activeTab.value = tab
  configMsg.value = ''
  if (!configLoaded && (tab === 'payment' || tab === 'shipping')) {
    loadConfigs()
  }
}

async function loadConfigs() {
  configLoading.value = true
  try {
    const res: any = await api.get('/admin/settings')
    const data = res.data || {}
    // 填充支付配置
    if (data.payment) {
      Object.keys(paymentForm).forEach((k) => {
        if (k in data.payment) (paymentForm as any)[k] = data.payment[k]
      })
    }
    // 填充物流配置
    if (data.shipping) {
      Object.keys(shippingForm).forEach((k) => {
        if (k in data.shipping) (shippingForm as any)[k] = data.shipping[k]
      })
    }
    configLoaded = true
  } catch {
    // 第一次加载可能没有数据，忽略
  } finally {
    configLoading.value = false
  }
}

async function savePaymentConfig() {
  configMsg.value = ''
  configSaving.value = true
  try {
    await api.put('/admin/settings/payment', { ...paymentForm })
    configMsg.value = '支付配置保存成功'
    configMsgType.value = 'success'
  } catch (err: any) {
    configMsg.value = err.message || '保存失败'
    configMsgType.value = 'error'
  } finally {
    configSaving.value = false
  }
}

async function saveShippingConfig() {
  configMsg.value = ''
  configSaving.value = true
  try {
    await api.put('/admin/settings/shipping', { ...shippingForm })
    configMsg.value = '物流配置保存成功'
    configMsgType.value = 'success'
  } catch (err: any) {
    configMsg.value = err.message || '保存失败'
    configMsgType.value = 'error'
  } finally {
    configSaving.value = false
  }
}
</script>
