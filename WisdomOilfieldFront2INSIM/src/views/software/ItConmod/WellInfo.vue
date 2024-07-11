<template>
  <div  style="width: 100% ;display: flex;flex-direction: column; justify-content:center" >
    <el-table
        :data="tableData.list"
        style="width: 100%"
        height="85%"
        :cell-style="{padding:'2px'}"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="wellNum" label="井序号" width="120">
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.wellNum}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.wellNum">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="layerNum" width="120" label="层号" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.layerNum}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.layerNum">
          </el-input>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="wellIndexInLayer" label="层内序号"  />-->
      <el-table-column prop="wellName" width="120" label="井名" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.wellName}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.wellName">
          </el-input>
        </template>
      </el-table-column>

      <el-table-column prop="x"  width="120" label="x" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.x}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.x">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="y" width="120" label="y" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.y}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.y">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="h" width="120" label="厚度">
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.h}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.h">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="poro" width="120" label="孔隙度" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.poro}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.poro">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="initPressure" width="120" label="初始压力" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.initPressure}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.initPressure">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="initSw" width="120" label="初始含水饱和度" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.initSw}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.initSw">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="k" width="120" label="渗透率" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.k}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.k">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="wellType" width="120" label="注采标志" >
        <template #default="scope">
          <span v-show="!scope.row.editFlag">{{scope.row.wellType}}</span>
          <el-input v-show="scope.row.editFlag"
                    v-model="scope.row.wellType">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="120" align="center">
        <template #default="scope">

          <el-button size="small"
                     type="primary"

                     v-show="scope.row.editFlag"
                     @click="submit(scope.row)">
            <el-icon style="vertical-align: middle;">
              <CircleCheck />
            </el-icon>
            确定
          </el-button>
          <el-button size="small"
                     type="primary"

                     v-show="scope.row.editFlag"
                     @click="cancel(scope.row,scope.$index)">
            <el-icon style="vertical-align: middle;">
              <CircleClose />
            </el-icon>
            取消
          </el-button>
          <el-button size="small"

                     type="primary"
                     v-show="!scope.row.editFlag"
                     @click="edit(scope.row)">
            <el-icon style="vertical-align: middle;">
              <Edit />
            </el-icon>
            编辑
          </el-button>
          <el-button size="small"

                     type="primary"
                     v-show="!scope.row.editFlag"
                     @click="del(scope.$index)">
            <el-icon style="vertical-align: middle;">
              <Delete />
            </el-icon>
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: center ;">

      <el-button @click="add" type="primary" size="small"  >
        <el-icon style="vertical-align: middle;">
          <CirclePlus />
        </el-icon>
        添加
      </el-button>
      <el-button @click="" type="primary" size="small" >
        <el-icon style="vertical-align: middle;">
          <Delete />
        </el-icon>
        删除
      </el-button>
      <el-button @click="saveTable" type="primary" size="small" >保存</el-button>
    </div>

    <el-pagination
        style="display: flex;justify-content: center"
        id="el-pagination"
        small
        :page-size="10"
        layout="prev, pager, next"
        :total=total
        :currentPage.sync=cacheData.currentPage
        @current-change="loadPage()"
    >
    </el-pagination>
  </div>
</template>

<script  >


import {defineComponent, nextTick, onMounted, reactive, ref, toRef} from "vue";
import service from '@/utils/api.js'
import {Search,CirclePlus,Delete,Edit,CircleClose,CircleCheck} from '@element-plus/icons-vue'



export default
{
  components:{Search,CirclePlus,Delete,Edit,CircleClose,CircleCheck},
  setup(){
    let tableData=ref({list:[{
        "layerNum": "1",
        "wellIndexInLayer": "5",
        "wellName": "WB2X9",
        "wellNum": 5,
        "x": 5545.13,
        "y": 2215.77,
        "h": 7.8,
        "poro": 0.24,
        "initPressure": 24.7,
        "initSw": 0.2,
        "k": 1407.4,
        "wellType": 0,
        'editFlag': false,  // 可编辑标识
        'isSubmit': false, // 是否点击确定标识
      }]})
    let cacheData= {currentPage:1}
    let total=1
    let v=ref('')


    // 编辑函数
    const add = () => {
      tableData.value.list.push({
        "layerNum": "",
        "wellIndexInLayer": "",
        "wellName": "",
        "wellNum": '',
        "x": '',
        "y": '',
        "h": '',
        "poro": '',
        "initPressure": '',
        "initSw": '',
        "k": '',
        "wellType": '',
        'editFlag': false,  // 可编辑标识
        'isSubmit': false, // 是否点击确定标识
      })
    };
    // 确定
    const submit= (row) => {
      row.editFlag = false
      row.isSubmit = true
    };
    // 取消
    const cancel = (row, index) => {
      console.log(index)
      row.editFlag = false
      if (row.isSubmit) {
        tableData.value.list[index] = JSON.stringify(row)
      } else {
        console.log('cancel')
        console.log(v.value)
        tableData.value.list[index]=v.value

      }
    }
    // 编辑
    const edit = (row) => {
      v.value = JSON.parse(JSON.stringify(row));
      row.editFlag = true;
    };
    // 删除
    const del = (index) =>{
      console.log(index)
      tableData.value.list.splice(index, 1)
    };

    function print (val){
      console.log(val)
    }
    function loadPage(){
      service.get("/znfx/BaseData/WellInitParam?currentPage="+cacheData.currentPage).then((res) =>{
        console.log("loadPage")
        res.data.forEach((ele)=>{
          ele.editFlag=false,ele.isSubmit=false
          tableData.value.list.push(ele)
        })
      }),
          service.get("/znfx/BaseData/WellInitParam/getTotal").then((res)=>{
            total=res})
    }

    function saveTable(){
      service.post("/znfx/BaseData/WellInitParam/saveWellTable",newList).then(response => {
        // 请求成功处理
        console.log(response.data);
      })
          .catch(error => {
            // 请求失败处理
            console.error(error);
          })
    }
    loadPage()



    return {cacheData,tableData,total,edit,cancel,submit,add,del,loadPage,saveTable}
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
el-button{
  text-align: center;
}

</style>
