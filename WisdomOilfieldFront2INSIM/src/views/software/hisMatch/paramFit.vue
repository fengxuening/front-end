<template>
  <div class="container">
    <div class="box-2">
      <div class="box-3 three">
        <h3 class="title">1、拟合目标动态选择</h3>
        <div class="content">
          <div class="sub-content" style=" position: relative;">
            <el-checkbox-group v-model="fitParameter">
              <div class="checkItem"><el-checkbox label="WOPR" size="large" border>
                <span>单井产油速率WOPR</span>
              </el-checkbox></div>
              <div class="checkItem"><el-checkbox label="FOPT" size="large" border>
                <span>区块产油速率FOPT</span>
              </el-checkbox></div>
              <div class="checkItem"><el-checkbox label="WWCT" size="large" border>
                <span>单井含水率WWCT</span>
              </el-checkbox></div>
            </el-checkbox-group>
          </div>
          <div class="confim">
            <el-button type="primary" style="position: relative" @click="confirm()">
              确认
            </el-button>
          </div>
          <div class="sub-content" style=" position: relative; display: flex; align-items: center; left: 10px;">
            <div class="time">
              <h3>历史拟合时间区间</h3>
            </div>
            <div class="timeItem">
              <el-date-picker
                  v-model="startDate"
                  type="date"
                  placeholder="开始时间"
              />
            </div>
            <div class="timeItem">
              <el-date-picker
                  v-model="endDate"
                  type="date"
                  placeholder="结束时间"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="box-3 three" style="position: absolute; left: 550px; width: 18%;">
        <h3 class="title">2、拟合参数设置</h3>
        <div class="content" style="height: 100%; margin-top: 10px;">
          <div class="sub-content">
            <el-form label-width="150px">
              <el-form-item label="单次循环模拟次数">
                <input type="text" v-model="speciesQuantity" class="custom-input"/>
              </el-form-item>
              <el-form-item label="总循环次数">
                <input type="text" v-model="iterationCount" class="custom-input"/>
              </el-form-item>
              <el-form-item label="拟合参数上界">
                <input type="text" v-model="fittingParamUpperBound" class="custom-input"/>
              </el-form-item>
              <el-form-item label="拟合参数下界">
                <input type="text" v-model="fittingParamLowerBound" class="custom-input"/>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="processdisplay">
        <h3 class="title">3、计算进程显示</h3>
        <div >
          <div class="sub-content">
            <el-input
                v-model="simProcess"
                placeholder="结果展示区"
                type="textarea"
                readonly
                :autosize="{
                minRows:9,
                maxRows:9
              }"
                style="width: 100%; height: 330px; max-height: 100%!important"
            />
          </div>
          <div class="progress">
            <div class="progress-container">
              <div class="progress-bar" :style="{ width: progressBarWidth }"></div>
            </div>
            <div class="progress-text">{{ progress }}%</div>
          </div>
          <div class="sim-button">
            <el-button type="primary" style="position: relative" @click="readySim()">
              确认模拟参数
            </el-button>
            <el-button type="primary" style="position: relative" @click="startSim()">
              开始模拟
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="box-3 three no-border" style="position: absolute; left: 950px;">
      <h3 class="title">4、拟合结果对比</h3>
      <div class="select-container" >
        <div class="selectedWell">
          <el-select v-model="selectedWell" clearable placeholder="请选择井号">
            <el-option
                v-for="item in selectWellNames"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>

        </div>
        <div class="selectedOption">
          <el-select v-model="selectedOption" clearable placeholder="请选择操作">
            <el-option
                v-for="item in selectedOptionNames"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>

        </div>
        <div class="selectedtrend">
          <el-select v-model="selectedtrend" clearable placeholder="请选择动态">
            <el-option
                v-for="item in selectedtrendNames"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="chart-container">
          <div id="fitConChart" ref="mychart" style="width: 700px; height: 600px;"></div>
        </div>

      </div>

      <!-- //结果保存 -->
      <div style="display: block;">
        <el-button  id="saveButton" type="primary" style="position: absolute; bottom: 90px; right: 425px; z-index: 999;" @click="saveToExcel">保存结果</el-button>
      </div>
    </div>

  </div>
</template>
<script>

import * as echarts from 'echarts';
import XLSX from 'xlsx';
import service from "@/utils/api";
import {ref, reactive, watch, onMounted, computed} from 'vue';
export default {
  setup(){
    var wellProData={
      'WB2X11':{
        'oil':[],
        'liq':[],
      },
      'WB2X12':{
        'oil':[],
        'liq':[],
      }
    }
    var selectWellNames=ref([{
      value: 'WB2X11',
      label: 'WB2X11'
    }, {
      value: 'WB2X12',
      label: 'WB2X12'
    }, {
      value: 'WB2X13',
      label: 'WB2X13'
    }, {
      value: 'WB2X14',
      label: 'WB2X14'
    }, {
      value: 'WB2X15',
      label: 'WB2X15'
    }]);
    var selectedOptionNames=ref([{
      value: 'oilproduction',
      label: '产油量'
    }, {
      value: 'wateryield',
      label: '产水量'
    }, {
      value: 'liquidproduction',
      label: '产液量'
    }, {
      value: 'cumoilproduction',
      label: '累计产油量'
    }, {
      value: 'cumwateryield',
      label: '累计产水量'
    },{
      value: 'cumliquidproduction',
      label: '累计产液量'
    },{
      value: 'moisturecontent',
      label: '含水率'
    }]);
    var selectedtrendNames=ref([{
      value: 'Singlewell',
      label: '单井动态'
    }, {
      value: 'block',
      label: '区块动态'
    }]);
    var optionValue=ref('');
    var fitParameter= ref([]);
    var startDate = ref("2004-06-02");
    var endDate = ref("2020-12-16");
    var simProcess=ref("SimProcess");
    const progress = ref(30); // 你的百分比进度
    const progressBarWidth = ref('30%'); // 初始进度条宽度
    const option = reactive( {
      textStyle: {
        color: 'grey',
        fontweight:700
      },
      title: {
        text: "单井动态",
        top:560,
        left:300
      },
      xAxis: {
        name: '时间步',
        type: 'time',
      },
      yAxis: {
        nameTextStyle:{               //Y轴标题
          color:'grey',   //Y轴标题字体颜色
          fontSize:15
        },
        position: 'top',
      },
      series: [
        {
          data: [
            ['2023-01-01', 100],
            ['2023-02-01', 200],
            ['2023-03-01', 150],
          ],
          interval:0,
          type: 'line',
          symbol:'star', //设置拐点的样式，star是正方形
          smooth:true,
          areaStyle: {}
        }
      ]
    });
    let selectedWell = ref('');
    var selectedOption = ref('oilproduction');
    var selectedtrend = ref('Singlewell');
    var checkFreq = 1;
    var simStep = 0;

    const lineYPoint= computed({
      get:()=>option.series[0].data,
      set:(value)=>{
        option.series[0].data=value
      }
    })

    function readySim() {
      console.log('点击准备模拟')
      service.post("/znfx/simOder/readySim",{
        "layerNumList": "[1,2]",
        "dt": "30",
        "nt": "5"
      }).then(res=>{
        console.log(res.data.code)
        if (res.data.code==200){
          checkFreq=parseFloat(res.data.data)
          console.log('准备开始模拟,轮询频率为：'+checkFreq)
          simProcess.value='准备开始模拟'
        }
        else {
          simProcess.value=res.message + res.data.message
        }
      })
    }
    async function getSimLog() {
      try {
        const res = await service.get("/znfx/simOder/getSimLog");
        if (res.code === 200) {
          if (res.data === null) {
            // 数据为null时的处理
          } else if (res.data.step >= 0) {
            console.log('读取log');
            simProcess.value = simProcess.value + '\n' + res.data.step + res.data.simRecord;
            // 更新 simStep 的值
            simStep = res.data.step;
          } else {
            console.log('读取到负数');
            simProcess.value = simProcess.value + '\n' + res.data.step + res.data.simRecord;
            // 更新 simStep 的值
            simStep = res.data.step;
            console.log('执行终止');
            return; // 结束递归
          }
        } else {
          simProcess.value = simProcess.value + '\n' + '连接断开';
        }
      } catch (error) {
        // 处理请求错误
        console.error('请求失败', error);
        // 可以选择重新尝试或结束递归
      }

      // 设置下一次请求的延时，如果需要定时发送请求，可以使用 setTimeout
      const interval = checkFreq;
      setTimeout(getSimLog, interval);
    }
    function startSim(){
      console.log('点击开始模拟')
      service.post("/znfx/simOder/startSim",{
        "nt": "30"
      }).then(res=>{
        console.log(res.data.code)
        if (res.data.code==200){
          simProcess.value=simProcess.value+'\n模拟结束！'
        }
      })
      getSimLog()
    }
    function initEcharts(){
     if (myChart) {
        myChart.dispose();
        myChart = null;
      }
      var myChart = echarts.init(document.getElementById("fitConChart"))
      myChart.setOption(option);// 渲染页面
      console.log(myChart)
      console.log(option)
    }
    function calculateCumulativeSum(array) {
      let cumulativeSum = 0;
      let resultArray = [];

      for (let i = 0; i < array.length; i++) {
        cumulativeSum += array[i];
        resultArray.push(cumulativeSum);
      }

      return resultArray;
    }
    function singleWellPlotSwitch(newVal){
      switch (selectedOption.value){
        case "oilproduction":
          console.log('selectedWellNameHandler产油量')
          service.get("/znfx/history/getWOPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            res.data[1].forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
        case 'wateryield':
          console.log('selectedWellNameHandler产水量')
          service.get("/znfx/history/getWWPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            res.data[1].forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
        case 'liquidproduction':
          service.get("/znfx/history/getWLPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            console.log(res.data[1])
            res.data[1].forEach((value,index)=>{
              timeData.push([res.data[0][index],-value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })

          break
        case 'moisturecontent':
          service.get("/znfx/history/getWWCT" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            console.log(res.data[1])
            res.data[1].forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
        case 'cumoilproduction':
          service.get("/znfx/history/getWOPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            var r=calculateCumulativeSum(res.data[1])
            r.forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
        case 'cumwateryield':
          service.get("/znfx/history/getWWPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            var r=calculateCumulativeSum(res.data[1])
            r.forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })

          break
        case 'cumliquidproduction':
          service.get("/znfx/history/getWLPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            var r=calculateCumulativeSum(res.data[1])
            r.forEach((value,index)=>{
              timeData.push([res.data[0][index],-value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
      }
    }
    function filedPlotSwitch(){
      switch (selectedOption.value){
        case "oilproduction":
          console.log('selectedWellNameHandler产油量')
          service.get("/znfx/history/getWOPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            res.data[1].forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
        case 'wateryield':
          console.log('selectedWellNameHandler产水量')
          service.get("/znfx/history/getWWPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            res.data[1].forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
        case 'liquidproduction':
          service.get("/znfx/history/getWLPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            console.log(res.data[1])
            res.data[1].forEach((value,index)=>{
              timeData.push([res.data[0][index],-value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })

          break
        case 'moisturecontent':
          service.get("/znfx/history/getWWCT" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            console.log(res.data[1])
            res.data[1].forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
        case 'cumoilproduction':
          service.get("/znfx/history/getWOPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            var r=calculateCumulativeSum(res.data[1])
            r.forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
        case 'cumwateryield':
          service.get("/znfx/history/getWWPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            var r=calculateCumulativeSum(res.data[1])
            r.forEach((value,index)=>{
              timeData.push([res.data[0][index],value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })

          break
        case 'cumliquidproduction':
          service.get("/znfx/history/getWLPR" + "col", { params: { wellName: newVal } }).then((res)=>
          {
            var timeData=[]
            var r=calculateCumulativeSum(res.data[1])
            r.forEach((value,index)=>{
              timeData.push([res.data[0][index],-value])
            })
            lineYPoint.value=timeData
            initEcharts();
          })
          break
      }
    }

    const selectedWellNameHandler = (newVal, oldVal) => {
      console.log('selectedWellNameHandler'+newVal)
      if (selectedtrend.value ==='Singlewell'){
        singleWellPlotSwitch(newVal)
      }

    }
    const selectedOptionNameHandler = (newVal, oldVal) => {
      console.log('selectedOptionNameHandler')
      if (selectedtrend.value ==='Singlewell'){
        singleWellPlotSwitch(selectedWell.value)
      }
      initEcharts();
    }
    const selectedtrendNameHandler = (newVal, oldVal) => {
      if (newVal === "区块动态") {
        updateBlockDynamic();
      }
    };
    function saveToExcel() {
      const wb = XLSX.utils.book_new();
      const ws_data = [['id', 'value'], [1, 'foo'], [2, 'bar']];
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
      XLSX.writeFile(wb, 'result.xlsx');
    };

    onMounted(()=>{
      service.get("/znfx/BaseData/WellInitParam/getProWellNames").then((res)=>{
        selectWellNames.value.splice(0,selectWellNames.value.length);
        res.data.forEach((name) => {
          selectWellNames.value.push({ value: name, label: name });
        });
      })
      console.log('onMountedRuning')
      initEcharts();
    }),

        // 选项卡监听
        watch(selectedWell, selectedWellNameHandler),
        watch(selectedOption, selectedOptionNameHandler),
        watch(selectedtrend, selectedtrendNameHandler),
        // 监听进度值的变化，更新进度条宽度
        watch(progress, (newProgress) => {
          progressBarWidth.value = newProgress + '%';
        });
    return{
      selectedOption,selectedOptionNames,selectWellNames,optionValue,fitParameter,startDate,endDate,simProcess,selectedWell,selectedtrend,selectedtrendNames,saveToExcel,
      simStep,progress,progressBarWidth,initEcharts,selectedtrendNameHandler,option,
      readySim,startSim,
    }

  }




};



</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100vh;
  width: 100%;
}
.box-2 {
  display: flex;
  gap: 10px;
  height: 40%;
  width: 60%;
  justify-content: space-between;
}
.processdisplay{
  position: absolute;
  bottom: 40px;
  width: 47%;
  height: 400px;
  margin-left: 8px;
}
.time{
  position: relative;
  top: -4px;
  font-size:11px;
  margin-bottom: -25px;
}
.checkItem {
  border: 20px solid #ffffff; /* 设置边框宽度、样式和颜色 */
  margin-bottom: 8px;

}
.timeItem{
  border: 22px solid #ffffff; /* 设置边框宽度、样式和颜色 */
  margin-bottom: 10px;
}
.confim{
  position: absolute;
  bottom: 525px;
  left: 330px;
}

.title1{
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translate(-80%, -50%); /* 通过平移来居中 */
}
.box-3 {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.box-3.no-border {
  border-color: transparent;
  flex: 1;
}
.box-3.three {
  width: 50%;
}
.box-3 > .title {
  border-bottom: 1px solid #eee;
  margin-top: 10px;
  margin-bottom: 10px;
}
.box-3 > .title.flex {
  display: flex;
  gap: 10px;
  /* justify-content: flex-start; */
  align-items: center;
}
.box-3 > .title.no-border {
  border-color: transparent;
}
.box-3 .content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
.content > .sub-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h1.center,
h2.center,
h3.center {
  text-align: center;
}
.box-3 > .content {
  display: flex;
  padding: 10px;
}
.selectedWell >.el-select{
  position: absolute;
  top: 10px;
  left: 10px;
}
.selectedOption >.el-select{
  position: absolute;
  top: 10px;
  left: 240px;
}
.selectedtrend >.el-select{
  position: absolute;
  top: 10px;
  left: 470px;
}
.sim-button {
  position: relative;
  top: 8px;
  left: 560px;
}
.custom-input {
  width: 130px;
  height: 32px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #333;
  text-align: center;
}

.content > .sub-content ::v-deep .el-textarea__inner {
  max-height: 100%!important;
}
#button3 {
  text-align: center;
  line-height: 40px;
  height: 40px;
  width: 12%;
  float:left;
  border:1px #000000   solid;
  background-color: rgb(191, 187, 183);
  margin: 0 50px;
}
.chart-title {
  display: flex;
  font-size: 18px;
}
.chart-container {
  position: relative;
  top: 100px;
  display: flex;
  margin-left: 10px;
  justify-content: space-between;
  margin: 0 20px;
}
.progress-container {
  position: relative;
  top: -100px;
  width: 100%;
  height: 30px;
  background-color: #ccc;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #3498db; /* 进度条颜色 */
  transition: width 0.5s; /* 添加过渡动画 */
}

.progress-text {
  text-align: center;
  font-size: 18px;
  margin-top: -80px;
}
.progress-bar {
  border: 1px solid #f1eded; /* 添加边框 */
}

.select-container {
  position: relative;
}
.el-select {
  position: absolute;
}


</style>