import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/user'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/User.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/ShopType',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/ShopType.vue'),
                    meta: { title: '商品类型管理' }
                },
                {
                    path: '/categoryGarbage',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/categoryGarbage.vue'),
                    meta: { title: '垃圾分类' }
                },
                {
                    path: '/point',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Point.vue'),
                    meta: { title: '积分管理' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/address',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Address.vue'),
                    meta: { title: '地址管理' }
                },
                {
                    // vue-schart组件
                    path: '/Order',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/Order.vue'),
                    meta: { title: '订单管理' }
                },
                {
                    // 拖拽列表组件
                    path: '/question',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/Question.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/shopCar',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/ShopCar.vue'),
                    meta: { title: '购物车管理' }
                },
                {
                    // 国际化组件
                    path: '/shop',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/Shop.vue'),
                    meta: { title: '商品管理' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
