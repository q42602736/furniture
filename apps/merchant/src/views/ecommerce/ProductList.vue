<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>商品列表</h2>
      <router-link to="/products/add" class="btn btn-primary">发布商品</router-link>
    </div>
    <p class="text-muted">对应 Metronic 模板：apps/ecommerce/catalog/products.html</p>

    <!-- 搜索与筛选 -->
    <div class="card mb-4">
      <div class="card-body d-flex gap-3">
        <input type="text" class="form-control" placeholder="搜索商品名称..." style="max-width: 300px;" />
        <select class="form-select" style="max-width: 200px;">
          <option>全部分类</option>
        </select>
        <select class="form-select" style="max-width: 150px;">
          <option>全部状态</option>
          <option>在售</option>
          <option>已下架</option>
        </select>
      </div>
    </div>

    <!-- 商品表格 -->
    <div class="card">
      <div class="card-body">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>商品图片</th>
              <th>商品名称</th>
              <th>分类</th>
              <th>价格</th>
              <th>库存</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="7" class="text-center text-muted py-4">暂无商品数据（待接入后端 API）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
