<template>
  <div class="MainDiv" style="width: 100%">
      <!-- 弹出框 -->
    <!-- 添加角色 -->
    <a-modal title="添加角色" v-model:visible="dialogAddRoleForm" width="25%" centered footer="">
      <a-form :model="addRoleForm" ref="addRoleRorm" :rules="roleRules">
        <a-form-item label="角色名称" has-feedback name="roleName">
          <a-input v-model:value="addRoleForm.roleName" @change="roleNameExist" placeholder="请输入角色名称" style="width: 100%; "/>
        </a-form-item>
        <a-form-item label="角色描述" has-feedback name="roleDescription">
          <a-input v-model:value="addRoleForm.roleDescription" placeholder="请输入角色描述" style="width:100%; "/>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <a-button type="primary" @click="addRoleClick">增加
<!--          {{ addRoleForm.roleId == '' ? "修改" : "增加"}}-->
        </a-button>
      </div>
    </a-modal>
    <!-- 修改角色 -->
    <a-modal title="修改角色" v-model:visible="dialogAddRoleFormUpdate" width="25%" centered footer="" style="text-align: center">
      <a-form :model="addRoleForm" ref="addRoleRorm" :rules="roleRules">
        <a-form-item label="角色名称" has-feedback name="roleName">
          <a-input v-model:value="addRoleForm.roleName" placeholder="请输入角色名称" style="width: 100%; "/>
        </a-form-item>
        <a-form-item label="角色描述" has-feedback name="roleDescription">
          <a-input v-model:value="addRoleForm.roleDescription" placeholder="请输入角色描述" style="width: 100%; "/>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <a-button type="primary" @click="updateRoleClick">修改
<!--          {{ addRoleForm.roleId == '' ? "修改" : "增加"}}-->
        </a-button>
      </div>
    </a-modal>
    <!-- 编辑用户权限 -->
    <a-modal title="编辑用户权限" v-model:visible="dialogRoleMenu" width="20%" centered footer="">
      <div style="height:500px">
        <a-tree checkable :height="400" :width="500"
                ref="treeRoleMenu" :tree-data="menuTree"
                :field-names="{children: 'children',title: 'menuName',key:'menuId'}"
                @check="handleCheckMenu"
                v-model:expandedKeys="expandedKeys"
                v-model:checkedKeys="checkedKeys">
        </a-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" @click="addRoleMenuClick">确定</a-button>
      </div>
    </a-modal>

<!--    <a-modal-->
<!--        v-model:visible="deleteRoleModel"-->
<!--        title="删除角色"-->
<!--        :destroyOnClose="true"-->
<!--        :width="350"-->
<!--        @cancel="function (){ deleteRoleModel = false}"-->
<!--        @ok="removeRoleDataById">-->
<!--      <span>确定要删除该用户吗？</span>-->
<!--    </a-modal>-->

    <a-card hoverable class="MainCard" style="height: 100%; width: 100%">
      <template #title >
        <a style="font-weight:bold;font-size: 25px;color: black;">
          <user-add-outlined />  角色管理</a>
      </template>
      <template #extra>
        <a-form class="labelWeighter" layout="inline" >
          <a-button type="primary" @click="addRoleTo" style="borderRadius:5px; margin-right: 50px; height: 40px;">
          <plus-circle-outlined />添加角色
        </a-button>
          <a-form-item>
            <a-input v-model:value="queryRoleName" placeholder="角色名称" style="height: 40px"></a-input>
          </a-form-item>
          <a-button type="primary" @click="getRoleList()" style="borderRadius:5px; height: 40px; margin-left: 20px">
            <search-outlined /> 查询
          </a-button>
          <a-button type="default" @click="resetRoleData" style="borderRadius:5px; height: 40px; margin-left: 20px">
            <sync-outlined /> 清空
          </a-button>
        </a-form>
      </template>
      <a-row>
        <a-table
            v-model:columns="roleDataCol"
            :dataSource="roleList"  max-height="100;"
            :bordered="true"
            :pagination="false"
            class="tableClass"
            style="white-space:pre-wrap; width: 100%" >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex==='number'">
              <span>{{`${(rolePage-1)*roleLimit + (index + 1)}`}}</span>
            </template>
            <template v-if="column.dataIndex==='operate'">
              <a-row>
                <a-col span="7">
                  <a-button type="primary" ghost size="small"
                            @click="updateRoleTo(record.roleId)"
                            style="borderRadius:5px"><edit-outlined /> 修改
                  </a-button>
                </a-col>
                <a-col span="7">
                  <a-button type="primary" ghost size="small"
                            @click="roleMenuClick(record.roleId)"
                            style="borderRadius:5px; margin-left: 15px"><setting-outlined /> 权限
                  </a-button>
                </a-col>
                <a-col span="7">
                  <a-button type="primary" danger ghost size="small"
                            @click="removeRoleDataById(record.roleId)"
                            style="borderRadius:5px; margin-left: 30px"><delete-outlined /> 删除
                  </a-button>
                </a-col>
              </a-row>
            </template>
          </template>
        </a-table>
      </a-row>
      <a-row style="margin-top: 10px; float: right">
        <a-pagination :current="rolePage"
                      :pageSize="roleLimit"
                      :total="roleTotal"
                      :show-total="total => `共 ${roleTotal} 条`"
                      class="tableClass"
                      style="margin-top: 20px; float: right"
                      @change="getRoleList" />
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { GetRoleList } from '@/api/SystemIndex'
import { GetRoleAllList } from '@/api/SystemIndex'
import { DeleteRoleId } from '@/api/SystemIndex'
import { AddRole } from '@/api/SystemIndex'
import { GetRoleById } from '@/api/SystemIndex'
import { GetRoleMenuList } from '@/api/SystemIndex'
import { BatchInsertRoleMenu } from '@/api/SystemIndex'
import {  GetRoleExistByName } from '@/api/SystemIndex'

import { GetMenuTree } from '@/api/SystemIndex'
import {UserAddOutlined, SettingOutlined, PlusCircleOutlined, SearchOutlined, DeleteOutlined, EditOutlined, SyncOutlined} from '@ant-design/icons-vue';

import { message } from 'ant-design-vue';
var qs = require('qs')
export default {
  components:{
    UserAddOutlined,
    SettingOutlined,
    PlusCircleOutlined,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    SyncOutlined
  },
  data() {
    return {
      deleteRoleModel:false,
      dialogAddRoleFormUpdate:false,
      menuId:null,
      roleDataCol:[
        {
          title:'序号',
          dataIndex:'number',
          width:100,
          align:'center'
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
          width:140,
          align:'center'
        },
        {
          title: '角色描述',
          dataIndex: 'roleDescription',
          width:140,
          align:'center'
        },
        {
          title: '操作',
          dataIndex: 'operate',
          width: 160,
          align:'center'
        },
      ],
      activeName: 'first',
      dialogFormVisible: false, //增加用户对话框
      choiceRoleDialogFormVisible: false,//角色选择对话框
      addRoleForm: {
        roleId: '',
        roleName: '',
        roleDescription: ''
      },
      dialogAddRoleForm: false,
      roleList: null,
      roleAllList: null,
      checkRoleList: [], //多选框选择角色
      queryRoleName: '',
      rolePage: 1,  //当前页
      roleLimit: 12, //每页记录数
      roleTotal: 0,   //总记录数
      dialogRoleMenu: false,
      currentRoleId: '',
      roleExistList:[],//输入名查询list
      roleRules:{
        roleName: [{
          required: true,
          validator: async(rule, value) =>{
            value = this.addRoleForm.roleName
            if (value === ''){
              return Promise.reject("用户角色名称不能为空，请输入角色名称！")
            }else{
              for (let i = 0; i < this.roleExistList.length; i++) {
                if(this.addRoleForm.roleName === this.roleExistList[i].roleName){
                  this.addRoleForm.roleId = this.roleExistList.filter((i)=>i.roleName === this.addRoleForm.roleName)[0].roleId
                  return Promise.reject("用户角色已存在，请重新输入！")
                }
              }
            }
          },trigger:'blur'
        }],
        roleDescription: [{
          required: true,
          validator: async(rule, value)=>{
            value = this.addRoleForm.roleDescription
            if (value === '') {
              return Promise.reject("角色描述不能为空，请输入角色描述！")
            } else {
              return Promise.resolve();
            }
          },
          trigger: 'blur',
        }]
      },
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
      options: [],
      roleMenuList: [],
      expandedKeys:undefined,
      selectedKeys:undefined,
      checkedKeys:undefined,
      childIdArray:[],
    };
  },
  mounted() {
    this.getRoleList()
    this.getMenuTree()

  },
  methods: {
    //得到全部权限树
    getMenuTree() {
      GetMenuTree().then(
          response => {
            this.menuTree = response.allMenuList
            var childIdArray = []
            for (let i = 0; i < this.menuTree.length; i++) {
              var father = this.menuTree[i]
              if(father.children && father.children.length>0){
                for (let j = 0; j < father.children.length; j++) {
                  var child = father.children[j]
                  childIdArray.push(child.menuId)
                }
              }
            }
            //console.log(childIdArray)
            this.childIdArray = childIdArray
          }
      )
    },
    roleNameExist(event){
      var rolename = this.addRoleForm.roleName
      if(rolename){
        var params = {
          roleName: rolename
        }
        GetRoleExistByName (params).then(
            response => {
              this.roleExistList = response.roleList
            }
        ).catch(error=>{
          //console.log(error)
          this.roleExistList = []
        })
      }
    },
    /**
     * 点击多选框实现角色选择
     * 将多选框中的checkRoleList列表转换成userRoleNames字符串
     * 并查找userRoleNames相应id,将id合并转换为userRoles字符串
     */
    resetRoleData() {
      //清空表单
      this.queryRoleName = ''
      //调用getList()查询全部数据信息
      this.getRoleList()
    },
    //条件查询角色
    getRoleList(page = 1) {
      this.rolePage = page
      var params = {
        roleName: this.queryRoleName,
        pn: this.rolePage,
        pageSize: this.roleLimit
      }
      GetRoleList(params)
          .then(response => { //请求成功
            this.roleList = response.pageInfo.list
            this.roleTotal = response.pageInfo.total
          })
          .catch(response => {//请求失败
            //console.log(error)
          })
    },
    //得到全部角色
    getAllRoleList() {
      GetRoleAllList().then(response => {
        this.roleAllList = response.role_list
      })
    },
    //删除一条角色信息
    removeRoleDataById(id) {
        var params = {
          roleId: id
        }
        DeleteRoleId(params).then(response => {
          message.success('删除成功!')
          this.getRoleList()
        })
    },
    //点击角色增加按钮
    addRoleTo() {
      this.dialogAddRoleForm = true
      this.addRoleForm = {
        roleId: '',
        roleName: '',
        roleDescription: ''
      }
    },
    //增加角色
    addRoleClick() {
      if(this.addRoleForm.roleName && this.addRoleForm.roleDescription){
        //roleId赋值
        //this.addRoleForm.roleId = this.roleTotal + 1
        var params = qs.stringify(this.addRoleForm)
        AddRole(params).then(
            response => {
              if (this.addRoleForm.roleId === '' || this.addRoleForm.roleId === null) {
                message.success('添加成功!')
              }
              this.getRoleList()
              this.dialogAddRoleForm = false
            }
        )
      }else {
        message.warning("请填写角色信息后再添加！")
      }
    },
    //点击修改角色
    updateRoleTo(id) {
      var params = {
        roleId: id
      }
      GetRoleById(params).then(
          response => {
            this.addRoleForm = response.role
            this.dialogAddRoleFormUpdate = true
          }
      )
    },
    //修改角色
    updateRoleClick() {
      if(this.addRoleForm.roleName && this.addRoleForm.roleDescription){
        var params = qs.stringify(this.addRoleForm)
        AddRole(params).then(
            response => {
              message.success('修改成功!')
              this.getRoleList()
              this.dialogAddRoleFormUpdate = false

              // if (this.addRoleForm.roleId === '' || this.addRoleForm.roleId === null) {
              //   message.success('修改成功!')
              //   // } else {
              //   //   message.success('添加成功!')
              //   // }
              //   //message.success('添加成功!')
              //   this.getRoleList()
              //   this.dialogAddRoleFormUpdate = false
              //
              // }
            })
      }
    },

    //点击角色管理中权限按钮
    roleMenuClick(id) {
      this.getMenuTree()
      this.roleMenuList = []
      this.dialogRoleMenu = true
      var params = {
        roleId: id
      }
      this.roleCurrentId = id

      GetRoleMenuList(params).then(
          response => {
            var checkedIds = response.menuIds
            var showIds = checkedIds.filter(item =>this.childIdArray.includes(item))
            this.expandedKeys = checkedIds
            this.checkedKeys = showIds
            //console.log(this.checkedKeys)
          })
    },
    handleCheckMenu (checkedKeys, e) {
      this.checkedKeysResult = [...checkedKeys, ...e.halfCheckedKeys]
      //console.log(this.checkedKeysResult)
    },
    addRoleMenuClick(){
      var checkedKeysMenu = this.checkedKeysResult

      var params = qs.stringify({
        roleId: this.roleCurrentId,
        menuIds: JSON.stringify(checkedKeysMenu)
      })
      BatchInsertRoleMenu(params).then(
          response => {
            message.success('授权成功！')
            this.dialogRoleMenu = false
          }
      )
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
