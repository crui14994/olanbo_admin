import axios from 'axios'
import { Loading, Message } from 'element-ui';
import router from './../router'
import { devType } from "../api/user"

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_URL, //baseurl
    timeout: 15000, // 请求超时时间
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

    //全局添加请求头
    config.headers['type'] = devType.WEB.type;

    return config
}, error => {
    // 请求错误时做些事(接口错误、超时等)

    // 关闭loadding
    let loading = Loading.service({});
    loading.close();

    console.log("2:" + error)

    return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data

        // 关闭loadding
        let loading = Loading.service({});
        loading.close();

        console.log("3:" + res)

        if (res.code != 200 && res.desc != undefined) {
            Message({
                showClose: true,
                message: res.desc,
                type: 'error'
            });
        }

        return response;
    },
    error => {
        // 关闭loadding
        let loading = Loading.service({});
        loading.close();

        let message = () => {
            if (error.message == "Network Error") {
                return "网络错误！"
            }
            return error.message;
        }
        Message({
            message: message(),
            type: 'error',
        })

        return Promise.reject(error)
    })

export default service