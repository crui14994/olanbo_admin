// 运营系统路由
export const operatRouter = [
    {
        path:"/",
        redirect:"/operat/home"
    },
    {
        path: '/operat',
        name: '运营系统',
        component: () => import('@/pages/layout'),
        children: [
            {
                path: 'home',
                name: '首页管理',
                component: () => import('@/pages/web/operat/home')
            },
            {
                path: 'product',
                name: '智能产品',
                component: () => import('@/pages/web/operat/product')
            },
            // {
            //     path: '/plan',
            //     name: '成功案例',
            //     component: () => import('@/pages/web/operat/plan')
            // },
            {
                path: 'case',
                name: '成功案例',
                component: () => import('@/pages/web/operat/case')
            },
            {
                path: 'cooperate',
                name: '招商合作',
                component: () => import('@/pages/web/operat/cooperate')
            },
            // {
            //     path: '/about',
            //     name: 'about',
            //     component: () => import('@/pages/web/operat/about')
            // },
        ]
    }
];


export const routers = [
    // loginRouter,
    // errorRouter,
    // otherRouter,
    ...operatRouter
];