<template>
  <div>
    <div class="container">
      <el-container>
        <el-aside width="40%">
          <h5 class="page-title">请导入相渗数据点</h5>
          <div class="table-container">
            <div class="scrollable-input">
                  <el-input :value="fileInfo" placeholder="导入信息" readonly class="custom-input"></el-input>
                  <input type="file" @change="handleFileUpload" accept=".xlsx, .xls">
                </div>
            <table v-if="excelData.length > 0">
              <tr>
                <th>序号</th>
                <th v-for="(header, index) in tabelHead[0]" :key="index">{{ header }}</th>
              </tr>
              <tr v-for="(row, index) in excelData" :key="index">
                <td>{{ index + 1 }}</td>
                <td v-for="(cell, i) in row" :key="i">{{ cell }}</td>
              </tr>
            </table>
          </div>
        </el-aside>
          <el-container>
            <el-main width="60%">
              <div class="chart-container">
                <div>
                  <h3 class="title">拟合相渗曲线</h3>
                </div>
                    <el-table :data="tableData" style="width: 100%" @cell-click="handleCellClick">
      <el-table-column label="序号" width="60">
        <template v-slot="{ row, column, index }">
          <div class="cell-content">{{ index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Sw" width="120">
        <template v-slot="{ row, column, index }">
          <div class="cell-content" v-if="!row.editing" @click="startEditing(row, 'Sw')">{{ row.Sw }}</div>
          <el-input v-else v-model="row.Sw" size="mini" @blur="stopEditing(row, 'Sw')" />
        </template>
      </el-table-column>
      <el-table-column label="Krw" width="120">
        <template v-slot="{ row, column, index }">
          <div class="cell-content" v-if="!row.editing" @click="startEditing(row, 'Krw')">{{ row.Krw }}</div>
          <el-input v-else v-model="row.Krw" size="mini" @blur="stopEditing(row, 'Krw')" />
        </template>
      </el-table-column>
      <el-table-column label="Kro" width="120">
        <template v-slot="{ row, column, index }">
          <div class="cell-content" v-if="!row.editing" @click="startEditing(row, 'Kro')">{{ row.Kro }}</div>
          <el-input v-else v-model="row.Kro" size="mini" @blur="stopEditing(row, 'Kro')" />
        </template>
      </el-table-column>
      <!-- 其他列 -->
    </el-table>
                <button v-if="excelData.length > 0" @click=" aa">确认导入</button>
                <button v-if="excelData.length > 0" @click="myTest()">曲线拟合</button>
                <div style="width: 950px; height: 600px;" id="relaKchart" class="chart"></div>
                
              </div>
            </el-main>
          </el-container>
      </el-container>

    </div>

  </div>


</template>

<script>
import * as XLSX from 'xlsx';
import * as echarts from 'echarts';
import {computed, onMounted, ref} from "vue";
export default {
  setup(){

    var a=0.092
    var no=4
    var nw=1
    var Siw=0.358
    var Sor=0.168
    var Si=0.002
    var uo=5.8
    var uw=1
    let selectedFileName = ref("请选择文件！");
    let Sw_start =Siw;
    let Sw_step = 0.002;
    let Sw_end = 1-Sor;
    let Sw_list = [];
    for (let Sw = Sw_start; Sw <= Sw_end; Sw += Sw_step) {
      Sw_list.push(Sw);
    }
    console.log(Sw_list);
    var option = {
      xAxis: {
        type: 'value',
        name: 'Sw'
      },
      yAxis: {
        type: 'value',
        name: 'Krw / Kro'
      },
      legend: {
        data: ['Krw', 'Kro']
      },
      series: [
        {
          name: 'Krw',
          type: 'line',
          smooth: true,
          symbol: '',
          showSymbol: false,
          lineStyle: {
            color: 'blue' // 设置蓝色
          },
          data: [
            [1, 1],
            [2, 2],
            [3, 3],
          ]
        },
        {
          name: 'Kro',
          type: 'line',
          smooth: true,
          symbol: '',
          showSymbol: false,
          lineStyle: {
            color: 'red' // 设置红色
          },
          data: [
            [1, 3],
            [2, 2],
            [3, 1],
          ]
        },
        {
          name: 'Krw_point',
          type: 'scatter',
          symbol: 'circle', // 设置散点的形状，可以是'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
          itemStyle: {
            color: 'blue' // 设置散点的颜色
          },
          data: [
            [1, 2],
            [2, 1],
            [3, 3],
          ]
        },
        {
          name: 'Kro_point',
          type: 'scatter',
          symbol: 'triangle', // 设置散点的形状，可以是'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
          itemStyle: {
            color: 'red' // 设置散点的颜色
          },
          data: [
            [1, 2],
            [2, 1],
            [3, 3],
          ]
        },
      ]
    };
    const line_Krw=computed({
      get:()=>option.series[0].data,
      set:(value)=>{
        option.series[0].data=value
      }
    })
    const line_Kro=computed({
      get:()=>option.series[1].data,
      set:(value)=>{
        option.series[1].data=value
      }
    })
    const point_Krw=computed({
      get:()=>option.series[2].data,
      set:(value)=>{
        option.series[2].data=value
      }
    })
    const point_Kro=computed({
      get:()=>option.series[3].data,
      set:(value)=>{
        option.series[3].data=value
      }
    })
    var fileInfo=ref('请选择文件！')
    function powerLawRelPerm(Sw_list, a, nw, no, Siw, Sor, uo, uw) {
      let Relperm = {};
      Relperm.Sw = Sw_list;
      if (!Array.isArray(Sw_list)) {
        console.log('Sw是一个值')
        let b = 1 - Siw - Sor;
        let Swn = (Sw_list - Siw) / b;
        let Swo = (1 - Sw_list - Sor) / b;
        Relperm.Krw = a * Math.pow(Swn, nw);
        Relperm.Kro = Math.pow(Swo, no);
        let A = a * uo * Math.pow(Swn, nw);
        let B = uw * Math.pow(Swo, no);
        let C = a * uo * nw * Math.pow(Swn, nw - 1) / b;
        let D = uw * no * Math.pow(Swo, no - 1) / b;
        let E = a * uo * nw * (nw - 1) * Math.pow(Swn, nw - 2) / Math.pow(b, 2);
        let G = uw * no * (no - 1) * Math.pow(Swo, no - 2) / Math.pow(b, 2);
        Relperm.fw = A / (A + B);
        Relperm.df = (C * (A + B) - A * (C - D)) / Math.pow((A + B), 2);
        Relperm.dff = (E * (A + B) - A * (E + G)) / Math.pow((A + B), 2) - 2 * (C * (A + B) - A * Math.pow((C - D), 2)) / Math.pow((A + B), 3);
        Relperm.Siw = Siw;
        Relperm.Sor = Sor;
        Relperm.Sw = Sw_list;
      } else {
        Relperm.Krw=[]
        Relperm.Kro=[]
        Relperm.fw=[]
        Relperm.df=[]
        Relperm.dff=[]
        console.log('Sw是一个序列'+Sw_list)
        for (let i = 0; i < Sw_list.length; i++) {
          let b = 1 - Siw - Sor;
          let Swn = (Sw_list[i] - Siw) / b;
          let Swo = (1 - Sw_list[i] - Sor) / b;
          Relperm.Krw.push(a * Math.pow(Swn, nw));
          Relperm.Kro[i] = Math.pow(Swo, no);
          let A = a * uo * Math.pow(Swn, nw);
          let B = uw * Math.pow(Swo, no);
          let C = a * uo * nw * Math.pow(Swn, nw - 1) / b;
          let D = uw * no * Math.pow(Swo, no - 1) / b;
          let E = a * uo * nw * (nw - 1) * Math.pow(Swn, nw - 2) / Math.pow(b, 2);
          let G = uw * no * (no - 1) * Math.pow(Swo, no - 2) / Math.pow(b, 2);
          Relperm.fw.push(A / (A + B)) ;
          Relperm.df.push((C * (A + B) - A * (C - D)) / Math.pow((A + B), 2)) ;
          Relperm.dff.push((E * (A + B) - A * (E + G)) / Math.pow((A + B), 2) - 2 * (C * (A + B) - A * Math.pow((C - D), 2)) / Math.pow((A + B), 3));
          Relperm.Siw = Siw;
          Relperm.Sor = Sor;
          Relperm.Sw = Sw_list;
        }
        console.log(Relperm);  // 输出结果，你可以根据需要进行调整
      }
      Relperm.Swf = calSwf(Relperm);
      return Relperm;
    }
    function calSwf(Relperm) {
      let Sw = Relperm.Sw;
      let fw = Relperm.fw;
      let n = Sw.length;
      let maxnum = 2;
      let maxval = 0;
      for (let i = 1; i < n; i++) {
        if ((fw[i] - fw[0]) / (Sw[i] - Sw[0]) > maxval) {
          maxval = (fw[i] - fw[0]) / (Sw[i] - Sw[0]);
          maxnum = i;
        }
      }
      return Sw[maxnum];
    }
    function lineFit(){
      var Relperm=powerLawRelPerm(Sw_list, a, nw, no, Siw, Sor, uo, uw)
      const Sw = Relperm.Sw;
      const Krw = Relperm.Krw;
      const Kro = Relperm.Kro;
      line_Krw.value=[]
      line_Kro.value=[]
      Sw.forEach((value,index)=>{
        line_Krw.value.push([value,Krw[index]])
        line_Kro.value.push([value,Kro[index]])
      })
      refreshChart()
    }
    var tabelHead=[['Sw','Krw','Kro']]
    var excelData=ref([
        [0.2,	0,	0.85],
        [0.25,	0.03,	0.75],
        [0.3,	0.1,	0.49],
        [0.4,	0.14,	0.31],
        [0.45,	0.17,	0.19],
        [0.6,	0.42,	0.07],
        [0.75,	0.79,	0.01],
        [0.8,	0.9,	0],
    ])
    const tableData = ref([
      { Sw: 0.2, Krw: 0, Kro: 0.85, editing: false },
      { Sw: 0.25, Krw: 0.03, Kro: 0.75, editing: false },
      // ... 其他行
    ]);

    // 处理单元格点击事件
    const handleCellClick = (row, column, event) => {
      if (column.property && !row.editing) {
        startEditing(row, column.property);
      }
    };

    // 开始编辑单元格
    const startEditing = (row, key) => {
      row.editing = true;
      // 可以根据需要执行其他的编辑相关逻辑
    };

    // 停止编辑单元格
    const stopEditing = (row, key) => {
      row.editing = false;
      // 可以根据需要执行其他的编辑相关逻辑
    };

    function plotTabelPoint(){
      console.log('plotTabelPointRun')
      point_Krw.value=excelData.value.map(function(row) {
        return [row[0], row[1]];
      })
      point_Kro.value=excelData.value.map(function(row) {
        return [row[0], row[2]];
      })
      console.log(excelData.value)
      refreshChart();
    }

    function handleFileUpload(event){
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        excelData.value = jsonData;
        plotTabelPoint()
      };

    }
    function refreshChart() {
      const chartContainer = document.getElementById("relaKchart");
      const chart = echarts.init(chartContainer);

      chart.setOption(option);
    }
    onMounted(()=>{
      lineFit()
      plotTabelPoint()
      refreshChart()
      
    })
    return{
      handleFileUpload,renderChart: refreshChart,excelData,tabelHead,fileInfo,myTest: lineFit,
      option,handleFileUpload,selectedFileName,tableData,handleCellClick,startEditing,
      stopEditing,
    }

  }

};
</script>

<style scoped>
.container {
  display: flex;
  height: 95vh;
}
.table-container {
  flex: 1;
  margin-right: 20px;
  height: 100%; /* 添加滚动条 */
}
.page-title{
  font-size: 16px;
  font-weight: bolder;
  text-align: center;
  margin-top: 5px;
}
.title{
  font-size: 16px;
  font-weight: bolder;
  margin-top: 5px;
  margin-left: 440px;
}


table {
  border-collapse: collapse;
  width: 100%;
  white-space: nowrap;
}

td {
  border: 5px solid #ddd;
  padding: 10px;
  min-width: 100px;
}

.el-main{
  padding: 0;
}

.chart-container {
  flex: 1;
  width: 100%; 
  height: 600px; 
}


.chart {
  height: 100%;
}

.scrollable-input {
  display: flex;
  align-items: center;
  justify-content: space-between;; 
  margin-top: 10px;
  
}
.custom-input {
  width: 550px; /* 调整输入框的宽度 */
  margin-left: 100px; /* 调整左侧空闲 */
  margin-right: 100px; /* 调整右侧空闲 */
}
.cell-content {
  padding: 1px;
  text-align: center;
}


</style>