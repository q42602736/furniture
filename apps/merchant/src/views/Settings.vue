<template>
  <div>
    <h2>店铺设置</h2>
    <p class="text-muted">对应 Metronic 模板：apps/ecommerce/settings.html</p>

    <div class="card mt-4">
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">店铺名称</label>
          <input type="text" class="form-control" placeholder="请输入店铺名称" />
        </div>
        <div class="mb-3">
          <label class="form-label">店铺 Logo</label>
          <input type="file" class="form-control" />
        </div>
        <div class="mb-3">
          <label class="form-label">店铺简介</label>
          <textarea class="form-control" rows="3" placeholder="请输入店铺简介"></textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">联系电话</label>
          <input type="text" class="form-control" placeholder="请输入联系电话" />
        </div>
        <button class="btn btn-primary">保存设置</button>
      </div>
    </div>
  </div>
</template>
