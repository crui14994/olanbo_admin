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


// 运营系统路由
export const operatRouter = [
    {
        path: '/',
        redirect:"/operat/web/banner"
    },
    {
        path: '/operat',
        name: '运营系统',
        component: () => import('@/pages/layout'),
        children: [
            {
                path: "web/banner",
                name: 'banner管理',
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
        ]

    }
];
// 报表统计路由
// export const reportRouter = [
//     {
//         path:"/report",
//     },
//     {
//         path: '/report',
//         name: 'report',
//         component: () => import('@/pages/layout'),
//         children: [
//         ]
//     },
//     {
//         path: '/order',
//         name: 'order',
//         component: () => import('@/pages/layout'),
//         children: [

//         ]
//     }
// ];

export const routers = [
    loginRouter,
    registRouter,
    // errorRouter,
    // otherRouter,
    // ...reportRouter,
    ...operatRouter
];