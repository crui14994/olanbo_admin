/*
 * hidden表示不需要再侧边栏显示的路由
 */

//公用页面
export const routers = [
    {
        path: '/login',
        name: "login",
        component: () => import('@/pages/login'),
        meta: { title: '登录' }
    },
    {
        path: '/regist',
        name: "regist",
        component: () => import('@/pages/regist'),
        meta: { title: '注册' }
    },
    {
        path: '/updateInfo',
        name: "updateInfo",
        component: () => import('@/pages/updateInfo'),
        meta: { title: '修改信息' }
    }
]


export const asyncRouterMap = [
    // 运营系统路由
    {
        path: '/',
        name: 'operat',
        redirect: "/web",
        component: () => import('@/pages/layout'),
        meta: { title: '运营系统' },
        children: [
            {
                path: '/web', redirect: '/web/home', name: 'web',
                component: { render(c) { return c('router-view') } },
                meta: { title: '网站管理', icon: "icon-wenjian" },
                children: [
                    {
                        path: 'home', redirect: 'home/banner', name: 'home',
                        component: { render(c) { return c('router-view') } },
                        meta: { title: '首页管理' },
                        children: [
                            { path: 'banner', name: 'banner', component: () => import('@/pages/operat/web/home/banner'), meta: { title: 'banner管理' }, },
                            { path: 'video', name: 'video', component: () => import('@/pages/operat/web/home/video'), meta: { title: '视频管理' }, },
                            { path: 'recommend', name: 'recommend', component: () => import('@/pages/operat/web/home/recommend'), meta: { title: '推荐单品选择' }, },
                        ]
                    },
                    { path: 'productList', name: 'productList', component: () => import('@/pages/operat/web/product/productList'), meta: { title: '智能产品' }, },
                    { path: 'productEdit/:id', name: 'productEdit', hidden: true, component: () => import('@/pages/operat/web/product/productEdit'), meta: { title: '产品编辑' }, },
                    { path: 'exampleList', name: 'exampleList', component: () => import('@/pages/operat/web/examples/exampleList'), meta: { title: '成功案例' }, },
                    { path: 'exampleEdit/:id', name: 'exampleEdit', hidden: true, component: () => import('@/pages/operat/web/examples/exampleEdit'), meta: { title: '案例编辑' }, },
                    { path: 'solutionList', name: 'solutionList', component: () => import('@/pages/operat/web/solution/solutionList'), meta: { title: '解决方案' }, },
                    { path: 'solutionEdit/:id', name: 'solutionEdit', hidden: true, component: () => import('@/pages/operat/web/solution/solutionEdit'), meta: { title: '解决方案编辑' }, },
                    { path: 'webMsg', name: 'webMsg', component: () => import('@/pages/operat/web/webMsgList/webMsg'), meta: { title: '用户留言' }, },
                    { path: 'coopMsg', name: 'coopMsg', component: () => import('@/pages/operat/web/coopMsgList/coopMsg'), meta: { title: '合作申请' }, },
                ]
            },
            {
                path: '/orders', name: ' orders',
                component: { render(c) { return c('router-view') } },
                meta: { title: '订单物流管理', icon: "icon-icon-aobi_dingdanwuliuon" },
            },
            {
                path: '/devUsers', name: 'credentials',
                component: { render(c) { return c('router-view') } },
                meta: { title: '开发者管理', icon: "icon-tubiao39" },
                // children:[
                //     { path: 'credentials', name: 'credentials', component: { render(c) { return c('router-view') } },meta: { title: '开发者资质认证' }, },
                //     { path: 'developers', name: 'developers', component: { render(c) { return c('router-view') } },meta: { title: '开发者账号管理' }, },
                // ]
            },
            {
                path: '/user', name: 'user',
                component: { render(c) { return c('router-view') } },
                meta: { title: '用户管理', icon: "icon-ziyuan" },
                children:[
                    { path: 'agent', name: 'agent', component: () => import('@/pages/operat/user/agent'), meta: { title: '代理商管理' }, },
                    { path: 'urlEdit', name: 'urlEdit',hidden: true, component: () => import('@/pages/operat/user/urlEdit'), meta: { title: 'APP跳转地址管理' }, },
                    { path: 'smartDev', name: 'smartDev', component: () => import('@/pages/operat/user/smartDev'), meta: { title: '智能家居(APP)管理' }, },
                ]
            },
            {
                path: '/upgrade', name: 'upgrade',
                component:{ render(c) { return c('router-view') } },
                meta: { title: '升级管理', icon: "icon-app" },
                children:[
                    { path: 'appUpgrade', name: 'appUpgrade', component:() => import('@/pages/operat/upgrade/appUpgrade'), meta: { title: 'app升级管理' }, },
                    { path: 'otaUpgrade', name: 'otaUpgrade', component:() => import('@/pages/operat/upgrade/otaUpgrade'), meta: { title: '设备OTA升级' }, },
                ]
            },
            { 
                path: '/system', 
                name: 'system', 
                component:{ render(c) { return c('router-view') } }, 
                meta: { title: '系统' ,icon: "icon-shezhi1" }, 
                children:[
                    { path: 'msgPush', name: 'msgPush', component:() => import('@/pages/operat/upgrade/appUpgrade'), meta: { title: '消息推送' }, },
                ]
            },
        ]
    }

]
