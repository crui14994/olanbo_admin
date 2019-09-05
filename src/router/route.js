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
                meta: { title: '网站文案管理',icon:"icon-wenjian" },
                children: [
                    {
                        path: 'home', redirect: 'home/banner', name: 'home',
                        component: { render(c) { return c('router-view') } },
                        meta: { title: '首页管理' },
                        children: [
                            { path: 'banner', name: 'banner', component: () => import('@/pages/operat/web/banner'), meta: { title: 'banner管理' }, },
                            { path: 'video', name: 'video', component: () => import('@/pages/operat/web/video'), meta: { title: '视频管理' }, },
                            { path: 'recommend', name: 'recommend', component: () => import('@/pages/operat/web/recommend'), meta: { title: '推荐单品选择' }, },
                        ]
                    },
                    { path: 'productList', name: 'productList', component: () => import('@/pages/operat/product/productList'), meta: { title: '智能产品' }, },
                    { path: 'productEdit/:id', name: 'productEdit', hidden:true, component: () => import('@/pages/operat/product/productEdit'), meta: { title: '产品编辑' }, },
                    { path: 'exampleList', name: 'exampleList', component: () => import('@/pages/operat/examples/exampleList'), meta: { title: '成功案例' }, },
                    { path: 'exampleEdit/:id', name: 'exampleEdit', hidden:true, component: () => import('@/pages/operat/examples/exampleEdit'), meta: { title: '案例编辑' }, },
                    { path: 'solutionList', name: 'solutionList', component: () => import('@/pages/operat/solution/solutionList'), meta: { title: '解决方案' }, },
                    { path: 'solutionEdit/:id', name: 'solutionEdit',hidden:true, component: () => import('@/pages/operat/solution/solutionEdit'), meta: { title: '解决方案编辑' }, },
                    { path: 'webMsg', name: 'webMsg', component: () => import('@/pages/operat/webMsgList/webMsg'), meta: { title: '用户留言' }, },
                    { path: 'coopMsg', name: 'coopMsg', component: () => import('@/pages/operat/coopMsgList/coopMsg'), meta: { title: '合作申请' }, },
                ]
            },
            {
                path: '/orders', name: ' orders',
                component: { render(c) { return c('router-view') } },
                meta: { title: '订单物流管理',icon:"icon-icon-aobi_dingdanwuliuon" },
            },
            {
                path: '/credentials', name: 'credentials',
                component: { render(c) { return c('router-view') } },
                meta: { title: '开发者资质认证' ,icon:"icon-zizhi"},
            },
            {
                path: '/developers', name: ' developers',
                component: { render(c) { return c('router-view') } },
                meta: { title: '开发者账号管理' ,icon:"icon-tubiao39"},
            },
            {
                path: '/agent', name: 'agent',
                component: { render(c) { return c('router-view') } },
                meta: { title: '代理商管理',icon:"icon-ziyuan" },
            },
            {
                path: '/appUpgrade', name: 'appUpgrade',
                component: () => import('@/pages/operat/appUpgrade/appUpgrade'),
                meta: { title: 'app升级管理',icon:"icon-shouji" },
            },
        ]
    }

]
