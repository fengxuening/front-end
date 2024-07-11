<template>
  <a-layout>
    <a-layout-header>
      <div :class="{hideSidebar:!sidebar.opened}">
        <a-row>
          <a-col span="6">
              <span class="title">
                  智能注采优化平台
              </span>
          </a-col>
          <a-col span="17">
            <a-menu   class="a-menu-demo"   mode="horizontal" unique-opened :default-active="$route.path" :collapse="isCollapse">
              <HeadbarItem :routes="permission_routers" ></HeadbarItem>
            </a-menu>
          </a-col>
          <a-col span="1">
            <navbar ></navbar>
          </a-col>
        </a-row>
      </div>

    </a-layout-header>
    <a-layout-content  style="background: white;position: relative">
      <app-main></app-main>
    </a-layout-content>
    </a-layout>
</template>
<script>
import { Navbar, Sidebar, AppMain} from '@/views/layout/components'
import {mapGetters} from 'vuex'
import HeadbarItem from './components/HeadbarItem'
export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    HeadbarItem,
  },
  mounted() {
    this.$store.dispatch('GetInfo');
    //this.$store.dispatch('GetTabs');
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'userinfo',
      'menuList',
      'secondMenuList'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    },
    sidebar() {
      return this.$store.state.sidebar
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
//@keyframes example {
//  0%   {background-color: #E0FFFF;}
//  25%  {background-color: #FFFFE0;}
//  50%  {background-color: #F0FFFF;}
//  100% {background-color: #F5F5DC;}
//}
.app-main{
  margin-top: 2px;
}
.title{
  font-size: 28px;
  text-align: center;
  color:white;
  font-weight: bold;
}
.ant-menu {
  background: #115b9f;
}
.ant-layout-content {
  flex: auto;
  min-height: 0;
  padding-left: 5px;
  padding-right: 5px;
}
.ant-layout-header {
  height: 67px;
  padding: 0 50px;
  background: #115b9f;
  line-height: 68px;

}


.spans{
  height: 57px;
  animation-name: example;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  text-align: center;
  text-transform: uppercase;
  color: #4CAF50;
  text-indent: 50px;
  text-align: justify;
  letter-spacing: 3px;
}



.a-menu-lineone{
  height: 30px;
  justify-content: space-between;
  padding-left: 0;
  display: -webkit-inline-flex;
  align-items: center;
  margin-bottom: 0;
  border-bottom-style:none
}
.a-menu-linetwo{
  height: 50px;
  justify-content: space-between;
  padding-left: 0;
  display: -webkit-inline-flex;
  align-items: center;
  margin-bottom: 0;
  border-bottom-style:none
}
.a-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  background-color: #373d3f;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.grid-content bg-purple{
  text-align:center
}
.avatar-container {
  height: 50px;
  display: inline-block;
  position: absolute;
  right: 35px;
  .avatar-wrapper {
    cursor: pointer;
    margin-top: 5px;
    position: relative;
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    .a-icon-caret-bottom {
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>
