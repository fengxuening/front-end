<!--<template>-->
<!--  <div class="menu-wrapper">-->
<!--    <template v-for="item in routes" v-if="!item.hidden&&item.children">-->
<!--      <router-link v-if="item.children.length===1 && !item.children[0].children"-->
<!--                   :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">-->
<!--        <a-menu-item :key="item.path+'/'+item.children[0].path" class='submenu-title-noDropdown'>-->
<!--&lt;!&ndash;          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" &ndash;&gt;-->
<!--&lt;!&ndash;                    :icon-class="item.children[0].meta.icon"></svg-icon>&ndash;&gt;-->
<!--          <a-icon :type="item.children[0] && item.children[0].meta && item.children[0].meta.icon" />-->
<!--          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{item.children[0].meta.title}}</span>-->
<!--        </a-menu-item>-->
<!--      </router-link>-->
<!--      <a-sub-menu enu v-else :index="item.name||item.path" :key="item.name">-->
<!--        <template slot="title">-->
<!--&lt;!&ndash;          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>&ndash;&gt;-->
<!--          <a-icon :type="item.children[0] && item.children[0].meta && item.children[0].meta.icon" />-->
<!--          <span v-if="item.meta&&item.meta.title">{{item.meta.title}}</span>-->
<!--        </template>-->
<!--        <template v-for="child in item.children" v-if="!child.hidden">-->
<!--          <sidebar-item class="nest-menu" v-if="child.children&&child.children.length>0"-->
<!--                        :routes="[child]" :key="child.path"></sidebar-item>-->
<!--          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">-->
<!--            <a-menu-item :index="item.path+'/'+child.path">-->
<!--&lt;!&ndash;              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>&ndash;&gt;-->
<!--              <span v-if="child.meta&&child.meta.title">{{child.meta.title}}</span>-->
<!--            </a-menu-item>-->
<!--          </router-link>-->
<!--        </template>-->
<!--      </a-sub-menu>-->
<!--    </template>-->

<!--  </div>-->
<!--</template>-->


<!--<script>-->

<!--export default {-->
<!--  name: 'SidebarItem',-->
<!--  props: {-->
<!--    routes: {-->
<!--      type: Array-->
<!--    }-->
<!--  },-->
<!--  methods: {-->

<!--  },-->

<!--  data() {-->
<!--    return {-->
<!--      defaultProps: {-->
<!--        children: 'children',-->
<!--        label: 'label'-->
<!--      }-->
<!--    };-->
<!--  }-->
<!--};-->
<!--</script>-->
