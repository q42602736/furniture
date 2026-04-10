<template>
  <div>
    <h2>发布商品</h2>
    <p class="text-muted">对应 Metronic 模板：apps/ecommerce/catalog/add-product.html</p>

    <div class="row mt-4">
      <div class="col-md-8">
        <!-- 基本信息 -->
        <div class="card mb-4">
          <div class="card-header"><h5 class="mb-0">基本信息</h5></div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">商品名称</label>
              <input type="text" class="form-control" placeholder="请输入商品名称" />
            </div>
            <div class="mb-3">
              <label class="form-label">商品描述</label>
              <textarea class="form-control" rows="4" placeholder="请输入商品描述"></textarea>
            </div>
          </div>
        </div>

        <!-- 商品图片 -->
        <div class="card mb-4">
          <div class="card-header"><h5 class="mb-0">商品图片</h5></div>
          <div class="card-body">
            <p class="text-muted">图片上传区（待集成 Dropzone）</p>
          </div>
        </div>

        <!-- 商品详情 -->
        <div class="card mb-4">
          <div class="card-header"><h5 class="mb-0">商品详情</h5></div>
          <div class="card-body">
            <p class="text-muted">富文本编辑器区（待集成 TinyMCE / Quill）</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <!-- 分类与品牌 -->
        <div class="card mb-4">
          <div class="card-header"><h5 class="mb-0">分类与品牌</h5></div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">商品分类</label>
              <select class="form-select">
                <option>请选择分类</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">品牌</label>
              <select class="form-select">
                <option>请选择品牌</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 价格与库存 -->
        <div class="card mb-4">
          <div class="card-header"><h5 class="mb-0">价格与库存</h5></div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">售价（元）</label>
              <input type="number" class="form-control" placeholder="0.00" />
            </div>
            <div class="mb-3">
              <label class="form-label">库存数量</label>
              <input type="number" class="form-control" placeholder="0" />
            </div>
          </div>
        </div>

        <!-- 发布操作 -->
        <div class="card">
          <div class="card-body d-grid gap-2">
            <button class="btn btn-primary">发布商品</button>
            <button class="btn btn-outline-secondary">保存草稿</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
