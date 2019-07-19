import axios from 'axios'
import { Loading, Message } from 'element-ui';
import router from './../router'

// 创建axios实例
const service = axios.create({
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

    //判断localStorage中有没有userId，如果没有则用户没有登录，跳转到登录页面
    let userId = JSON.parse(sessionStorage.getItem("SET_ISLOGIN"));
    if (!userId) {
        router.push("/login")
    }

    return config
}, error => {
    // 请求错误时做些事(接口错误、超时等)

    // 关闭loadding
    let loading = Loading.service({});
    loading.close();

    console.log(0)

    return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        const res = response.data

        // 关闭loadding
        let loading = Loading.service({});
        loading.close();

        if (res.code == 300 || res.code == 401 || res.code == 404 || res.code == 600 || res.code == 700 || res.code == 801 || res.code == 999) {
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

        console.log(error.message)
        Message({
            message: error.message,
            type: 'error',
        })

        return Promise.reject(error)
    })

export default service