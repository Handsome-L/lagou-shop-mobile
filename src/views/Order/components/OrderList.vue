<template>
  <div class="order-list">
    <div class="link" @click="handleRouter">
      <img :src="productInfo?.image" alt="">
      <div class="info">
        <p class="title" v-text="productInfo?.store_name"></p>
        <p class="detail">
          <span class="price">订单价格：￥{{ itemData?.pay_price }}</span>
          <span class="num">数量：{{ itemData?.cartInfo[0]?.cart_num }}</span>
        </p>
        <p class="next" v-text="nextData"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from '@vue/reactivity';

const { itemData } = defineProps({
  itemData: {
    type: Object,
    required: true
  }
})

const productInfo = computed(() => itemData?.cartInfo[0].productInfo)

const nextData = ref('')

if (itemData._status._type === 0) {
  nextData.value = '去付款'
} else if (itemData._status._type === 1) {
  nextData.value = '去催单'
} else if (itemData._status._type === 2) {
  nextData.value = '查物流'
} else if (itemData._status._type === 3) {
  nextData.value = '去评价'
} else if (itemData._status._type === 1) {
  nextData.value = '已完成'
}
</script>

<style lang="scss" scoped>
.order-list {
  display: flex;
  height: 90px;
  padding: 10px 20px;
  background-color: #fff;
  margin-bottom: 1px;

  .link {
    width: 100%;
    height: 100px;
    display: flex;
    border-bottom: 1px solid #f2f2f2;
    margin-bottom: 10px;

    img {
      width: 88px;
      height: 88px;
      align-self: center;
    }

    .info {
      flex: 1;
      font-size: 14px;

      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        margin: 5px 0 15px;
      }

      .detail {
        margin-bottom: 10px;

        .price {
          font-size: 16px;
          color: #f2270c;
        }

        .num {
          display: block;
          float: right;
        }
      }

      .next {
        float: right;
        width: 55px;
        background-color: #f2270c;
        border-radius: 10px;
        color: #fff;
        text-align: center;
        vertical-align: center;
      }
    }
  }
}
</style>