// 登陆
export const loginRouter = {
    path: '/login',
    name: "login",
    component: () => import('@/pages/login'),
}

// 注册
export const registRouter = {
    path: '/regist',
    name: "regist",
    component: () => import('@/pages/regist'),
}

// 修改个人信息
export const updateInfo = {
    path: '/updateInfo',
    name: "updateInfo",
    component: () => import('@/pages/updateInfo'),
}

// 运营系统路由
export const operatRouter = [
    {
        path: '/',
        redirect:"/operat/web/banner"
    },
    {
        path: '/operat',
        name: 'operat',
        component: () => import('@/pages/layout'),
        children: [
            {
                path: "web/banner",
                name: 'banner',
                component: () => import('@/pages/operat/web/banner'),
            },
            {
                path: "web/video",
                name: 'video',
                component: () => import('@/pages/operat/web/video'),
            },
            {
                path: "web/recommend",
                name: 'recommend',
                component: () => import('@/pages/operat/web/recommend'),
            },
            {
                path: 'productList',
                name: 'productList',
                component: () => import('@/pages/operat/product/productList'),
            },
            {
                path: 'productEdit/:id',
                name: 'productEdit',
                component: () => import('@/pages/operat/product/productEdit'),
            },
            {
                path: 'exampleList',
                name: 'exampleList',
                component: () => import('@/pages/operat/examples/exampleList'),
            },
            {
                path: 'exampleEdit/:id',
                name: 'exampleEdit',
                component: () => import('@/pages/operat/examples/exampleEdit'),
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