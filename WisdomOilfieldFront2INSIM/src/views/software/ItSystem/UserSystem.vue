<template>
  <div class="MainDiv">
      <!-- 确认删除用户对话框 -->
<!--      <a-modal-->
<!--          v-model:visible="deleteUserModel"-->
<!--          title="删除用户"-->
<!--          :destroyOnClose="true"-->
<!--          :width="350"-->
<!--          @cancel="function (){ deleteUserModel = false}"-->
<!--          @ok="removeUserDataById">-->
<!--        <span>确定要删除该用户吗？</span>-->
<!--      </a-modal>-->

    <!-- 添加用户 & 修改用户 -->
    <a-modal
        :title="userPanduan ? '添加用户' : '修改用户'"
        v-model:visible="dialogFormVisible"
        centered
        width="600px"
        footer="">
      <!-- 选择用户角色 -->
      <div>
        <a-modal
            v-model:visible="choiceRoleDialogFormVisible"
            title="选择角色"
            centered
            width="350px"
            footer="">
          <a-checkbox-group v-model:value="checkRoleList" :options="roleListName" style="line-height: 60px"/>

          <a-row class="dialog-footer">
            <a-button type="primary" @click="confirmRoles"><span style="font-size: 14px">确定</span></a-button>
          </a-row>
        </a-modal>
      </div>
      <a-form :model="userAddForm" ref="userAddForm" :rules="userRules">
        <a-form-item label="用户名称" name="userName" has-feedback >
          <a-input v-model:value="userAddForm.userName"  @change="UserNameExist"  style="width: 65%; " placeholder="请输入用户姓名" allowClear></a-input>
        </a-form-item>
        <a-form-item label="真实姓名" name="trueName" has-feedback >
          <a-input v-model:value="userAddForm.trueName" style="width: 65%; " placeholder="请输入用户昵称" allowClear/>
        </a-form-item>
        <a-form-item label="角色名称" name="userRoleNames" has-feedback  >
          <a-input v-model:value="userAddForm.userRoleNames" style="width: 65%;" placeholder="请选择用户角色" :disabled="true" allowClear/>
          <a-button  type="primary" @click="chioceRole" style="borderRadius:5px; margin-left: 10px">选择角色</a-button>
        </a-form-item>
        <a-form-item label="所属部门" :label-width="formLabelWidth" name="departmentSelectId1" has-feedback >
          <a-cascader v-model:value="departmentSelectId" :options="departmentList" placeholder="请选择用户所属部门" style="width: 65%;"
                      :fieldNames="{ label: 'unitname', value: 'id', children: 'children' }"/>
        </a-form-item>
        <div v-if="userPanduan">
          <a-form-item label="用户密码" name="newPassword1" has-feedback >
            <a-input type="password" style="width:65%" v-model:value="newPassword1" auto-complete="off" show-password placeholder="请输入用户密码" allowClear/>
          </a-form-item>
          <a-form-item label="确认密码" name="newPassword2" has-feedback >
            <a-input type="password" style="width:65%" v-model:value="newPassword2" show-password placeholder="请确认用户密码" allowClear/>
          </a-form-item>
        </div>
      </a-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <a-button type="primary" htmlType='submit' @click="userPanduan ? addUserConfirm() : updateUserConfirm()">
          <span style="font-size: 14px">{{ userPanduan ? "增加" : "修改"}}</span>
        </a-button>
      </div>
    </a-modal>
    <a-card hoverable class="MainCard" style="height: 100%; width: 100%">
      <!--查询表单-->
      <template #title >
        <a style="font-weight:bold;font-size: 25px;color: black;">
          <usergroup-add-outlined />  用户管理</a>
      </template>
      <template #extra>
        <a-form class="labelWeighter" layout="inline" >
          <a-button type="primary" @click="addUserTo" style="margin-right: 50px; height: 40px;borderRadius:5px">
          <plus-circle-outlined /> 添加用户
        </a-button>
          <a-form-item>
            <a-input v-model:value="queryName" placeholder="请输入用户名称查询" style="height: 40px;" />
          </a-form-item>
          <a-button type="primary" @click="getUserList()" style="height: 40px;borderRadius:5px; margin-left: 20px">
          <search-outlined /> 查询
        </a-button>
          <a-button type="default" @click="resetUserData()" style="height: 40px;borderRadius:5px; margin-left: 20px">
          <sync-outlined /> 清空
        </a-button>
        </a-form>
      </template>
      <a-row type="flex" justify="space-between" style="align-self: center;">
        <a-table :columns="userDataCol"
                 :dataSource="userList"  max-height="100;"
                 :bordered="true"
                 :pagination="false"
                 class="tableClass"
                 style="white-space:pre-wrap; width: 100%">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex==='number'">
              <span>{{`${(userPage-1)*userLimit + (index + 1)}`}}</span>
            </template>
            <template v-if="column.dataIndex==='operate'">
              <a-row style=" display: flex;  justify-content: center;">
                <div  style="align-self: center;">
                  <a-button type="primary" ghost size="small"
                            @click="updateUserClick(record.userId)"
                            style="borderRadius:5px">
                    <edit-outlined /> 修改
                  </a-button>
                </div>
                <div style="align-self: center;">
                  <a-button type="primary" danger ghost size="small"
                            @click="removeUserDataById(record.userId)"
                            style="borderRadius:5px"><delete-outlined /> 删除
                  </a-button>
                </div>
              </a-row>
            </template>
          </template>
        </a-table>
      </a-row>
      <a-row style="margin-top: 25px; float: right">
        <a-pagination v-model:current="userPage"
                      v-model:pageSize="userLimit"
                      :total="userTotal"
                      :show-total="total => `共 ${userTotal} 条`"
                      class="tableClass"
                      @change="getUserList" />
    </a-row>
    </a-card>
  </div>
</template>

<script>
import { GetUserList } from '@/api/SystemIndex'
import { DeleteUserId } from '@/api/SystemIndex'
import { AddUser } from '@/api/SystemIndex'
import { GetUserById } from '@/api/SystemIndex'
import { UpdateUser } from '@/api/SystemIndex'
import { GetUserExistByName } from '@/api/SystemIndex'
import { GetFirstDepartments } from '@/api/SystemIndex'
import { GetRoleAllList } from '@/api/SystemIndex'

import { message } from 'ant-design-vue';
import {PlusCircleOutlined,
  SearchOutlined, DeleteOutlined,
  EditOutlined, SyncOutlined,UsergroupAddOutlined
} from '@ant-design/icons-vue';
var qs = require('qs')

export default {
  components:{
    PlusCircleOutlined,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    SyncOutlined,
    UsergroupAddOutlined
  },
  data() {
    return {
      userDataCol:[
        {
          title: '序号',
          dataIndex: 'number',
          width:80,
          align:'center'
          //render:(text,record,index)=>`${index+1}`,
        },
        {
          title: '用户名称',
          dataIndex: 'userName',
          width:120,
          align:'center'
        },
        {
          title: '真实姓名',
          dataIndex: 'trueName',
          width:120,
          align:'center'
        },
        {
          title: '单位名称',
          dataIndex: 'unitName',
          width: 250,
          align:'center'
        },
        {
          title: '角色名称',
          dataIndex: 'userRoleNames',
          width: 130,
          align:'center'
        },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'center',
          width: 120,
        },
     ],
      departmentList:[],
      roleListName:[],
      deleteUserModel:false,
      departmentSelectId:[],
      activeName: 'first',
      userList: [],
      queryName: '',
      userPage: 1,  //当前页
      userLimit: 12, //每页记录数
      userTotal: 0,   //总记录数
      dialogFormVisible: false, //增加用户对话框
      choiceRoleDialogFormVisible: false,//角色选择对话框
      userAddForm: {
        userId: '',
        trueName: '',
        userName: '',
        password: '',
        userRoles: '',
        userRoleNames: '',
        unitId:''
      }, //封装表单数据
      newPassword1: '',
      newPassword2: '',
      formLabelWidth: '120px', //增加对话框中formLabel的长度
      userPanduan: false,
      multipleSelection1: [],
      roleList: undefined,
      roleAllList: undefined,
      checkRoleList: [], //多选框选择角色
      queryRoleName: '',
      userExistList:[],//输入名查询list
      userRules:{
        userName: [{
          required: true,
          validator: async(rule, value)=>{
            if (value === '') {
              return Promise.reject("用户姓名不能为空，请输入用户姓名！")
            } else {
              for (let i = 0; i < this.userExistList.length; i++){
                if(this.userAddForm.userName === this.userExistList[i].userName){
                  this.userAddForm.userId = this.userExistList.filter((i)=>i.userName === this.userAddForm.userName)[0].userId
                  return Promise.reject("用户已存在，请重新输入！")
                }
              }
              return Promise.resolve()
              }
          },
          trigger: 'blur',
        }],
        trueName: [{
          required: true,
          validator: async(rule, value)=>{
            value = this.userAddForm.trueName
            if (value === '') {
              return Promise.reject("用户昵称不能为空，请输入用户昵称！")
            } else {
              return Promise.resolve();
            }
          },
          trigger: 'blur',
        }],
        userRoleNames: [{
          required: true,
          validator: async(rule, value)=>{
            if (value === '') {
              return Promise.reject("用户角色不能为空，请选择用户角色！")
            } else {
              return Promise.resolve();
            }
          },
          trigger: 'blur',
        }],
        departmentSelectId1: [{
          required: true,
          validator:async(rule, value) => {
            value = this.departmentSelectId.length
            if (value === 0) {
              return Promise.reject('所属部门不可为空,请选择部门！')
            } else {
              return Promise.resolve();
            }
          },
          trigger: 'blur',
        }],
        newPassword1: [{
          required: true,
          validator: async(rule, value ) => {
            value = this.newPassword1
            if (value==='') {
              return Promise.reject('用户密码不能为空，请输入密码！')
            } else {
              return Promise.resolve()
            }
          },
          trigger: 'blur',
        }],
        newPassword2: [{
          required: true,
          validator:async(rule, value ) => {
            value = this.newPassword2
            if (value==='') {
              return Promise.reject('请再次输入密码！')
            } else if(value != this.newPassword1) {
              return Promise.reject("密码不一致，请重新确认密码！")
            } else {
              this.userAddForm.password = this.newPassword2
              return Promise.resolve()
            }
          },
          trigger: 'blur',
        }],
      },
    };
  },
  mounted() {
    this.getUserList()

  },
  methods: {
    // countSet(){
    //   (function () {
    //     var dgc = document.createElement("script");
    //     dgc.src = "https://webanalysis.scp.dgyt.petrochina/api/dgcount.js?code=6303200431238515";
    //     var dgs = document.getElementsByTagName("script")[0];
    //     dgs.parentNode.insertBefore(dgc, dgs);
    //   })()
    // },
    UserNameExist(event){
      var username = this.userAddForm.userName
      if(username){
        var params = {
          userName: username
        }
        GetUserExistByName (params).then(
            response=>{
              this.userExistList = response.userList
            }
        ).catch(error=>{
          //console.log(error)
          this.userExistList = []
        })
      }
    },
    getDepartmentList(){
      GetFirstDepartments().then(res=>{
        this.departmentList = res.list
      })
    },
    //确定修改提交
    updateUserConfirm() {
      if(this.userAddForm.userName && this.userAddForm.trueName && this.userAddForm.userRoles && this.departmentSelectId[1]){
        this.userAddForm.unitId = this.departmentSelectId[1]
        var params = qs.stringify(this.userAddForm)
        UpdateUser(params).then(
            response => {
              message.success("修改成功！")
              this.getUserList()
              this.dialogFormVisible = false
            }).catch(error=>{
          //console.log(error)
        })
      }
    },
    //点击修改按钮
    updateUserClick(id) {
      this.getAllRoleList()
      this.userPanduan = false
      this.dialogFormVisible = true
      this.departmentSelectId = []
      var params = {
        userId: id
      }
      GetUserById(params).then(
          response => {
            this.userAddForm = response.user
            this.departmentSelectId = [this.userAddForm.unitId.substring(0,8),this.userAddForm.unitId]
            var strRoleNames = response.user.userRoleNames
            if(strRoleNames != null){
              this.checkRoleList = strRoleNames.split(',')
              var userRoles = ''
              for (var i = 0; i < this.checkRoleList.length; i++) {
                for (var j = 0; j < this.roleAllList.length; j++) {
                  if (this.checkRoleList[i] == this.roleAllList[j].roleName) {
                    userRoles = userRoles + this.roleAllList[j].roleId
                  }
                }
                if (i != this.checkRoleList.length - 1) {
                  userRoles = userRoles + ','
                }
              }
              this.userAddForm.userRoles = userRoles
            }
          }).catch(error=>{
            //console.log(error)
      })
    },
    //点击添加按钮
    addUserTo() {
      this.choiceRoleDialogFormVisible = false
      this.dialogFormVisible = true
      this.userPanduan = true
      this.checkRoleList = []
      this.userAddForm = {
        userId: '',
        trueName: '',
        userName: '',
        password: '',
        userRoles: '',
        userRoleNames: '',
        unitId:''
      }
      this.departmentSelectId = []
      this.newPassword1 = ''
      this.newPassword2 = ''
    },
    //添加用户实现
    addUserConfirm() {
      //
      if(this.userAddForm.userName && this.userAddForm.trueName && this.userAddForm.userRoles   && this.departmentSelectId[1]&& this.newPassword1 && this.newPassword2){
        this.userAddForm.unitId = this.departmentSelectId[1]
        var params = qs.stringify(this.userAddForm)
        AddUser(params).then(
            response => {
              message.success("添加成功！")
              this.getUserList()
              this.dialogFormVisible = false
            }
        ).catch(error=>{
          //console.log(error)
        })
       }else{
        message.warning("请填写用户信息后再添加！")
      }
    },
    //选择角色并回显表格
    /**
     * 点击多选框实现角色选择
     * 将多选框中的checkRoleList列表转换成userRoleNames字符串
     * 并查找userRoleNames相应id,将id合并转换为userRoles字符串
     */
    confirmRoles() {
      let userRoleNames = ''
      let userRoles = ''
      for (var i = 0; i < this.checkRoleList.length; i++) {
        userRoleNames = userRoleNames + this.checkRoleList[i]
        for (var j = 0; j < this.roleAllList.length; j++) {
          if (this.checkRoleList[i] == this.roleAllList[j].roleName) {
            userRoles = userRoles + this.roleAllList[j].roleId
          }
        }
        if (i != this.checkRoleList.length - 1) {
          userRoleNames = userRoleNames + ','
          userRoles = userRoles + ','
        }
      }
      this.userAddForm.userRoleNames = userRoleNames
      this.userAddForm.userRoles = userRoles
      //关闭内层会话框
      this.choiceRoleDialogFormVisible = false
    },

    //条件查询用户
    getUserList(page = 1) {
        this.userPage = page
        var params = {
          userName: this.queryName,
          pn: this.userPage,
          pageSize: this.userLimit
        }
        GetUserList(params)
            .then(response => { //请求成功
              //response 接口返回的数据
              this.userList = response.pageInfo.list
              this.userTotal = response.pageInfo.total
              this.getDepartmentList()
            })
            .catch(response => {//请求失败
              //console.log(error)
            })
    },
    resetUserData() {
      //清空表单
      this.queryName = ''
      //调用getList()查询全部数据信息
      this.getUserList()
    },
    //删除一条用户
    removeUserDataById(id) {
      this.deleteUserModel = true
      //调用删除的方法
      var params = {
        userId: id
      }
      DeleteUserId(params)
          .then(response => {//删除成功
            //提示信息
            message.success("删除成功！")
            //回到列表页面
            this.getUserList()
          }).catch(error=>{
            //console.log(error)
      })
    },
    //点击选择角色按钮
    chioceRole() {
      this.choiceRoleDialogFormVisible = true
      this.getAllRoleList()
    },

    //得到全部角色
    getAllRoleList() {
      this.roleListName=[]
      GetRoleAllList().then(response => {
        this.roleAllList = response.role_list
        for (let i = 0; i < this.roleAllList.length; i++) {
          this.roleListName.push( this.roleAllList[i].roleName)
        }
      }).catch(error=>{
        //console.log(error)
      })
    },
  }
};
</script>
<style scoped>
.MainCard {
  border: 3px solid #e8e8e8;
}
:deep( .ant-pagination mini){
  font-weight: normal;
}
:deep( .ant-table-tbody > tr > td ){
  padding: 8px!important;
}
:deep( .ant-table-thead > tr > th){
  font-weight: bolder;
}
:deep( .ant-table-cell){
  padding: 8px;
  text-align: center;
}
.tableClass:deep(.ant-table-thead > tr > th) {
  border: 0.1px solid #edecec;
  border-right: 0.1px solid #edecec;
}
</style>
