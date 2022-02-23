<template>
  <van-nav-bar
    fixed
    left-arrow
  />
  <van-tabs scrollspy color="#fbc546">
    <van-tab title="商品">
      <van-swipe :autoplay="3000" width="375" height="375">
        <van-swipe-item
          v-for="(item,index) in sliderImage"
          :key="index"
        >
          <img :src="item" alt="">
        </van-swipe-item>
      </van-swipe>
      <!-- 商品头部 -->
      <van-cell
        class="productHeader"
        :border="false"
      >
        <template #title>
          <div class="price">
            <span>￥{{ storeInfo?.price }}</span>
            <van-icon name="share-o" size="20" class="share"></van-icon>
          </div>
          <div class="title" v-text="storeInfo?.store_name"></div>
        </template>
        <template #label>
          <span>原价：￥{{ storeInfo?.ot_price }}</span>
          <span>库存：{{ storeInfo?.stock + storeInfo?.unit_name }}</span>
          <span>销量：{{ storeInfo?.fsales }}</span>
        </template>
      </van-cell>
      <!-- 商品规格选择区域 -->
      <van-cell
        class="sku_window"
        is-link
        @click="handlePopup"
      >
        <template #title>
          <span>已选择：</span>
        </template>
      </van-cell>
      <!-- 弹出层 -->
      <van-popup
        v-model:show="specState.show"
        position="bottom"
        class="popup"
      >
        <van-cell-group>
          <!-- 头部商品信息 -->
          <van-cell class="popup-header">
            <img :src="specDetail?.image" alt="">
            <div class="info">
              <p class="title" v-text="storeInfo?.store_name"></p>
              <p class="price">￥{{ specDetail?.price }}</p>
              <p class="stock">库存：{{ specDetail?.stock }}</p>
            </div>
          </van-cell>
          <!-- 规格区域 -->
          <van-cell
            v-for="(attr, specIndex) in productAttr"
            :key="attr.id"
            class="spec"
          >
            <p v-text="attr.attr_name"></p>
            <!-- 规格选择标签 -->
            <span
              v-for="tag in attr.attr_values"
              :key="tag"
              class="tag"
              :class="{ active: specState.spec[specIndex] === tag }"
              v-text="tag"
              @click="handleTagChange(tag, specIndex)"
            ></span>
          </van-cell>
          <!-- 数量 -->
          <van-cell title="数量">
            <van-stepper v-model="specState.buyCount" :max="specDetail?.stock" />
          </van-cell>
        </van-cell-group>
      </van-popup>
    </van-tab>
    <van-tab title="评价" class="comment">
      <van-cell-group>
        <!-- 总体评价情况 -->
        <van-cell
          is-link
          :title="replyInfo"
          :value="replyRate"
          :to="{
            name: 'comment',
            params: {
              productId: storeInfo?.id
            }
          }"
        ></van-cell>
        <comment-item
          v-if="replyCount !== 0"
          :reply="reply"
        />
      </van-cell-group>
    </van-tab>
    <van-tab title="推荐">
      <van-cell class="recommend">
        <p class="title">推荐商品</p>
        <van-grid :border="false" :column-num="3">
          <van-grid-item
            v-for="item in goodsList"
            :key="item.id"
            :to="{
              name: 'product',
              params: {
                productId: item.id
              }
            }"
          >
            <van-image :src="item.image"></van-image>
            <p v-text="item.store_name"></p>
            <span>￥{{ item.price }}</span>
          </van-grid-item>
        </van-grid>
      </van-cell>
    </van-tab>
    <van-tab title="详情">
      <div
        class="description"
        v-html="storeInfo?.description"
      ></div>
    </van-tab>
  </van-tabs>
  <van-action-bar>
    <van-action-bar-icon icon="chat-o" text="客服" color="#ee0a24" />
    <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" />
    <van-action-bar-icon icon="star" text="已收藏" color="#ff5000" />
    <van-action-bar-button type="warning" text="加入购物车" @click="handleCartAdd" />
    <van-action-bar-button type="danger" text="立即购买" />
  </van-action-bar>
</template>

<script setup>
import CommentItem from '@/components/CommentItem.vue'

import { onBeforeRouteUpdate, useRouter } from 'vue-router'
const router = useRouter()

// --- 请求商品数据 ---
import { getProductDetails } from '@/api/product'
import { computed, reactive, ref } from '@vue/reactivity'
// 接收商品 ID
const { productId } = defineProps({
  productId: {
    type: String,
    required: true
  }
})
// 存储商品详情的所有数据
const productDetails = ref({})
const initProductDetails = async (productId) => {
  const { data } = await getProductDetails(productId)
  if (data.status !== 200) {
    // 找不到对应商品，直接跳回首页
    return router.push({
      name: 'home'
    })
  }
  productDetails.value = data.data
  // 初始化规格的初始数据
  initSpec(data.data.productAttr)
}
initProductDetails(productId)

// --- 商品数据处理 ---
// 1 商品详细信息
const storeInfo = computed(() => productDetails.value.storeInfo)
// 1.1 轮播图数据
const sliderImage = computed(() => storeInfo.value?.slider_image)
// 2.1 评价信息
const replyCount = computed(() => productDetails.value.replyCount || 0)
const replyInfo = computed(() => `用户评价(${ replyCount.value })`)
// 2.2 好评率
const replyChance = computed(() => productDetails.value.replyChance || 0)
const replyRate = computed(() => replyChance.value + '%好评率')
// 2.3 好评信息
const reply = computed(() => productDetails.value.reply)
// 3 推荐商品信息
const goodsList = computed(() => productDetails.value.good_list)

// 通过导航守卫监听路由变化，并请求对应的新的商品数据
onBeforeRouteUpdate((to) => {
  // 清除旧的商品数据
  productDetails.value = {}
  // 回到顶部
  document.documentElement.scrollTop = 0
  // 重新根据最新 ID 请求商品数据
  initProductDetails(to.params.productId)
})

// 规格弹出层处理
const specState = reactive({
  show: false, // 弹出层的显示状态
  spec: [], // 选中的规格数据
  buyCount: 0
})

// 规格数据处理
const productAttr = computed(() => productDetails.value.productAttr)
const productValue = computed(() => productDetails.value.productValue)
// sku 数据处理
const sku = computed(() => specState.spec.toString())
// 根据 sku 获取对应商品信息
const specDetail = computed(() => productValue.value?.[sku.value])
// 显示隐藏弹出层
const handlePopup = () => {
  specState.show = true
}
// 初始化规格的默认选中数据
const initSpec = spec => {
  specState.spec = spec.map(item => item.attr_values[0])
}

// 规格切换处理
const handleTagChange = (tag, specIndex) => {
  specState.spec[specIndex] = tag
}

// 加入购物车功能
import { addToCart } from '@/api/cart'
import { useStore } from 'vuex'
import { Toast } from 'vant'
const store = useStore()

const handleCartAdd = async () => {
  // 检测用户的登录状态，如果未登录，跳转登录页
  if (!store.state.user) {
    return router.push({
      name: 'login',
      query: {
        redirect: router.currentRoute.value.fullPath
      }
    })
  }
  // 检测弹出层是否显示
  if (!specState.show) {
    return specState.show = true
  }
  // 发送请求，加入到购物车
  const { data } = await addToCart({
    // 0 代表加入购物车操作，1 代表立即购买
    new: 0,
    productId,
    uniqueId: specDetail.value.unique,
    cartNum: specDetail.value.buyCount
  })
  if (data.status !== 200) { return }
  // 隐藏弹出框
  specState.show = false
  Toast('加入购物车成功~')
}

</script>

<style lang="scss" scoped>
// 为了避免问题，添加权重
// .van-nav-bar {
//   position: fixed !important;
// }

.van-tabs {
  background-color: #f2f2f2;
  margin-bottom: 50px;

  // 顶部 tabs 的标题部分
  :deep(.van-tabs__wrap) {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
  }

  // 底部主题内容容器
  :deep(.van-tabs__content) {
    padding-top: 46px;
  }

  // 轮播图
  .van-swipe-item img {
    width: 375px;
  }

  // 商品信息区域
  :deep(.productHeader) {
    margin-bottom: 10px;

    // title 插槽部分
    .van-cell__title {
      .price {
        span {
          font-size: 24px;
          font-weight: 700;
        }

        .share {
          float: right;
        }
      }

      .title {
        font-size: 16px;
        font-weight: 700;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin: 5px 0 10px;
      }
    }

    // label 插槽部分
    .van-cell__label {
      display: flex;
      justify-content: space-between;
    }
  }

  // 商品规格区域
  .sku_window {
    margin-bottom: 10px;
  }

  // 商品评价区域(移动到公共组件中)
  
  // 商品推荐区域
  :deep(.recommend) {
    margin-bottom: 10px;

    .title {
      font-size: 16px;
      font-weight: 700;
      padding: 5px 0;
    }

    .van-grid-item {
      img {
        width: 107px;
        height: 107px;
      }
    }

    .van-grid-item__content {
      padding: 0;
    }

    p {
      padding: 0 3px;
      font-size: 14px;
      font-weight: 700;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
    }

    span {
      color: #f2270c;
      font-size: 12px;
      font-weight: 700;
      // 让元素单独靠左，可以设置 grid 的 center，或单独使用 flex 属性
      align-self: flex-start;
    }
  }

  // 商品描述区域
  .description {
    width: 100%;

    :deep(img) {
      width: 100%;
    }
  }

  // 弹出层
  :deep(.van-popup) {
    border-radius: 10px 10px 0 0;
    max-height: 70%;
    margin-bottom: 50px;

    // 弹框头部
    .popup-header {
      .van-cell__value {
        display: flex;

        img {
          width: 75px;
          height: 75px;
          align-self: center;
        }

        .info {
          padding: 10px;

          .title {
            font-size: 16px;
            font-weight: 700;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            margin-bottom: 10px;
          }

          .price {
            font-size: 16px;
            color: #f2270c;
          }

          .stock {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }

    // 规格区域
    .spec {
      p {
        margin-bottom: 5px;
      }

      .tag {
        display: inline-block;
        min-width: 25px;
        padding: 0 12px;
        border: 1px solid #ccc;
        border-radius: 20px;
        text-align: center;
        background: #f2f2f2;
        margin-right: 7px;
      }

      .tag.active {
        border-color: #f2270c;
        color: #f2270c;
        background-color: #fcedeb;
      }
    }
  }
}

// 设置加入购物车样式
.van-action-bar {
  // 确保在最顶部显示
  z-index: 10000;
  width: 100%;
}
</style>
