// 运营系统路由
export const operatRouter = [
    {
        path: '/operat',
        name: 'operat',
        alias: '/',
        component: () => import('@/pages/layout'),
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/pages/web/operat/home')
            },
            {
                path: '/product',
                name: 'product',
                component: () => import('@/pages/web/operat/product')
            },
            {
                path: '/plan',
                name: 'plan',
                component: () => import('@/pages/web/operat/plan')
            },
            {
                path: '/case',
                name: 'case',
                component: () => import('@/pages/web/operat/case')
            },
            {
                path: '/cooperate',
                name: 'cooperate',
                component: () => import('@/pages/web/operat/cooperate')
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('@/pages/web/operat/about')
            },
        ]
    }
];


export const routers = [
    // loginRouter,
    // errorRouter,
    // otherRouter,
    ...operatRouter
];