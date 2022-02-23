<template>
  <van-tabs v-model:active="active">
    <van-tab title="待付款">
      <van-empty v-if="paid.length === 0" description="快去购买商品吧~" />
      <order-list
        v-for="item in paid"
        :key="item.id"
        :item-data="item"
      ></order-list>
    </van-tab>
    <van-tab title="待发货">
      <van-empty v-if="shipped.length === 0" description="快去购买商品吧~" />
      <order-list
        v-for="item in shipped"
        :key="item.id"
        :item-data="item"
      ></order-list>
    </van-tab>
    <van-tab title="待收货">
      <van-empty v-if="received.length === 0" description="快去购买商品吧~" />
      <order-list
        v-for="item in received"
        :key="item.id"
        :item-data="item"
      ></order-list>
    </van-tab>
    <van-tab title="待评价">
      <van-empty v-if="evaluated.length === 0" description="快去购买商品吧~" />
      <order-list
        v-for="item in evaluated"
        :key="item.id"
        :item-data="item"
      ></order-list>
    </van-tab>
    <van-tab title="已完成">
      <van-empty v-if="completed.length === 0" description="快去购买商品吧~" />
      <order-list
        v-for="item in completed"
        :key="item.id"
        :item-data="item"
      ></order-list>
    </van-tab>
  </van-tabs>
</template>

<script setup>
const { val } = defineProps({
  val: String
})

import { computed, ref } from '@vue/reactivity'
import OrderList from './components/OrderList.vue'
import { getOrderList } from '@/api/order'

const active = ref(parseInt(val) || 0)
const orderList = ref([])

const initOrderList = async () => {
  const { data } = await getOrderList()
  if (data.status !== 200) return
  orderList.value = data.data
  console.log(orderList.value)
}
initOrderList()

const paid = computed(() => orderList.value.filter(item => item._status._type === 0))
const shipped = computed(() => orderList.value.filter(item => item._status._type === 1))
const received = computed(() => orderList.value.filter(item => item._status._type === 2))
const evaluated = computed(() => orderList.value.filter(item => item._status._type === 3))
const completed = computed(() => orderList.value.filter(item => item._status._type === 4))
</script>
