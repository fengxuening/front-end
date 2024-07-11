<template>
  <div style="background: #0284c7">
    <a-menu mode="horizontal">
    <template v-for="item in routes"   >
     <template v-if="!item.hidden&&item.children">
      <router-link v-if="item.children.length===1 && !item.children[0].children" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <a-menu-item :key="item.path+'/'+item.children[0].path">
           <home-outlined/>
          <span  v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>
         </a-menu-item>
      </router-link>
    </template>
    </template>
    </a-menu>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import {
  HomeOutlined,
} from '@ant-design/icons-vue';
export default defineComponent({
  components: {
    HomeOutlined,
  },
  mounted() {
     //this.me();
  },
  methods:{

  },
  name: 'VerticlebarItem',
  props: {
    routes: {
      type: Array
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
      }
    };
  },

});
</script >
<style scoped>
.sub{
  margin-right: 0px;
}
:deep(.ant-menu-item-selected){
  color: #fff257;
}
/*.SSspan{*/
/*  font-family: sans-serif;*/
/*  font-size: 22px;*/
/*  font-weight: bold;*/
/*  color: black;*/
/*}*/
.a-submenu__title{
  background-color:#0284c7 ;
}
.ant-menu-horizontal {
  border: 0;
  box-shadow: none;
}
.ant-menu-overflow-item {
  flex: none;
  background: #0284c7;
}

.ant-menu-overflow {
  display: flex;
  background: #115b9f;
}
/*.ant-menu {*/
/*  color: #0284c7;*/
/*}*/
/*.ant-menu-item, .ant-menu-submenu-title {*/
/*  position: relative;*/
/*  display: block;*/
/*  margin: 0;*/
/*  background: #0284c7;*/
/*}*/
a {
  color: white;
  font-weight: bold;
  font-size:20px;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
  -webkit-text-decoration-skip: objects;
}
</style>
