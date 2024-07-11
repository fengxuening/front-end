<template>
  <div class="MainDiv">
    <a-card hoverable class="MainCard" style="height: 100%; width: 70%">
      <!--查询表单-->
      <template #title >
        <a style="font-weight:bold;font-size: 25px;color: black;">
          <schedule-outlined/>  访问记录</a>
      </template>
      <template #extra>
        <a-form class="labelWeighter" layout="inline" >
          <a-form-item>
            <a-input v-model:value="queryName" placeholder="请输入用户名称查询" style="height: 40px;" />
          </a-form-item>
          <a-button type="primary" @click="getLogList()" style="height: 40px;borderRadius:5px; margin-left: 20px">
            <search-outlined /> 查询
          </a-button>
          <a-button type="default" @click="resetUserData()" style="height: 40px;borderRadius:5px; margin-left: 20px">
            <sync-outlined /> 清空
          </a-button>
        </a-form>
      </template>
      <a-row type="flex" justify="space-between" style="align-self: center;">
        <a-table :columns="logDataCol"
                 :dataSource="logList"  max-height="100;"
                 :bordered="true"
                 :pagination="false"
                 class="tableClass"
                 style="white-space:pre-wrap; width: 100%">
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.dataIndex==='number'">
              <span></span>
            </template>
          </template>
        </a-table>
      </a-row>
      <a-row style="margin-top: 25px; float: right">
        <a-pagination v-model:current="logPage"
                      v-model:pageSize="logLimit"
                      :total="logTotal"
                      :show-total="total => `共 ${logTotal} 条`"
                      class="tableClass"
                      @change="getLogList" />
      </a-row>
    </a-card>
  </div>
</template>

<script>
import {GetUserList, LogRecordGet} from '@/api/SystemIndex'
import { DeleteUserId } from '@/api/SystemIndex'
import { AddUser } from '@/api/SystemIndex'
import { GetUserById } from '@/api/SystemIndex'
import { UpdateUser } from '@/api/SystemIndex'
import { GetUserExistByName } from '@/api/SystemIndex'
import { GetFirstDepartments } from '@/api/SystemIndex'
import { GetRoleAllList } from '@/api/SystemIndex'

import { message } from 'ant-design-vue';
import {PlusCircleOutlined,
    ScheduleOutlined,
  SearchOutlined, DeleteOutlined,
  EditOutlined, SyncOutlined,UsergroupAddOutlined
} from '@ant-design/icons-vue';
var qs = require('qs')

export default {
  components:{
    ScheduleOutlined,
    PlusCircleOutlined,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    SyncOutlined,
    UsergroupAddOutlined
  },
  data() {
    return {
      logDataCol:[
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
          title: '登录时间',
          dataIndex: 'login_date',
          width: 130,
          align:'center'
        },
        {
          title: '登录IP',
          dataIndex: 'login_ip',
          width: 130,
          align:'center'
        },
      ],
      logList: [],
      queryName: undefined,
      logPage: 1,  //当前页
      logLimit: 12, //每页记录数
      logTotal: 0,   //总记录数

    };
  },
  mounted() {
    this.getLogList()
    // this.countSet()
  },
  methods: {
    getLogList(page = 1) {
      this.logPage = page
      var params = {
        username: this.queryName,
        pn: this.logPage,
        pageSize: this.logLimit
      }
      LogRecordGet(params)
          .then(response => { //请求成功
            //response 接口返回的数据
            this.logList = response.pageInfo.list
            this.logTotal = response.pageInfo.total
          })
          .catch(response => {//请求失败
            //console.log(error)
          })
    },
    resetUserData() {
      //清空表单
      this.queryName = ''
      //调用getList()查询全部数据信息
      this.getLogList()
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
