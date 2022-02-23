import request from '@/utils/request'

// 获取省市区列表
export const getCityList = () => request({
  method: 'GET',
  url: '/city_list'
})

export const addAddress = data => request({
  method: 'POST',
  url: '/address/edit',
  data
})
