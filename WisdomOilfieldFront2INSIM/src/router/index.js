import { createRouter,createWebHistory} from "vue-router";
import Layout from '../views/layout/Layout.vue';
export const constantRouterMap= [
    {path: '/login', component: () => import('../views/login/Index.vue'), hidden: true},

    {path: '/404', component: () =>import('../views/404'), hidden: true},

    {
        path:'/',
        component: Layout,
        redirect: '/dashboard',
        name: '首页',
        hidden: true,
        children: [{
            // path: 'dashboard', component:  () => import('../views/znjs/RouterTest'),
            path: 'dashboard', component:  () => import('../views/dashboard/index'),
        }]
    },

    {
        path: '/:pathMatch(.*)*',
        name: 'path',
        redirect: '/404',
        hidden: true
    },



]
// //重置路由用的
// export function resetRouter() {
//     const newRouter = createRouter()
//     router.matcher = newRouter.matcher
// }
export const router =createRouter({
    history:createWebHistory(),
    routes:constantRouterMap,
})
