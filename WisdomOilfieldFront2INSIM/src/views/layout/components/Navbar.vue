<template>
  <a-dropdown >
    <a class="ant-dropdown-link" @click.prevent style="color: white;">
      退出
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu>
        <a-menu-item>
         <span @click="shouye" style="font-size: 10px">退回首页</span>
        </a-menu-item>
        <a-menu-item>
          <span @click="logout" style="display:block;font-size: 10px">退出系統</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script>
import { defineComponent } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import {router} from "@/router";
export default defineComponent({
  components: {
    DownOutlined,
  },

  methods: {
    shouye(){
      router.push({path:'/'})
    },
    logout() {
      this.$store.commit('clear')
      this.$router.push('/login')
    }
  },
  // watch:{
  //   $route(to, from) {
  //     window.location.reload(); //监测到路由发生跳转时刷新一次页面
  //   },
  // },
});
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
span.anticon.anticon-down.ant-dropdown-trigger {

  z-index: 1000;
}

</style>
