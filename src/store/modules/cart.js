import { changeCartItemNum } from '@/api/cart'

const state = {
  // 用于存储购物车的数据(sku 的 id, checked, count, title, price, stock)
  cartList: []
}
const getters = {
  // 筛选选中的选项
  checkedItems: state => {
    return state.cartList.filter(item => item.checked === true)
  },
  // 基于选中项计算价格
  totalPrice (state, getters) {
    // 对所有勾选商品进行价格统计，并保留两位小数
    return getters.checkedItems.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2)
  },
  checkedAll (state, getters) {
    return state.cartList.length === getters.checkedItems.length
  }
}
const mutations = {
  // 添加商品
  addToCart (state, payload) {
    // payload 应该为包含 sku 相关信息的对象，参考上面 state.cartList 说明
    state.cartList.push(payload)
  },
  // 清除数据
  clear (state) {
    state.cartList = []
  },
  // 商品状态更改
  checkedChange (state, { id, checked }) {
    const currentItem = state.cartList.find(item => item.id === id)
    currentItem.checked = checked
  },
  countChange (state, { id, count }) {
    state.cartList.find(item => item.id === id).count = count
  },
  checkedAll (state, { checked }) {
    // 为所有选项设置统一的状态
    state.cartList.forEach(item => item.checked = checked)
  }
}
const actions = {
  // 可在 action 内部提交 mutation
  // context 上下文, store 实例
  async countChange ({ commit }, payload) {
    // context.commit()
    // 提交 mutation 更改数据
    commit('countChange', payload)
    // 发送请求
    const { data } = await changeCartItemNum({
      id: payload.id,
      number: payload.count
    })
    if (data.status !== 200) { return }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
