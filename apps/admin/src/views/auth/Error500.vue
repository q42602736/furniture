<template>
  <!--begin::Authentication - 500 -->
  <div class="d-flex flex-column flex-root">
    <div class="d-flex flex-column flex-center flex-column-fluid p-10">
      <!--begin::Illustration-->
      <img
        src="/media/auth/500-error.png"
        class="mw-100 mb-10 h-lg-450px"
        alt="500"
        onerror="this.style.display='none'"
      />
      <!--end::Illustration-->

      <!--begin::Message-->
      <h1 class="fw-bolder mb-10" style="color: #A3A3C7; font-size: 14rem;">
        500
      </h1>
      <!--end::Message-->

      <!--begin::Message-->
      <h1 class="fw-bolder fs-2x text-gray-900 mb-4">系统错误</h1>
      <!--end::Message-->

      <!--begin::Text-->
      <div class="fw-semibold fs-6 text-gray-500 mb-7">
        服务器遇到了意外错误，请稍后重试或联系管理员。
      </div>
      <!--end::Text-->

      <!--begin::Link-->
      <div class="mb-0">
        <router-link to="/dashboard" class="btn btn-sm btn-primary me-3">
          返回首页
        </router-link>
        <button class="btn btn-sm btn-light" @click="$router.go(-1)">
          返回上页
        </button>
      </div>
      <!--end::Link-->
    </div>
  </div>
  <!--end::Authentication - 500 -->
</template>

<script setup lang="ts">
</script>
