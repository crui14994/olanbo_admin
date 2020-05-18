// import Vue from 'vue'
// import Router from 'vue-router'
import store from '@/store/index'
import { routers, asyncRouterMap } from './route';

// Vue.use(Router)

const router = new VueRouter({
    mode: 'history',
    base: "/smartAdmin/",
    routes: [
        ...routers,
        ...asyncRouterMap
    ]
})

const whiteList = ['/login', '/regist', '/updateInfo'] // 不重定向白名单

// 导航守卫
router.beforeEach((to, from, next) => {
    const isLogin = store.getters.isLogin; //是否登录
    if (isLogin) {
        if (to.path === "/login") {
            next({ path: '/' });
        } else {
            store.dispatch('getNowRoutes', to);
            next();
        }
    } else {
        //在免登录白名单，直接进入,否则进入登录页
        (whiteList.indexOf(to.path) !== -1) ? next(): next('/login');
    }
})

export default router;