<template>
  <div>
    <h2>订单列表</h2>
    <p class="text-muted">对应 Metronic 模板：apps/ecommerce/sales/listing.html</p>

    <!-- 筛选栏 -->
    <div class="card mb-4">
      <div class="card-body d-flex gap-3">
        <input type="text" class="form-control" placeholder="搜索订单号..." style="max-width: 300px;" />
        <select class="form-select" style="max-width: 150px;">
          <option>全部状态</option>
          <option>待付款</option>
          <option>待发货</option>
          <option>已发货</option>
          <option>已完成</option>
          <option>已取消</option>
        </select>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="card">
      <div class="card-body">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>订单号</th>
              <th>买家</th>
              <th>商品数</th>
              <th>订单金额</th>
              <th>状态</th>
              <th>下单时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="text-center text-muted py-4">暂无订单数据（待接入后端 API）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
