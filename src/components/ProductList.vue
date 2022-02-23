<template>
  <van-grid
    class="product-list"
    :column-num="2"
    :gutter="15"
    :center="false"
    :border="false"
  >
    <van-grid-item
      v-for="item in productsData"
      :key="item.id"
      :to="{
        name: 'product',
        params: {
          productId: item.id
        }
      }"
    >
      <van-image
        :src="item.image"
        height="165"
      ></van-image>
      <p
        class="title"
        v-text="item.store_name"
      ></p>
      <p class="price">{{ item.price }}</p>
      <p class="sales">已售{{ item.sales }}件</p>
    </van-grid-item>
  </van-grid>
</template>

<script setup>
// 接收父组件传递的数据，并进行解构使用
const { productsData } = defineProps({
  productsData: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.product-list {
  padding: 10px 0;

  :deep(.van-grid-item__content) {
    border-radius: 10px;
    overflow: hidden;
    padding: 0;
    margin-bottom: 10px;
  }

  .title {
    font-size: 14px;
    padding: 5px 8px 0;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .price {
    color: #ee3e3e;
    font-size: 22px;
    font-weight: 700;
    padding-left: 6px;
  }

  .sales {
    color: #ccc;
    font-size: 14px;
    padding-left: 8px;
  }
}
</style>
