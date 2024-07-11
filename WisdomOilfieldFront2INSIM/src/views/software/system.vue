<template>
  <div class="sysMenu" style="height: 100%">
    <a-layout-header style="background: #fff;line-height: 50px;height: 50px;border: #5db4f3 2px solid;border-bottom: 0px solid;padding-left: 25px">
      <span style="width:200px;font-size: 18px;color:black;font-weight: bold;display: inline-block" >{{MenuTitle}}</span>
    </a-layout-header>
    <a-menu  v-model:selectedKeys="tabskey" mode="inline" style="border: #5db4f3 2px solid;height: 100%" @click="menuChange">
      <a-menu-item key="1" v-if="showTabs.showList[0]===1">
        <span style="font-weight: bold;">{{menuNames[0].children[0].menuName}}</span>
      </a-menu-item>
      <a-menu-item key="2" v-if="showTabs.showList[1]===1">
        <span style="font-weight: bold;">{{menuNames[0].children[1].menuName}}</span>
      </a-menu-item>
      <a-menu-item key="3" v-if="showTabs.showList[2]===1">
        <span style="font-weight: bold;">{{menuNames[0].children[2].menuName}}</span>
      </a-menu-item>
      <a-menu-item key="4" v-if="showTabs.showList[3]===1">
        <span style="font-weight: bold;">{{menuNames[0].children[3].menuName}}</span>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import {GetMenuTree} from "@/api/SystemIndex";
export default {
  name: "system.vue",
  computed:{
    showTabs(){
      let menuList,secondMenuList;
      menuList=localStorage.getItem('MenuList');
      secondMenuList=localStorage.getItem('SecondMenuList');
      let ss=JSON.parse(secondMenuList);
      for (let i=0;i<=ss.length;i++){
        if(ss[i].parentMenuId===6){
          return ss[i];
        }
      }
    }
  },
  mounted() {
    this.menuNamesGet()
    this.autoshow()
  },
  data() {
    return {
      MenuTitle:undefined,
      mode:'top',
      size:'large',
      tabskey: ['1'],  //tab页
      menuNames:[{"menuId":6,"menuName":"系统管理 -> /system",
          "children":[{"menuId":29,"menuName":"用户管理"},{"menuId":30,"menuName":"角色管理"},{"menuId":31,"menuName":"菜单管理"},{"menuId":31,"menuName":"菜单管理"}]
        }],
    }
  },
  methods: {
    menuNamesGet(){
      GetMenuTree().then(
          response => {
            let cc = response.allMenuList
            this.menuNames = cc
            this.MenuTitle = this.menuNames[0].menuName.split(" ")[0]
          }
      )

    },
    menuChange(item){
      var key = parseInt(item.key)
      var menuName = this.menuNames[0].children[key-1].menuName
      var menu = {menuName:menuName,key:key-1,parentMenuId:6}
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
