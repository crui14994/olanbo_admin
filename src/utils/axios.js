import axios from 'axios'

import { Loading } from 'element-ui';


import qs from 'qs' // 序列化请求数据，视服务端的要求

// 创建axios实例
const service = axios.create({
    //这里baseurl就是刚开始配置的开发环境和线上环境地址，webpack会自动读取无需手动再改
    // baseURL: process.env.BASE_URL, //baseurl
    timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
    //请求前到请求到数据这段时间用加载动画来代替，以服务方式调用
    Loading.service(
        {
            fullscreen: true,
            text: '拼命加载中...',
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.8)"
        }
    );

    return config
}, error => {
    // 请求错误时做些事(接口错误、超时等)

    // 关闭loadding
    let loading = Loading.service({});
    loading.close();

    return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
})

// respone拦截器
service.interceptors.response.use(
    response => {

        // 关闭loadding
        let loading = Loading.service({});
        loading.close();

        return response;
    },
    error => {
        console.log('err' + error)// for debug
        return Promise.reject(error)
    })

export default service