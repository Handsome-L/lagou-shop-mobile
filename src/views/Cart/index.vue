<template>
  <van-nav-bar
    title="购物车"
    left-arrow
  ></van-nav-bar>
  <div class="cart-list" v-if="hasItem">
    <cart-item
      v-for="item in cartList"
      :key="item.id"
      :itemData="item"
    ></cart-item>
  </div>
  <van-empty v-else description="购物车还没有商品哦~" />
  <van-submit-bar
    @submit="handleClick"
    :price="store.getters['cart/totalPrice'] * 100"
    button-text="去结算"
  >
    <van-checkbox checked-color="#ee0a24" v-model="checkedAll">全选</van-checkbox>
  </van-submit-bar>
  <layout-footer></layout-footer>
</template>

<script setup>
import LayoutFooter from '@/components/LayoutFooter.vue'
import CartItem from './components/CartItem.vue'
import { computed } from '@vue/reactivity'
import { getCartList } from '@/api/cart'
import { useStore } from 'vuex'
import { nextTick } from '@vue/runtime-core'
const store = useStore()

// --- 列表数据处理 ---
// 存储数据
const cartList = computed(() => store.state.cart.cartList)
const hasItem = computed(() => cartList.value.length !== 0)

// 初始化购物车数据
const initCartList = async () => {
  const { data } = await getCartList()
  if (data.status !== 200) { return }
  // 请求到新数据后，将原始数据清空，随后更新为新数据
  store.commit('cart/clear')

  await nextTick()
  
  // 数据处理，将处理后需要的数据通过 Vuex 进行状态管理
  data.data.valid.forEach(item => {
    // 提交给 addToCart 的数据必须符合要求： sku 的 id, checked, count, image, title, price, stock
    store.commit('cart/addToCart', {
      id: item.id,
      checked: true,
      count: item.cart_num,
      image: item.productInfo.image,
      title: item.productInfo.store_name,
      price: item.truePrice,
      stock: item.trueStock,
      productId: item.product_id
    })
  })
}
initCartList()

const checkedAll = computed({
  get: () => store.getters['cart/checkedAll'],
  set (newStatus) {
    store.commit('cart/checkedAll', { checked: newStatus })
  }
})

import { useRouter } from 'vue-router'
const router = useRouter()
const handleClick = () => {
  router.push({
    name: 'order-confirm',
    params: {
      // cartId 指的是要结算的所有 sku 的集合，以逗号连接后传递即可
      cartId: store.getters['cart/checkedItems'].map(item => item.id).toString()
    }
  })
}
</script>

<style lang="scss" scoped>
.van-nav-bar {
  position: fixed !important;
  width: 100%;
  top: 0;
}

.cart-list {
  margin: 50px 0 100px;
  background-color: #f2f2f2;
}

.van-submit-bar {
  bottom: 48px;
}
</style>
