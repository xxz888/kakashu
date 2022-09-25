import axios from 'axios'
import Vue from 'vue'

import store from '../store/index'
// import { getToken } from '@/utils/auth'
import {Notify, Dialog} from 'vant';

Vue.use(Notify, Dialog);
// 创建axios实例
import {router} from '../router';

// let ip = "https://api.flyaworld.com/v1.0"
// let ip = "https://caderapi.caderworld.com/v1.0"
// let ip = 'http://139.196.145.125/v1.0'
// let ip = "https://api.flyaworld.com/v1.0"
// let ip = "http://103.113.158.61:18080/v1.0"
// let ip = "https://api.dingdingxiaoer.com/v1.0"
let ip = "https://api.carcsu.com/v1.0"


export function getIp(){
  return ip
}

// 创建axios 实例
const service = axios.create({
  baseURL: ip,
  timeout: 10000
})

var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

function createDeviceId() {
  var a = new Date().getTime() * 1000000 + Math.round(Math.random() * 1000000)
  return toHex(a)
}

function toHex(num) {
  if (num < 16) return num
  return toHex(Math.ceil(num / 16)) + arr[num % 16]
}

service.interceptors.request.use(
  config => {
    store.commit('Loading')
    // 这里可以自定义一些config 配置
    if (localStorage.getItem('token') != null) {
      config.headers['authToken'] = localStorage.getItem('token') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    let deviceId = localStorage.getItem('did')
    if (!deviceId) {
      deviceId = createDeviceId()
      localStorage.setItem('did', deviceId)
    }
    config.headers['platform'] = 'h5'
    config.headers['deviceId'] = deviceId
    return config
  },

  error => {
    store.commit('closeLoading')
    //  这里处理一些请求出错的情况
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {

    store.commit('closeLoading')
    const res = response.data
    if (res.resp_code == '000005') {
      Dialog.alert({
        title: "温馨提示",
        message: res.resp_message,
        confirmButtonText: "立即重登"
      }).then(() => {
        let did = localStorage.getItem('did')
        localStorage.clear();
        Cookies.remove('token');
        sessionStorage.clear()
        if (did) {
          localStorage.setItem('did', did)
        }
        router.push({name: 'login'});
      });
    } else if (res.resp_code == '000000') {

      return response.data
    } else if (res.resp_code == '000012') {

      return response.data
    } else if (res.resp_code == '000012') {

      return response.data
    } else if (res.resp_code == '999992') { //需要验证码的形式绑卡

      return response.data
    } else if (res.resp_code == '999994') { //需要验证码的形式绑卡

      return response.data
    } else if (res.resp_code == '999995') {

      return response.data //还款鉴权，验证码获取
    } else if (res.resp_code == '999989') {

      return response.data //智能路由
    } else if (res.resp_code == '666666') {

      return response.data //还款鉴权，验证码获取
    } else if (res.resp_code == '999996') {

      return response.data //还款鉴权，验证码获取
    } else if (res.resp_code == '999997') {
      Notify({
        message: res.resp_message,
        duration: 1000,
        background: '#1989fa'
      });
      return response.data //还款鉴权，验证码获取
    } else if (res.resp_code == '333333') {

      return response.data //返回商户没有数据

    } else if (res.resp_code == '999990') {
      return response.data //返回商户没有数据

    } else {
      Notify({
        message: res.resp_message,
        duration: 1000,
        background: '#1989fa'
      });
      return response.data
    }
  },
  error => {
    store.commit('closeLoading')
    if (error.message.indexOf('timeout') > -1) {
      Notify('请求超时，请检查网络是否正常');
    }
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求出错(400)'
          Notify('请求错误');
          break;
        case 404:
          error.message = '请求出错(404)'
          Notify('请求出现了404！请稍后重试！');
          break;
        case 401:
          Dialog.alert({
            title: "温馨提示",
            message: '您的登录已过期，可以取消继续留在该页面，或者重新登录'
          }).then(() => {
            router.push({name: 'login'});
          });
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
          Notify('网络丢失了吆！请稍后重试！');
      }

    }
    Notify('网络丢失了吆！请稍后重试！');
    return Promise.reject(error)
  }
)
export default service

