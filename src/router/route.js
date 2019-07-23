// 登陆
export const loginRouter = {
    path: '/login',
    name: "login",
    component: () => import('@/pages/login'),
    meta: { title: '登录' } 
}

// 注册
export const registRouter = {
    path: '/regist',
    name: "regist",
    component: () => import('@/pages/regist'),
    meta: { title: '注册' } 
}

// 修改个人信息
export const updateInfo = {
    path: '/updateInfo',
    name: "updateInfo",
    component: () => import('@/pages/updateInfo'),
    meta: { title: '修改信息' } 
}

// 运营系统路由
export const operatRouter = [
    {
        path: '/',
        redirect:"/operat/web/banner",
        meta: { title: '运营系统' } 
    },
    {
        path: '/operat',
        name: 'operat',
        component: () => import('@/pages/layout'),
        meta:{title: '网站文案管理'},
        children: [
            {
                path: "web/banner",
                name: 'banner',
                component: () => import('@/pages/operat/web/banner'),
                meta: { title: 'banner管理' } 
            },
            {
                path: "web/video",
                name: 'video',
                component: () => import('@/pages/operat/web/video'),
                meta: { title: '视频管理' } 
            },
            {
                path: "web/recommend",
                name: 'recommend',
                component: () => import('@/pages/operat/web/recommend'),
                meta: { title: '推荐单品选择' } 
            },
            {
                path: 'productList',
                name: 'productList',
                component: () => import('@/pages/operat/product/productList'),
                meta: { title: '智能产品' } 
            },
            {
                path: 'productEdit',
                name: 'productEdit',
                component: () => import('@/pages/operat/product/productEdit'),
                meta: { title: '产品编辑' }
            },
            {
                path: 'exampleList',
                name: 'exampleList',
                component: () => import('@/pages/operat/examples/exampleList'),
                meta: { title: '成功案例' }
            },
            {
                path: 'exampleEdit/:id',
                name: 'exampleEdit',
                component: () => import('@/pages/operat/examples/exampleEdit'),
                meta: { title: '案例编辑' }
            },
            {
                path: 'webMsg',
                name: 'webMsg',
                component: () => import('@/pages/operat/webMsgList/webMsg'),
                meta: { title: '用户留言' }
            },
            {
                path: 'coopMsg',
                name: 'coopMsg',
                component: () => import('@/pages/operat/coopMsgList/coopMsg'),
                meta: { title: '合作申请' }
            }
        ]
    }, 
];

export const routers = [
    loginRouter,
    registRouter,
    updateInfo,
    ...operatRouter
];