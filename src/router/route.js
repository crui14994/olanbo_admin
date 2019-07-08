// 运营系统路由
export const operatRouter = [
    {
        path:"/",
        redirect:"/web"
    },
    {
        path: '/web',
        name: '网站文案管理营系统',
        component: () => import('@/pages/layout'),
        children: [
            // {
            //     path: 'home',
            //     name: '首页管理',
            //     component: () => import('@/pages/web/operat/home')
            // },
            // {
            //     path: 'product',
            //     name: '智能产品',
            //     component: () => import('@/pages/web/operat/product')
            // },
            // {
            //     path: 'case',
            //     name: '成功案例',
            //     component: () => import('@/pages/web/operat/case')
            // },
            // {
            //     path: 'cooperate',
            //     name: '招商合作',
            //     component: () => import('@/pages/web/operat/cooperate')
            // },
        ]
    },
    {
        path: '/order',
        name: '订单物流管理',
        component: () => import('@/pages/layout'),
        children: [
            
        ]
    }
];


export const routers = [
    // loginRouter,
    // errorRouter,
    // otherRouter,
    ...operatRouter
];