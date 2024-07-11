<template>
    <transition name="fade" mode="out-in" style="height: 100%">
      <a-layout>
        <a-layout-sider ref="layOutSider" width="200" style="background: #fff;padding-right: 5px" v-model:collapsed="collapsed" :trigger="null" collapsible collapsedWidth="0">
          <router-view @menuSelected="menuSelectedGet"></router-view>
        </a-layout-sider>
        <a-layout-content  style="background: white;position: relative;height: 100%;width: 100%">
          <menu-unfold-outlined v-if="collapsed" class="trigger"  @click="() => (collapsed = !collapsed)"/>
          <menu-fold-outlined v-else class="trigger"  @click="() => (collapsed = !collapsed)" />
        <div style="border: #5db4f3 2px solid;height: 100%;display: flex;flex-direction: row">
          <a-tabs :style="{width:leftTabWidth}" size="large" v-model:activeKey="leftActiveKey" hide-add type="editable-card" @edit="leftMenuRemove" @tabClick=tabLeft2Right>
            <a-tab-pane v-for="pane in leftPanes" :key="pane.key" :closable="pane.closable">
              <template #tab>
                <span style="">
                  {{pane.title}}
                </span>
              </template>
              <div>
                <div class="sysManage">
                  <UserSystem class="sysManageItem" v-if="pane.totalid==='60'"></UserSystem>
                  <RoleSystem class="sysManageItem" v-if="pane.totalid==='61'"></RoleSystem>
                  <MenuSystem class="sysManageItem" v-if="pane.totalid==='62'"></MenuSystem>
                  <LogSystem class="sysManageItem" v-if="pane.totalid==='63'"></LogSystem>
                </div>
                <div class="conMod">
                  <WellInfo class="conModItem" v-if="pane.totalid==='940'"></WellInfo>
                  <MeshEdit class="conModItem" v-if="pane.totalid==='941'"></MeshEdit>
                  <RelativeK class="conModItem" v-if="pane.totalid==='942'"></RelativeK>
                </div>
                <div class="historyMatch">
                  <history-l v-if="pane.totalid==='970'" ></history-l>
                  <param-fit v-if="pane.totalid==='971'" ></param-fit>
                </div>
                <div class="runSim">
                  <ready-run v-if="pane.totalid==='1010'" ></ready-run>
                  <sim-result v-if="pane.totalid==='1011'" ></sim-result>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
          <a-tabs :style="{width:RightTabWidth}" size="large" v-model:activeKey="rightActiveKey" hide-add type="editable-card" @edit="rightMenuRemove" @tabClick=tabRight2Left >
            <a-tab-pane v-for="pane in rightPanes" :key="pane.key" :closable="pane.closable" >
              <template #tab>
                <span >
                  {{pane.title}}
                </span>
              </template>
              <div class="sysManage">
                <UserSystem v-if="pane.totalid==='60'"></UserSystem>
                <RoleSystem v-if="pane.totalid==='61'"></RoleSystem>
                <MenuSystem v-if="pane.totalid==='62'"></MenuSystem>
                <LogSystem v-if="pane.totalid==='63'"></LogSystem>
              </div>
              <div class="conMod">
                <WellInfo v-if="pane.totalid==='940'"></WellInfo>
                <MeshEdit v-if="pane.totalid==='941'"></MeshEdit>
                <RelativeK v-if="pane.totalid==='942'"></RelativeK>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout-content>
      </a-layout>
    </transition>
</template>

<script>
import MenuSystem from "@/views/software/ItSystem/MenuSystem";
import UserSystem from "@/views/software/ItSystem/UserSystem";
import RoleSystem from "@/views/software/ItSystem/RoleSystem";

import MeshEdit from "@/views/software/ItConmod/MeshEdit";
import RelativeK from "@/views/software/ItConmod/RelativeK";
import WellInfo from "@/views/software/ItConmod/WellInfo";

import HistoryL from "@/views/software/hisMatch/historyL";
import ParamFit from "@/views/software/hisMatch/paramFit";

import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons-vue'
import LogSystem from "@/views/software/ItSystem/LogSystem";
import { toRaw } from '@vue/reactivity'
import ReadyRun from "@/views/software/runSim/readyRun";
import SimResult from "@/views/software/runSim/simResult";


export default {
  name: 'AppMain',
  components:{
    SimResult,
    ReadyRun,
    ParamFit,
    HistoryL,
    WellInfo,
    RelativeK,
    MeshEdit,
    LogSystem,
    MenuUnfoldOutlined, MenuFoldOutlined,MenuSystem, UserSystem, RoleSystem},
  computed: {
  },
  mounted() {
  },
  data(){
    return{
      leftTabWidth:'100%',
      RightTabWidth:'0%',
      leftPanes:[],
      rightPanes:[],
      leftActiveKey:undefined,
      rightActiveKey:undefined,
      collapsed:false,
    }
  },

  methods:{
    menuSelectedGet(menu){
      this.leftActiveKey = String(menu.parentMenuId)+String(menu.key)
      var pane = {
        title:menu.menuName,
        key:String(menu.parentMenuId)+String(menu.key),
        content:1,
        closable:true,
        totalid :String(menu.parentMenuId)+String(menu.key)
      }
      var found = false;
      for (var i = 0; i < this.leftPanes.length; i++) {
        if (JSON.stringify(toRaw(this.leftPanes[i])) === JSON.stringify(pane)) {
          found = true;
          break;
        }
      }
      if (found) {}
      else {this.leftPanes.push(pane)}

    },
    leftMenuRemove(targetKey){
      let lastIndex = 0;
      this.leftPanes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      this.leftPanes = this.leftPanes.filter(pane => pane.key !== targetKey);
      if (this.leftPanes.length && this.leftActiveKey === targetKey) {
        if (lastIndex >= 0) {
          this.leftActiveKey = this.leftPanes[lastIndex].key;
        } else {
          this.leftActiveKey= this.leftPanes[0].key;
        }
      }
    },
    rightMenuRemove(targetKey){
      let lastIndex = 0;
      this.rightPanes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      this.rightPanes = this.rightPanes.filter(pane => pane.key !== targetKey);
      if (this.rightPanes.length && this.rightActiveKey === targetKey) {
        if (lastIndex >= 0) {
          this.rightActiveKey = this.rightPanes[lastIndex].key;
        } else {
          this.rightActiveKey= this.rightPanes[0].key;
        }
      }
      if (this.rightPanes.length===0){
        this.RightTabWidth='0%'
        this.leftTabWidth='100%'
      }
    },

    tabLeft2Right(tabKey){

      if (tabKey===this.leftActiveKey){
        // 如果当前点击的是正在激活的tab
        for (let i = 0; i < this.leftPanes.length; i++){
          const element = this.leftPanes[i];
          if (element.key===tabKey){
            //并且这个tab在左边
            this.leftMenuRemove(tabKey)
            this.rightPanes.push(element)
            break
          }
        }
        this.rightActiveKey=tabKey
        this.RightTabWidth='50%'
        this.leftTabWidth='50%'
      }
      else {
        this.leftActiveKey=tabKey
      }
      console.log("=================")
      console.log('this.leftPanes')
      console.log(this.leftPanes)
      console.log('this.leftActiveKey')
      console.log(this.leftActiveKey)

      console.log('this.rightPanes')
      console.log(this.rightPanes)
      console.log('this.rightActiveKey')
      console.log(this.rightActiveKey)
    },
    tabRight2Left(tabKey){
      if (tabKey===this.rightActiveKey){
        for (let i = 0; i < this.rightPanes.length; i++){
          const element = this.rightPanes[i];
          if (element.key===tabKey){
            this.rightMenuRemove(tabKey)
            this.leftPanes.push(element)
            break
          }
        }
        this.leftActiveKey=tabKey
      }
      else {
        this.rightActiveKey=tabKey
      }
      console.log("=================")
      console.log('this.leftPanes')
      console.log(this.leftPanes)
      console.log('this.leftActiveKey')
      console.log(this.leftActiveKey)

      console.log('this.rightPanes')
      console.log(this.rightPanes)
      console.log('this.rightActiveKey')
      console.log(this.rightActiveKey)
    }

  }
}
</script>
<style>
</style>
<style scoped>
.conMod{
  height: 100%;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn){
  font-weight:bold;color: #1d4fb0;
}
:deep(.ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap, .ant-tabs > div > .ant-tabs-nav .ant-tabs-nav-wrap){
  border-bottom:#5db4f3 2px solid;height: 50px;padding-left: 60px;
}
:deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-nav-list ){
  background: #F5F5F5;
  border-radius: 2px;
  display: flex;
  align-items: center;
}
:deep(.ant-tabs-card > .ant-tabs-nav ){
  height: 35px;
}
:deep(.trigger){
  font-size: 20px;
  line-height: 60px;
  padding: 0 20px;
  cursor: pointer;
  transition: color 0.3s;
  float: left;position: absolute;z-index: 99
}
</style>
