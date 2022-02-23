<template>
  <van-cell class="comment-item">
    <div class="user-info">
      <img :src="star" alt="">
      <span class="nickname" v-text="reply.nickname"></span>
      <van-rate v-model="star" readonly size="12" />
    </div>
    <p class="time">{{ reply?.add_time }} {{ reply?.sku }}</p>
    <p class="comment-content" v-text="reply?.comment"></p>
    <ul class="picture">
      <li
        v-for="(item,index) in pics"
        :key="index"
      >
        <img :src="item" alt=""></li>
    </ul>
  </van-cell>
</template>

<script setup>
import { computed } from '@vue/reactivity'

const { reply } = defineProps({
  reply: {
    type: Object,
    required: true
  }
})
const star = computed(() => Number(reply?.star))
const pics = computed(() => reply?.pics)
</script>

<style lang="scss" scoped>
.comment {
  margin-bottom: 10px;

  .comment-item {
    padding: 10px 15px 20px;

    .user-info {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 7px 0;

      img {
        width: 28px;
        height: 28px;
      }

      .nickname {
        padding: 0 10px 0 6px;
      }
    }

    .time {
      font-size: 12px;
      color: #82848f;
      padding: 5px 0;
    }

    .comment-content {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .picture {
      li {
        float: left;
        padding-right: 7px;
        
        img {
          width: 78px;
          height: 78px;
        }
      }
    }
  }
}
</style>
