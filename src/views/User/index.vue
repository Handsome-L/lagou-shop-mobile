<template>
  <div class="container">
    <div class="header">
      <img :src="userAvatar" alt="">
      <div class="user-info">
        <div class="user-name" v-text="username"></div>
        <div class="user-id" v-text="userID"></div>
      </div>
      <van-icon name="setting-o"></van-icon>
    </div>
    <div class="main">
      <van-cell-group inset class="user-detail">
        <van-cell>
          <van-grid :border="false">
            <van-grid-item :text="collectCount">
              <template #icon>收藏</template>
            </van-grid-item>
            <van-grid-item :text="integral">
              <template #icon>积分</template>
            </van-grid-item>
            <van-grid-item :text="couponCount">
              <template #icon>优惠券</template>
            </van-grid-item>
            <van-grid-item :text="now_money">
              <template #icon>余额</template>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset>
        <van-cell title="订单中心" value="查看全部" is-link to="/order" />
        <van-grid column-num="5" :border="false">
          <van-grid-item
            icon="bill-o"
            text="待付款"
            :to="{
              name: 'order',
              params: {
                val: 0
              }
            }"
          />
          <van-grid-item
            icon="tosend"
            text="代发货"
            :to="{
              name: 'order',
              params: {
                val: 1
              }
            }"
          />
          <van-grid-item
            icon="logistics"
            text="待收货"
            :to="{
              name: 'order',
              params: {
                val: 2
              }
            }"
          />
          <van-grid-item
            icon="comment-o"
            text="待评价"
            :to="{
              name: 'order',
              params: {
                val: 3
              }
            }"
          />
          <van-grid-item
            icon="sign"
            text="已完成"
            :to="{
              name: 'order',
              params: {
                val: 4
              }
            }"
          />
        </van-grid>
      </van-cell-group>
    </div>
  </div>
  <layout-footer></layout-footer>
</template>

<script setup>
import LayoutFooter from '@/components/LayoutFooter.vue'
import { getUserInfo } from '@/api/user'
import { computed, ref } from '@vue/reactivity'

// 数据处理
const userData = ref({})
const userAvatar = computed(() => userData.value?.switchUserInfo?.[0].avatar)
const username = computed(() => userData.value?.nickname || '')
const userID = computed(() => 'ID:' + (userData.value?.uid || ''))
const collectCount = computed(() => userData.value?.collectCount?.toString() || '')
const integral = computed(() => userData.value?.integral?.toString() || '')
const couponCount = computed(() => userData.value?.couponCount?.toString() || '')
const now_money = computed(() => userData.value?.now_money || '')

// 初始化用户数据
const initUserInfo = async () => {
  const { data } = await getUserInfo()
  if (data.status !== 200) { return }
  userData.value = data.data
}
initUserInfo()
</script>

<style lang="scss" scoped>
.container {
  height: 600px;
  padding: 15px 0;
  background-color: #f6f7f9;
  background: radial-gradient(circle at 50% -10%, #FBC546 72%, #F6F7F9 72%) #F6F7F9 0 -300px no-repeat;

  .header {
    display: flex;
    padding: 0 15px 15px;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;

      .user-name {
        font-size: 14px;
        font-weight: 700;
        padding-bottom: 10px;
      }

      .user-id {
        font-size: 10px;
      }
    }
  }

  .van-cell-group {
    margin-bottom: 10px;
  }

  .user-detail {
    .van-cell {
      padding: 0;
      min-width: 74px;
    }
  }
}
</style>
