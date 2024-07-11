<template>
  <div class="MainDiv" style="height: 845px">
    <a-layout-header style="background: #fff;line-height: 50px;height: 50px;border: #5db4f3 2px solid;border-bottom: 0px solid;padding-left: 25px">
      <span style="width:200px;font-size: 18px;color:black;font-weight: bold;display: inline-block" >{{MenuTitle}}</span>
    </a-layout-header>
    <a-menu  v-model:selectedKeys="tabskey" mode="inline" style="border: #5db4f3 2px solid;height: 100%" @click="menuChange">
      <a-menu-item key="1" v-if="showTabs.showList[0]===1">
        <span style="font-weight: bold;">{{menuNames[2].children[0].menuName}}</span>
      </a-menu-item>
      <a-menu-item key="2" v-if="showTabs.showList[1]===1">
        <span style="font-weight: bold;">{{menuNames[2].children[1].menuName}}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script >
import {GetMenuTree} from "../../api/SystemIndex.js";

export default {
  name: "his",
  computed:{
    showTabs(){
      let secondMenuList;
      secondMenuList=localStorage.getItem('SecondMenuList');
      let ss=JSON.parse(secondMenuList);
      for (let i=0;i<=ss.length;i++){
        if(ss[i].parentMenuId===97){
          return ss[i];
        }
      }
    }
  },
  mounted() {
    this.menuNamesGet()
    this.autoshow()//在一级菜单点击（侧边栏加载）的时候显示二级菜单
  },
  data() {
    return {
      MenuTitle:undefined,
      mode:'top',
      size:'large',
      tabskey: ['3'],  //tab页
      menuNames:[
        {
          "menuId":6,
          "menuName":"系统管理 -> /system",
          "children":
              [{"menuId":29,"menuName":"用户管理"},{"menuId":30,"menuName":"角色管理"},{"menuId":31,"menuName":"菜单管理"},{"menuId":31,"menuName":"菜单管理"}]
        },
        {
          "menuId":94,
          "menuName":"连通模型 -> /conmod",
          "children":
              [{"menuId":95,"menuName":"井点信息"},{"menuId":96,"menuName":"井网剖分"},{"menuId":98,"menuName":"相渗数据"}]
        },
        {
          "menuId":97,
          "menuName":"历史拟合 -> /his",
          "children":
              [{"menuId":105,"menuName":"生产动态"},{"menuId":107,"menuName":"参数拟合"}]
        },
      ]
    }
  },
  methods: {
    menuNamesGet(){
      GetMenuTree().then(
          response => {
            let cc = response.allMenuList
            this.menuNames = cc
            console.log(this.menuNames[2].children[0].menuName)
            this.MenuTitle = cc[2].menuName.split(" ")[0]
          }
      )
    },
    menuChange(item){
      var key = parseInt(item.key)
      var menuName = this.menuNames[2].children[key-1].menuName
      var menu = {menuName:menuName,key:key-1,parentMenuId:97}
      this.$emit("menuSelected",menu)
    },
    autoshow(){
      for (let i = 0; i < this.showTabs.showList.length; i++) {
        if(this.showTabs.showList[i]===1){
          this.menuChange({'key':i+1})
          break
        }
      }
    }
  }
}
</script>

<style scoped>
* {
  color: #000 !important;
  font-family: sans-serif !important;
}

.ant-btn-primary{
  color: white !important;
}

.MainCard {
  border: 3px solid #e8e8e8;
}
</style>