<template>
  <a-config-provider :locale="locale" >
    <div id="App" style="height: 100%">
      <router-view style="height: 100%"></router-view>
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import {mapGetters} from "vuex";
dayjs.locale('cn');
export default {
  name: 'app',
  data(){
    return {
      locale: zhCN,
    }
  },
  components:{
  },
  computed: {
    ...mapGetters([
      'menuList',
    ]),
  }
}
</script>
<style lang="scss" scoped>
//@import '~normalize.css/normalize.css';// normalize.css 样式格式化
@import './styles/index.scss'; // 全局自定义的css样式
span{
  font-family: inherit;
  font-size: inherit;
}
</style>
