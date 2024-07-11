import {router} from './router'
import store from './store'
import NProgress from "nprogress";
import "nprogress/nprogress.css";
const whiteList = ['/login','api/yz/oauth/token','/user/iam-login','/404',] //白名单,不需要登录的路由'/login',
router.beforeEach((to, from, next) => {
    // console.log(next())
    NProgress.start()
    // 获取token
    //debugger
    let token = localStorage.getItem('Authorization');
    if (token) {
        //如果已经登录
        if (to.path === '/login') {
            next({path:'/'});
            NProgress.done() // 结束Progress
        } else if (store.getters.menuList.length===0) {
            store.dispatch('GetMenuList').then(() => {
                //debugger;
                //获取地址栏数据   解决刷新后vuex数据消失之后，出现空白页
                let isDefault=`${window.location.pathname+window.location.search}`
                //将地址栏的数据重新导向原来的地址
                if (isDefault==='/login'){
                    next('/dashboard')
                }else{
                    next(`${isDefault}`)
                }
            })
        } else {
            next()
        }
    } else if (whiteList.indexOf(to.path) !== -1) {

        //如果前往的路径是白名单内的,就可以直接前往
        next();
        // NProgress.done() // 结束Progress
        // return;
    }
    else {
        // //如果路径不是白名单内的,而且又没有登录,就跳转登录页面
        next('/login')
        // // next()
        // NProgress.done() // 结束Progress
    }
})
router.afterEach((to) => {
    NProgress.done() // 结束Progress
})
