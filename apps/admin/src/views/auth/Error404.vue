<template>
  <!--begin::Authentication - 404 -->
  <div class="d-flex flex-column flex-root">
    <div class="d-flex flex-column flex-center flex-column-fluid p-10">
      <!--begin::Illustration-->
      <img
        src="/media/auth/404-error.png"
        class="mw-100 mb-10 h-lg-450px"
        alt="404"
        onerror="this.style.display='none'"
      />
      <!--end::Illustration-->

      <!--begin::Message-->
      <h1 class="fw-bolder mb-10" style="color: #A3A3C7; font-size: 14rem;">
        404
      </h1>
      <!--end::Message-->

      <!--begin::Message-->
      <h1 class="fw-bolder fs-2x text-gray-900 mb-4">页面未找到</h1>
      <!--end::Message-->

      <!--begin::Text-->
      <div class="fw-semibold fs-6 text-gray-500 mb-7">
        抱歉，您访问的页面不存在或已被移除。
      </div>
      <!--end::Text-->

      <!--begin::Link-->
      <div class="mb-0">
        <router-link to="/dashboard" class="btn btn-sm btn-primary">
          返回首页
        </router-link>
      </div>
      <!--end::Link-->
    </div>
  </div>
  <!--end::Authentication - 404 -->
</template>

<script setup lang="ts">
</script>
