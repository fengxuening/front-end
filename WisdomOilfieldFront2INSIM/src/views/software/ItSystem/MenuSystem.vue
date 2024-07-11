<template>
  <div class="MainDiv">
    <!-- 添加一级菜单 -->
    <a-modal v-model:visible="addFirstMenuVis"
             :title="'添加一级菜单'"
             centered footer="" width="50%">
      <a-form :model="addMenuForm" ref="addMenuForm" :rules="menuRules">
        <a-form-item label="菜单名称" name="menuName" has-feedback>
          <a-input v-model:value="addMenuForm.menuName" placeholder="请输入菜单名称" style="width: 70%; "></a-input>
        </a-form-item>
        <a-form-item label="菜单Url" name="url" has-feedback>
          <a-input v-model:value="addMenuForm.url" placeholder="请输入菜单Url" style="width: 70%; "></a-input>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" @click="addFirstMenuClick">增加</a-button>
      </div>
    </a-modal>
    <!-- 添加二级菜单 -->
    <a-modal v-model:visible="addSecondMenuVis"
             :title="'添加二级菜单'"
             centered footer="" width="20%">
      <a-form :model="addMenuForm" ref="addMenuForm" :rules="menuRules">
        <a-form-item label="菜单名称" name="menuName" has-feedback>
          <a-input v-model:value="addMenuForm.menuName" placeholder="请输入菜单名称" style="width: 70%; "></a-input>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" @click="addSecondMenuClick">
          增加
        </a-button>
      </div>
    </a-modal>
    <!-- 修改菜单 -->
    <a-modal v-model:visible="updateMenuVis"
             :title="'修改菜单'"
             centered footer="" width="20%">
      <a-form :model="addMenuForm" ref="addMenuForm" :rules="menuRules">
        <a-form-item label="菜单名称" name="menuName" has-feedback>
          <a-input v-model:value="addMenuForm.menuName" placeholder="请输入菜单名称" style="width: 70%; "></a-input>
        </a-form-item>
        <a-form-item v-if="menuPanduan" label="菜单Url" name="url" has-feedback>
          <a-input v-model:value="addMenuForm.url" placeholder="请输入菜单Url" style="width: 70%; "></a-input>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" @click="updateMenuClick">修改
        </a-button>
      </div>
    </a-modal>
    <a-card hoverable class="MainCard" style="height: 100%; width: 70%">
      <template #title>
        <a style="font-weight:bold;font-size: 25px;color: black;">
          <apartment-outlined /> 菜单管理</a>
      </template>
      <!-- 添加一级菜单 -->
      <template #extra>
        <a-button type="primary" style="borderRadius:5px;height: 40px;" @click="addFirstMenu()">
          <plus-circle-outlined /> 添加一级菜单
        </a-button>
      </template>
      <a-row type="flex" justify="space-between" style="align-self: center;">
        <a-table :columns="menuDataCol"
                 :dataSource="menuTree"
                 :bordered="true"
                 :pagination="false"
                 :expandRowByClick="false"
                 :rowKey="(index)=>{return index}"
                 style="white-space:pre-wrap; width: 100%"
                 class="tableClass">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex==='operate'">
              <a-row>
                <a-col span="9">
                  <a-button type="primary" size="small" ghost
                            v-if="record.children != null"
                            style="borderRadius:5px;margin-left: 15px"
                            @click="addSecondMenu(record)">
                    <plus-circle-outlined />添加子菜单
                  </a-button>

                </a-col>
                <a-col span="6" >
                  <a-button type="primary" size="small" ghost
                            @click="updateMenu(record)"
                            style="borderRadius:5px;margin-left: 20px">
                    <edit-outlined /> 修改
                  </a-button>
                </a-col>
                <a-col span="6">
                  <a-button type="primary" danger size="small" ghost
                            @click="removeMenu(record)"
                            style="borderRadius:5px; margin-left: 25px">
                    <delete-outlined /> 删除
                  </a-button>
                </a-col>
              </a-row>
            </template>
          </template>
        </a-table>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { GetMenuTree } from '@/api/SystemIndex'
import { AddMenu } from '@/api/SystemIndex'
import { GetMenuById } from '@/api/SystemIndex'
import { GetFirstMenuList } from '@/api/SystemIndex'
import { DeleteMenuById } from '@/api/SystemIndex'

import {PlusCircleOutlined,EditOutlined,DeleteOutlined,ApartmentOutlined} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
var qs = require('qs')
export default {
  name: "MenuSystem",
  components:{
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    ApartmentOutlined
  },
  data() {
    return {
      menuDataCol:[
        {
          title:'菜单',
          dataIndex:'menuName',
          align:'left',
          width:350
        },
        {
          title:'操作',
          dataIndex:'operate',
          align:'center',
          width:300
        }
      ],
      menuTree: [],
      addMenuForm: {
        menuId: '',
        menuName: '',
        url: '',
        parentMenuId: 0,
        menuLevel: 1,
        parentMenuName: ''
      },
      dialogAddMenuForm: false,
      menuPanduan: false,
      updateMenuPanduan: false,
      options: [],
      menuValue: '',
      roleMenuList: [],
      expandKeys:[],
      menuAddTitle:false,
      menuRules:{
        menuName:[{
          required: true,
          validator: async(rule, value)=>{
            if (value === '') {
              return Promise.reject("菜单名称不能为空，请输入菜单名称！")
            } else {
              return Promise.resolve()
            }
          },
          trigger: 'blur',
        }],
        url:[{
          required: true,
          validator: async(rule, value)=>{
            if (value === '') {
              return Promise.reject("Url不能为空，请输入Url！")
            } else {
              return Promise.resolve()
            }
          },
          trigger: 'blur',
        }]
      },
      addFirstMenuVis:false,
      addSecondMenuVis:false,
      updateMenuVis:false,
    }
  },
  mounted() {
    this.getMenuTree()
  },
  methods: {
    //得到全部菜单树
    getMenuTree() {
      GetMenuTree().then(
          response => {
            this.menuTree = response.allMenuList
          }
      )
    },
    //找到最大menuTree中最大的menuId
    // searchMaxmenuTreeId(){
    //   for (let i = 0; i < this.menuTree.length; i++) {
    //     var maxMenuTreeId = 0
    //     ////console.log(this.menuTree[i].menuId)
    //     if(this.menuTree[i].children){
    //       for (let j = 0; j < this.menuTree[i].children.length; j++) {
    //         if(this.menuTree[i].children[j].menuId > maxMenuTreeId){
    //           maxMenuTreeId = this.menuTree[i].children[j].menuId
    //         }
    //         ////console.log(this.menuTree[i].children[j].menuId)
    //       }
    //     }
    //   }
    //   return maxMenuTreeId
    // },

    //点击 添加一级菜单 按钮
    addFirstMenu(){
      this.addFirstMenuVis = true
      this.addMenuForm = {
        menuId: '',
        menuName: '',
        url: '',
        parentMenuId: 0,
        menuLevel: 1,
        parentMenuName: ''
      }
    },
    //点击 添加一级菜单 -确定- 按钮
    addFirstMenuClick(){
      if(this.addMenuForm.menuName && this.addMenuForm.url){
        //this.addMenuForm.menuId = this.searchMaxmenuTreeId() + 1
        var params = qs.stringify(this.addMenuForm)
        AddMenu(params).then(
            response => {
              if (this.addMenuForm.menuId === '') {
                message.success('添加成功!')
              }
              this.getMenuTree()
              this.expandKeys = [this.addMenuForm.parentMenuId]
              this.addFirstMenuVis = false
            }
        ).catch(error=>{
          //console.log(error)
        })
      }else{
        message.warning("请填写菜单信息后再提交！")
      }
    },

    //点击 添加二级菜单 按钮
    addSecondMenu(record){
      this.addSecondMenuVis = true
      this.addMenuForm = {
        menuId: '',
        menuName: '',
        url: '',
        parentMenuId: 0,
        menuLevel: 2,
        parentMenuName: ''
      }
      this.addMenuForm.parentMenuId = record.menuId
    },


    //点击 添加二级菜单 -确定- 按钮
    addSecondMenuClick(){
      if(this.addMenuForm.menuName){
        // //遍历所有的树，判断下传到前台来的所有模块的最大menuid，在新增时+1赋值就可以了
        //this.addMenuForm.menuId = this.searchMaxmenuTreeId() + 1
        var params = qs.stringify(this.addMenuForm)
        AddMenu(params).then(
            response => {
              message.success('添加成功!')
              this.getMenuTree()
              this.expandKeys = [this.addMenuForm.parentMenuId]
              this.addSecondMenuVis = false
            }
        )
      }else{
        message.warning("请填写菜单信息后再提交！")
      }
    },

    //点击 修改菜单 按钮
    updateMenu(record){
      this.updateMenuVis = true
      var params = {
        menuId: record.menuId
      }
      GetMenuById(params).then(
          response => {
            this.addMenuForm = response.menu
          }
      )
      GetFirstMenuList().then(
          response => {
            this.options = response.firstMenuList
            //console.log(this.options)
          }
      )
      this.updateMenuPanduan = true
      //二级分类，孩子属性为null
      if (record.children == null) {
        this.menuPanduan = false
        this.menuValue = this.addMenuForm.parentMenuId
      } else {
        //一级分类，孩子不为null
        this.menuPanduan = true
        this.addMenuForm.menuName = record.menuName
      }
    },
    //点击 修改一级菜单 修改按钮
    updateMenuClick(){
      var params = qs.stringify(this.addMenuForm)
      ////console.log(params)
      AddMenu(params).then(
          response => {
            message.success('修改成功！')
            this.getMenuTree()
            this.expandKeys = [this.addMenuForm.parentMenuId]
            this.updateMenuVis = false
          }
      )
    },
    //点击删除按钮
    removeMenu(record) {
      var params = {
        menuId: record.menuId
      }
      DeleteMenuById(params).then(response => {//删除成功
        message.success('删除成功!')
        //回到列表页面
        this.getMenuTree()
      })
    },
  }
};

</script>
<style scoped>
.MainCard {
  border: 3px solid #e8e8e8;
}
:deep( .ant-table-tbody > tr > td ){
  padding: 8px!important;
}
:deep( .ant-table-thead > tr > th){
  font-weight: bolder;
}
:deep( .ant-table-cell){
  padding: 8px;
}
.tableClass:deep(.ant-table-thead > tr > th) {
  border: 0.1px solid #edecec;
  border-right: 0.1px solid #edecec;
}
</style>
