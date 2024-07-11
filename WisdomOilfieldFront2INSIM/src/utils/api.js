import axios from 'axios'
import { message } from 'ant-design-vue';
import {router} from "@/router";
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 1500000 // 请求超时时间2
})
// request拦截器
service.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('Authorization');
  return config
}, error => {
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code == "200") {
      return res
    }
    if (res.code == '10002') {
        message.error( res.msg);
        console.log("请求失败！")
      return Promise.reject(res.msg)
    } else {
        console.log(response)
        message.error( "您没有访问权限！");
      return response;
    }
  },
  error => {
    console.error('err' + error) // for debug
      message.error( error.message);
    return Promise.reject(error)
  }
)
export default service
