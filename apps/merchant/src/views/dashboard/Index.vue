<template>
  <div>
    <h2>数据看板</h2>
    <p class="text-muted">对应 Metronic 模板：dashboards/ecommerce.html</p>

    <!-- 统计卡片 -->
    <div class="row g-4 mt-2">
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <p class="text-muted mb-1">今日订单</p>
            <h3>0</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <p class="text-muted mb-1">今日销售额</p>
            <h3>¥0.00</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <p class="text-muted mb-1">在售商品数</p>
            <h3>0</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <p class="text-muted mb-1">待处理售后</p>
            <h3>0</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表占位 -->
    <div class="card mt-4">
      <div class="card-body" style="height: 300px;">
        <p class="text-muted">销售趋势图表区（待集成 ApexCharts）</p>
      </div>
    </div>
  </div>
</template>
