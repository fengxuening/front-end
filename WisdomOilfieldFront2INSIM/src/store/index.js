import {
  createApp
} from 'vue';
import Vuex from 'vuex';
import App from '../App.vue';
import api from "@/utils/api";
import {constantRouterMap, router} from "@/router";
import Layout from '../views/layout/Layout.vue';
 createApp(App).use(Vuex);
let t
try {
  t = JSON.parse(localStorage.userInfo)
} catch (err) {
}
const store = new Vuex.Store({
  state: {
    secondMenuList:[],
    addRouters:{},
    menuList:[],
    userinfo: {},
    refreshToken: '',
    authorization: localStorage.Authorization || '',
    sidebar: {
      opened: !+localStorage.getItem('sidebarStatus')
    },
    permission_routers:constantRouterMap,
  },
  mutations: {
    //设置路由
    setRouters: (state,addRouters) =>
    {
      localStorage.AddRouters = JSON.stringify(addRouters)
      state.addRouters=addRouters;
      //和已经存在的路由表拼接
      state.permission_routers =state.permission_routers.concat(addRouters);
    },
    //更新tabs
    updateSecondMenuList(state,secondMenuList){
      localStorage.SecondMenuList=JSON.stringify(secondMenuList);
      state.secondMenuList=secondMenuList
    },
    //更新权限
    updateMenuList(s,v) {
      localStorage.MenuList =JSON.stringify(v)
      s.menuList = v
    },
    //更新用户信息
    updateInfo(s, v) {
      localStorage.userInfo = JSON.stringify(v)
      s.userinfo = v
    },
    //更新认证
    updateAuthorization (s, v) {
      localStorage.Authorization = v
      s.authorization = v
    },
   //更新token
    updateRefreshToken(s, v) {
      localStorage.RefreshToken = v
      s.RefreshToken = v
    },

    //清除信息
    clear(s) {
      delete localStorage.userInfo
      s.userinfo = {}
      s.menuList={}
      s.addRouters={}
      s.secondMenuList={}
      delete localStorage.MenuList
      delete localStorage.RefreshToken
      delete localStorage.Authorization
      delete localStorage.SecondMenuList
      delete localStorage.AddRouters
      delete localStorage.store
      s.authorization = ''
      s.menuList = ''
      s.RefreshToken = ''
      s.addRouters=''
      s.menuList=''
      s.secondMenuList=''
    },
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        localStorage.setItem('sidebarStatus', 1)
      } else {
        localStorage.setItem('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
    },
  },
  getters:{
    sidebar: state => state.sidebar,
    permission_routers: state => state.permission_routers,
    userinfo: state => state.userinfo,
    menuList: state => state.menuList,
    addRouters:state=>state.addRouters,
    secondMenuList:state=>state.secondMenuList,
  },
  actions: {
    ToggleSideBar({commit}) {
      commit('TOGGLE_SIDEBAR')
    },
    //产生路由
    GenerateRoutes({commit}, response) {
      let asyncRouters = filterAsyncRouter(response);
      commit("setRouters", asyncRouters);
    },
    //获取menuList
    GetMenuList({commit}) {
      {
        return new Promise((resolve, reject) => {
          api({
            url: '/yz/users/me',
            method: 'get'
          }).then(res => {
            let data = res.data.menuList;
            //提交权限信息
            commit("updateMenuList", res.data.menuList);
            commit("updateSecondMenuList", res.data.SecondMenuList);
            let userRoutes = res.data.menuList;
            let i;
              store.dispatch('GenerateRoutes', userRoutes).then(() => {
                //生成该用户的新路由json操作完毕之后,调用vue-router的动态新增路由方法,将新路由添加
                for ( i=0 ; i < userRoutes.length; i++) {
                  router.addRoute(store.getters.addRouters[i]);
                }
              })
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        })
      }
    },
    //获取tabs信息
    GetTabs({commit}) {
      return new Promise((resolve, reject) => {
        api({
          url: '/yz/users/me',
          method: 'get'
        }).then(res => {
          //储存tabs信息
          let data = res.data.SecondMenuList;
          //提交tabs信息
          commit("updateSecondMenuList", res.data.SecondMenuList);
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetInfo({commit}) {
      return new Promise((resolve, reject) => {
        api({
          url: '/yz/users/me',
          method: 'get'
        }).then(res => {
          //储存用户信息
          let data = res.data.data;
          //提交用户信息
          commit("updateInfo", res.data.data);
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
})
//定义一个过滤器，将获取到的json数据中，每一个菜单，都添加进去一个 component 组件信息。
function filterAsyncRouter(routers)
{
  // 遍历后台传来的路由字符串，转换为组件对象
  let accessedRouters = routers.filter(router =>
  {
    if (router.component === "Layout")
    {
      // 父组件处理
      router.component = Layout;
    }
    else
    {
      //处理子路由组件
      router.component = loadView(router.component);
    }
    //存在子集
    if (router.children && router.children.length)
    {
      router.children = filterAsyncRouter(router.children);
    }
    return true;
  });
  return accessedRouters;
}
function loadView(view)
{
  // 路由懒加载
  return () => import(`@/views/software/${view}`);

}
export default store





