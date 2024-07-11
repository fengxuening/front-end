<template>
  <div class="dashboard-container">

  </div>
</template>
<script>
import {router} from "@/router";

export default {
  name: 'dashboard',
  data() {
    return {}

  },
  created(){
   this.getRoute()
  },
  computed:{
    showTabs(){
      let menuList,secondMenuList;
      menuList=localStorage.getItem('MenuList');
      let mm=JSON.parse(menuList);
      return mm
    }
  },
  methods:{
    getRoute(){
      let isDefault=`${window.location.pathname+window.location.search}`
      if(isDefault==='/dashboard'){
        var route = this.showTabs[0].redirect
        router.push(route)
      }
    }
  }
}
</script>
