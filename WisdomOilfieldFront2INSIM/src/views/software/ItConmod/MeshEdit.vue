<template>
  <div class="viewPage">
    <div class="container"> 
      <div class="left" style="width: 1000px; overflow: auto;"> 
      <div style="display: flex;flex-direction: row">
      <!--      eChart图像-->
      <div id="meshChart" ref="meshChart" :style="{width:'1000px',height:'600px'}"></div>
    </div>
    <span class="grid">Delaunay网格</span>
    <el-row :gutter="20" style="width: 100%" class="grid">
      <el-col :span="4" class="grid"><div class="grid-content bg-purple">最大三角形面积</div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple">最小角度</div></el-col>
    </el-row>
    <el-row :gutter="20" style="width: 100%" class="grid">
      <el-col :span="3" class="grid"><div class="grid-content bg-purple"><el-input v-model="meshInitParam.areaConstraint" @input="handleInput()" @focus="showMessage(1)"></el-input></div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple"><el-input v-model="meshInitParam.angleConstraint"></el-input></div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple">
        <el-button @click="
        isLoading=true;
        clearData();
        loadWellsFromDataBase(1);
        initDMesh('1',meshInitParam.areaConstraint,meshInitParam.angleConstraint)
        isLoading=false
" :disabled="meshInitParam.error">
          初始化网格
        </el-button></div>
      </el-col>
      <el-col :span="3" :offset="2"><div class="grid-content bg-purple"><el-button @click="deletePoint(1)">删除井点</el-button></div></el-col>
      <el-col :span="4" class="addPoint"><div class="grid-content bg-purple"><el-button @click="addPoint(1)">增加井点</el-button></div></el-col>
      <el-col :span="3" class="cleargrid"><div class="grid-content bg-purple"><el-button @click="cleargrid(1)">清除网格</el-button></div></el-col>
      
    </el-row>
    <span class="grid">全连接网格</span>
    <el-row :gutter="20" style="width: 100%" class="grid">
      <el-col :span="4" class="grid"><div class="grid-content bg-purple">最长连接长度</div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple">最小角度</div></el-col>
    </el-row>
    <el-row :gutter="20" style="width: 100%" class="grid">
      <el-col :span="3" class="grid"><div class="grid-content bg-purple"><el-input v-model="allConMeshInitParam.maxLength"></el-input></div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple"><el-input v-model="allConMeshInitParam.minAngle"></el-input></div></el-col>
      <el-col :span="3"><div class="grid-content bg-purple"><el-button @click="
        isLoading=true;
        clearData();
        loadWellsFromDataBase(1);
        initAllConMesh('1',allConMeshInitParam.maxLength,allConMeshInitParam.minAngle)
">初始化网格</el-button></div></el-col>
      <el-col :span="3" :offset="2"><div class="grid-content bg-purple"><el-button @click="deleteSeg(1)">删除连通</el-button></div></el-col>
      <el-col :span="3" class="addSeg"><div class="grid-content bg-purple"><el-button @click="addSeg(1)">增加连通</el-button></div></el-col>
      <el-col :span="3" class="firm"><div class="grid-content bg-purple"><el-button type="primary" class="confirm">确认</el-button></div></el-col>
    </el-row>
    </div>
    <div class="right" > 
      <span class="viewsetup">视图设置</span>
      <hr class="divider">
      <el-row :gutter="20" style="width: 100%">
      <el-col :span="12"><div class="grid-content bg-purple">属性</div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple">值</div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井名字体颜色</div></el-col>
      <el-col :span="11" style="display: flex; align-items: center;" >
          <el-color-picker v-model="wellNameFontColor" @change="handleColorChange"></el-color-picker>
          <span style="margin-left: 10px;">[{{ rgbArray.join(', ') }}] ({{ alphaValue }})</span>
      </el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井形状</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-select v-model="selectshape" clearable placeholder="选择井形状"  class="wellsize" @change="selectedshapeNameHandler" >
    <el-option
      v-for="item in selectedshapeNames"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井大小</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-input v-model="wellsize" class="wellsize"></el-input></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="10"><div class="grid-content bg-purple">水井</div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">显示</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-checkbox  label="true" border size="display" class="wellsize"></el-checkbox></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">显示井名</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-checkbox  label="true" border size="display" class="wellsize"></el-checkbox></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井名字体颜色</div></el-col>
      <el-col :span="11" style="display: flex; align-items: center;" >
        <el-color-picker v-model="waterWellLabelColor" @change="handlewaterColorChange"></el-color-picker>
    <span style="margin-left: 10px;">[{{ rgbArray.join(', ') }}] ({{ alphaValue }})</span>
      </el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井形状</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-select v-model="selectwatershape" clearable placeholder="选择井形状"  class="wellsize" @change="selectedwatershapeNameHandler" >
    <el-option
      v-for="item in selectedwatershapeNames"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井大小</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-input v-model="waterwellsize" class="wellsize"></el-input></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="10"><div class="grid-content bg-purple">虚拟井</div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">显示</div></el-col>
      <el-col :span="11" ><div class="grid-content bg-purple"><el-checkbox  label="true" border size="display" class="wellsize"></el-checkbox></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">显示井名</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-checkbox  label="true" border size="display" class="wellsize"></el-checkbox></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井名字体颜色</div></el-col>
      <el-col :span="11" style="display: flex; align-items: center;" >
          <el-color-picker v-model="wellNameFontColor" @change="handleColorChange"></el-color-picker>
          <span style="margin-left: 10px;">[{{ rgbArray.join(', ') }}] ({{ alphaValue }})</span>
      </el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井形状</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-select v-model="selectdummyshape" clearable placeholder="选择井形状"  class="wellsize" @change="selecteddummyshapeNameHandler" >
    <el-option
      v-for="item in selecteddummyshapeNames"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">井大小</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-input v-model="dummywellsize" class="wellsize"></el-input></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="10"><div class="grid-content bg-purple">连通线</div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">连通线形状</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-select v-model="selectConnectline" clearable placeholder="选择形状"  class="wellsize" @change="selectedConnectlineNameHandler" >
    <el-option
      v-for="item in selectedConnectlineNames"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></div></el-col>
    </el-row>
    <hr class="divider">
    <el-row :gutter="20" style="width: 100%">
      <el-col :span="11" class="well-name"><div class="grid-content bg-purple">连线宽度</div></el-col>
      <el-col :span="11"><div class="grid-content bg-purple"><el-input-number v-model="Connectline" controls-position="right" @change="handleChange" class="wellsize"></el-input-number></div></el-col>
    </el-row>
    <hr class="divider">
    </div>
    </div>
    
  </div>
</template>

<script >
import service from "@/utils/api";
import { ElMessage } from 'element-plus';

import * as echarts from "echarts/core";
import {computed, onMounted, reactive, ref} from "vue";

// 这个部分还是vue2的写法，并不影响使用
export default {
  setup(){
    function deepRef(obj, property) {
      return ref(obj[property]);
    }

    var dataZoomSet={
      strat:null,
      end:null
    };
    var conChartWidth=ref("1200px");
    var xmaxNum = 0;
    var ymaxNum = 0;
    var realWellCount = 0;
    var wells = [];
    var selectshape = ref('圆形');
    var selectwatershape = ref('正方形')
    var selectdummyshape = ref('三角形');
    var selectConnectline = ref('反三角');
    var wellsize = ref("8"); 
    var waterwellsize = ref("9"); 
    var dummywellsize = ref("10"); 
    var Connectline = ref("4")
    var wellNameFontColor = ref("#000000"); // 初始颜色为黑色
    var waterWellLabelColor = ref('#ffffff');
    var rgbArray = ref([0, 0, 0]);
    var alphaValue = ref(255);
    var selectedshapeNames = ref([
    { value: 'circle', label: '圆形' },
    { value: 'square', label: '正方形' },
    { value: 'rectangle', label: '长方形' },
    { value: 'triangle', label: '三角形' }
  ]);
  var selectedConnectlineNames = ref([
    { value: 'arctriangle', label: '反三角' },
    { value: 'arcsquare', label: '反正方形' },
    { value: 'arcrectangle', label: '反长方形' }
  ]);
  var selectedwatershapeNames = ref([
    { value: 'circle', label: '圆形' },
    { value: 'square', label: '正方形' },
    { value: 'rectangle', label: '长方形' },
    { value: 'triangle', label: '三角形' }
  ]);
  var selecteddummyshapeNames = ref([
    { value: 'circle', label: '圆形' },
    { value: 'square', label: '正方形' },
    { value: 'rectangle', label: '长方形' },
    { value: 'triangle', label: '三角形' }
  ]);
    var option={
      title:{
        text:"",
        textAlign:"auto"
      },
      xAxis: {
        type:'value',
        scale:true,
        max:  (value) =>{
          xmaxNum=value.max+0.2*value.max
          return value.max+0.2*value.max;
        },
      },
      yAxis: {
        type:'value',
        scale:true,
        max:  (value) =>{
          ymaxNum=value.max+0.2*value.max
          return value.max+0.2*value.max;
        },
      },
      tooltip:{
        formatter : (params)=>{
          if (params.componentType=='series' && params.seriesName!="img"){return params.name+':'+wells[params.name].wellName+' <br/>'+params.value}
          else if(params.componentType=='markLine'){return null}
          return null
        }
//这里设置的是鼠标悬停的提示
      },
      dataZoom:[
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none'
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none'
        }
      ],
      series: [
        {
          color:'red',
          name:'producer',
          type: 'scatter',
          symbolSize:10,
          yAxisIndex: 0,
          xAxisIndex: 0,
          data:[
            {name:'redTest',value:[1,1]}
          ],
        },
        {
          color:'blue',
          name:'injector',
          type: 'scatter',
          symbolSize:10,
          yAxisIndex: 0,
          xAxisIndex: 0,
          data:[
            {name:'blueTest',value:[2,2]}
          ],
        },
        {
          color:'black',
          name:'img',
          type: 'scatter',
          symbolSize:10,
          yAxisIndex: 0,
          xAxisIndex: 0,
          data:[
            {name:'blackTest',value:[3,3]}
          ],
        },
        {
          type: 'line',
          yAxisIndex: 0,
          xAxisIndex: 0,
          markLine:
              {
                silent:true,//这个属性决定了线段能不能相应鼠标事件
                symbol:"none",
                yAxisIndex: 0,
                xAxisIndex: 0,
                data: [
                  [
                    {xAxis: null, yAxis: null},
                    {xAxis: null, yAxis: null},
                  ]
                ],
                lineStyle:{
                  type:'solid'
                }
              }
        }
      ],
      label:{
        show:true,
        position:'top',
        color:'#000',
        formatter:(params)=>{

          return params.name
        }
      },
    }
    var meshInitParam=reactive({
      layerNum:1,
      areaConstraint:null,
      angleConstraint:-1,
      error: true,        // 用来判断条件是否会导致网格过密
      minArea:null
    })
    var allConMeshInitParam=reactive({
      layerNum:1,
      maxLength:700,
      minAngle:13
    })
    var isLoading = ref(false)
    
    const echaProPoint=deepRef(option.series[0],'data');
    const echaInjPoint=deepRef(option.series[1],'data');
    const echaImgPoint=deepRef(option.series[2],'data');
    const echalinks=deepRef(option.series[3].markLine,'data');
    const echarTitle=deepRef(option.title,'text');
    const myChart=computed({
      get:()=>echarts.init(document.getElementById("meshChart"),null)
    })
    function refeshEchart(){

      console.log(myChart.value)
      console.log('refeshEchart')

      // option.dataZoom[0].start=dataZoomSet.strat
      // option.dataZoom[0].end=dataZoomSet.end
      console.log('option')
      console.log(option.series[0].data[0].value)
      console.log(option)
      myChart.value.setOption(option)
    }
    function clearData(){
      // echaInjPoint.splice(0,echaInjPoint.length)//清空epoint数组
      echaImgPoint.value.splice(0,echaImgPoint.value.length)//清空epoint数组
      // echaProPoint.splice(0,echaProPoint.length)//清空epoint数组
      echalinks.value.splice(0,echalinks.value.length)//清空links数组
    }
    function optScatterWells(){
      clearData()
      let polyIndex=1
      wells.forEach((item)=>{
        //这里的item是一个井的 Jason类实例对象
        if (item.wellType==0){echaProPoint.value.push({name:polyIndex,value:[item.x,item.y]})}
        else if(item.wellType==1){echaInjPoint.value.push({name:polyIndex,value:[item.x,item.y]})}
        polyIndex=polyIndex+1
      })//将wells的坐标push到echart模块的option对象中去
    }
    function initDMesh(layerNum, areaConstraint, angleConstraint){
      service.post("/znfx/ConnectModel/mesnInit",{"layerNum":layerNum,"areaConstraint":areaConstraint,"angleConstraint":angleConstraint}).then(res=>{
            if (res.data){//为0或者为null都会更新失败
              console.log("初始化网格成功"+res.data)
              // option.title.text="最大面积为"+areaConstraint+"最小角度为"+angleConstraint
              initMeshFromEleFile(layerNum)
            }
            else {
              console.log("初始化网格失败"+res.message)}
          }
      )
      
    }
    function initAllConMesh(layerNum, maxLength, minAngle){
      service.post("/znfx/ConnectModel/allConMeshInit",{"layerNum":layerNum,"maxLength":maxLength,"minAngle":minAngle}).then(res=>{
            if (res.data){//为0或者为null都会更新失败
              console.log("初始化网格成功"+res.data)
              // option.title.text="最大面积为"+areaConstraint+"最小角度为"+angleConstraint
              loadPoly(layerNum)
            }
            else {
              console.log("初始化网格失败"+res.message)}
          }
      )
    }
    function initMeshFromEleFile(layerNum) {
      service.post("/znfx/ConnectModel/turnEleToPoly",{"layerNum":layerNum}).then(
          (res)=>
              // {name:item[0],value:item.slice(1)}
          {
            res.data.nodeCoordList.forEach((item)=>{
              if (item[0]>realWellCount){echaImgPoint.value.push({name:item[0],value:item.slice(1)})}
            })//这里耦合了
            res.data.segList.forEach(
                (item)=>{
                  let coord_1=res.data.nodeCoordList[item[1]-1].slice(1)
                  let coord_2=res.data.nodeCoordList[item[2]-1].slice(1)
                  echalinks.value.push([{xAxis: coord_1[0], yAxis: coord_1[1]},{xAxis: coord_2[0], yAxis: coord_2[1]}])
                })
            refeshEchart()
          }
      )
    }
    function loadPoly(layerNum) {
      echaImgPoint.value.splice(0,echaImgPoint.value.length)//清空epoint数组
      echalinks.value.splice(0,echalinks.value.length)//清空links数组
      service.post("/znfx/ConnectModel/loadPoly",{"layerNum":layerNum}).then(

          (res)=>
              // {
              //   echalinks.push(                    [
              //     {xAxis: 2000, yAxis: 2000},
              //     {xAxis: 3000, yAxis: 3000},
              //   ])
              //   refeshEchart
              // }
              // {name:item[0],value:item.slice(1)}
          {
            res.data.nodeCoordList.forEach((item)=>{
              if (item[0]>realWellCount){echaImgPoint.value.push({name:item[0],value:item.slice(1)})}
            })//这里耦合了
            res.data.segList.forEach(
                (item)=>{
                  const coord_1=res.data.nodeCoordList[item[1]-1].slice(1)
                  const coord_2=res.data.nodeCoordList[item[2]-1].slice(1)
                  echalinks.value.push([{xAxis: coord_1[0], yAxis: coord_1[1]},{xAxis: coord_2[0], yAxis: coord_2[1]}])
                })
            // debugger
            refeshEchart()
          }
      )

    }
    function loadWellsFromDataBase(layer) {
      service.get("/znfx/BaseData/WellInitParam/getWellsByLayer/"+layer).then(
          (res) =>{
            if (res.data){
              realWellCount=res.data.length
              wells=res.data
              optScatterWells()
              refeshEchart()
            }
            else {
              alert(res.message)
            }
          }
      )
    }
    function deletePoint(layerNum){
      myChart.value.on('click',(point)=>{
        if (point.name>realWellCount){
          service.post("/znfx/ConnectModel/editPoly",
              {
                "layerNum":layerNum,
                "edit":"p.deletePoint("+point.name+")"
              }
          ).then((param)=>{
            console.log(param)
            myChart.value.off('click')
            loadPoly(layerNum)
          })
        }
        else {
          console.log("点击位置错误，且不能使用此按钮删除真实井点")
        }
      })
    }
    function deleteSeg(layerNum){
      let segEndPointIndex=[]
      myChart.value.on('click',(point)=>{
        segEndPointIndex.push(point.name)
        console.log(segEndPointIndex)
        console.log("segEndPointIndex.length is"+segEndPointIndex.length)
        if (segEndPointIndex.length>=2){
          console.log("two Point!")
          myChart.value.off('click')
          service.post("/znfx/ConnectModel/editPoly",
              {
                "layerNum":layerNum,
                "edit":"p.deleteSeg("+"["+segEndPointIndex+"]"+")"
              }
          ).then((param)=>{
            loadPoly(layerNum)
          })
        }
      })
    }
    function addSeg(layerNum){
      let segEndPointIndex=[]
      myChart.value.on('click',(point)=>{
        segEndPointIndex.push(point.name)
        console.log(segEndPointIndex)
        console.log("segEndPointIndex.length is"+segEndPointIndex.length)
        if (segEndPointIndex.length>=2){
          console.log("two Point!")
          myChart.value.off('click')
          service.post("/znfx/ConnectModel/editPoly",
              {
                "layerNum":layerNum,
                "edit":"p.addSeg("+"["+segEndPointIndex+"]"+")"
              }
          ).then((param)=>{
            loadPoly(layerNum)
          })
        }
      })
    }
    function calConvexHullArea (points){
      // 判断三个点的方向
      function direction(p1, p2, p3) {
        return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
      }

      // 计算凸包面积
      function getConvexHullArea(convexHull) {
        let area = 0;
        for (let i = 1; i < convexHull.length - 1; i++) {
          area += direction(convexHull[0], convexHull[i], convexHull[i + 1]);
        }
        return Math.abs(area / 2);
      }

      // 寻找最左下角的点
      function findLeftmostPoint(points) {
        let leftmost = 0;
        for (let i = 1; i < points.length; i++) {
          if (points[i][0] < points[leftmost][0] || (points[i][0] === points[leftmost][0] && points[i][1] < points[leftmost][1])) {
            leftmost = i;
          }
        }
        return leftmost;
      }

      // 根据极角排序
      function sortByPolarAngle(points, referencePoint) {
        function polarAngle(p1, p2) {
          const p1x = p1[0] - referencePoint[0];
          const p1y = p1[1] - referencePoint[1];
          const p2x = p2[0] - referencePoint[0];
          const p2y = p2[1] - referencePoint[1];
          return Math.atan2(p1y, p1x) - Math.atan2(p2y, p2x);
        }
        return points.sort(polarAngle);
      }

      if (points.length < 3) {
        return 0; // 至少需要三个点构成一个凸包
      }

      const leftmostPointIndex = findLeftmostPoint(points);
      const referencePoint = points[leftmostPointIndex];
      const sortedPoints = sortByPolarAngle(points, referencePoint);

      const convexHull = [sortedPoints[0], sortedPoints[1]];
      for (let i = 2; i < sortedPoints.length; i++) {
        while (
            convexHull.length > 1 &&
            direction(convexHull[convexHull.length - 2], convexHull[convexHull.length - 1], sortedPoints[i]) <= 0
            ) {
          convexHull.pop();
        }
        convexHull.push(sortedPoints[i]);
      }

      return getConvexHullArea(convexHull);
    }
    const selectedshapeNameHandler = (newVal, oldVal) => {
      if (newVal !== oldVal) {
        console.log('选择的井形状:', newVal);
      }
    };
    const selectedConnectlineNameHandler = (newVal, oldVal) => {
      if (newVal !== oldVal) {
        console.log('选择的连线宽度:', newVal);
      }
    };
    const selectedwatershapeNameHandler = (newVal, oldVal) => {
      if (newVal !== oldVal) {
        console.log('选择的水井形状:', newVal);
      }
    };
    const selecteddummyshapeNameHandler = (newVal, oldVal) => {
      if (newVal !== oldVal) {
        console.log('选择的虚拟井形状:', newVal);
      }
    };
    function handleInput(){
      let num=meshInitParam.areaConstraint
      // 检查是否小于限制
      if (num > getMinArea(1) || num===-1) {
        meshInitParam.error = false;

      } else {
        meshInitParam.error = true;
        console.log('输入太小了')
      }
    }
    function getMinArea (layerNum){
      const points=wells.map(well=>[well.x,well.y])
      const convexHullArea = calConvexHullArea(points);
      const minTriangleArea=convexHullArea/100
      meshInitParam.minArea=minTriangleArea
      return minTriangleArea
    }
    function showMessage(layerNum){
      getMinArea(layerNum)
      ElMessage({
        message: '最小值为'+meshInitParam.minArea.toFixed(2),
        type: 'info'
      });
    }

    function testOption(){
      const r1 = Math.floor(Math.random() * 10) + 1;
      const r2 = Math.floor(Math.random() * 10) + 1;

      option.series[0].data[0].value=[r1,r2]
      refeshEchart()
    }

    function handleColorChange(color) {
      console.log("Selected Color:", color);
      const rgbValue = color.substring(1); // 去掉颜色字符串的#
      const r = parseInt(rgbValue.substring(0, 2), 16);
      const g = parseInt(rgbValue.substring(2, 4), 16);
      const b = parseInt(rgbValue.substring(4, 6), 16);
      const a = Math.round((parseInt(rgbValue.substring(6, 8), 16) / 255) * 100);

      // 更新显示的 RGB 值和 Alpha 值
      rgbArray.value = [r, g, b];
      alphaValue.value = a;
      console.log(`RGB: [${r}, ${g}, ${b}] (${a})`);
      
    }
    
    function handlewaterColorChange(color) {
    console.log("Selected Water Well Color:", color);
    const rgbValue = color.substring(1);
    const r = parseInt(rgbValue.substring(0, 2), 16);
    const g = parseInt(rgbValue.substring(2, 4), 16);
    const b = parseInt(rgbValue.substring(4, 6), 16);
    const a = Math.round((parseInt(rgbValue.substring(6, 8), 16) / 255) * 100);

    // 更新水井的 RGB 值和 Alpha 值
    waterWellLabelColor.value = `rgba(${r}, ${g}, ${b}, ${a / 100})`;
    console.log(`Water Well Color: rgba(${r}, ${g}, ${b}, ${a / 100})`);
  }
    onMounted(()=>{
      console.log('onMountedRuning')
      loadWellsFromDataBase(1)
      console.log(option)
      loadPoly(1)
      document.getElementById("meshChart").style["height"]=((ymaxNum/xmaxNum)*1200)+'px'
      myChart.value.on('dataZoom',(event)=>{
        if(event.batch){
          dataZoomSet.strat=event.batch[0].start;
          dataZoomSet.end=event.batch[0].end;
        }else{
          dataZoomSet.stra=event.start;
          dataZoomSet.end=event.end;
        };
      });
      refeshEchart()
    });
    return{
      refeshEchart,clearData,initDMesh,initAllConMesh,loadWellsFromDataBase,deletePoint,deleteSeg,addSeg,handleInput,showMessage,echarTitle,conChartWidth,wellsize,
      allConMeshInitParam,meshInitParam,option,testOption,wellNameFontColor,handleColorChange,rgbArray,alphaValue,selectshape,selectedshapeNameHandler, selectedshapeNames,
      handlewaterColorChange,waterWellLabelColor,handleColorChange,selectwatershape,selectedwatershapeNameHandler,selectedwatershapeNames,selectdummyshape,selecteddummyshapeNameHandler,
      selecteddummyshapeNames,dummywellsize,waterwellsize,Connectline,

      selectedConnectlineNames,selectConnectline,selectedConnectlineNameHandler,
    }

  }

}
</script>

<style scoped>
.viewPage {
  display: flex;
  justify-content: space-between;
}
.container{
  display: flex;
  flex: 1;
}
.left{
  overflow: auto;
}
.viewPage .container .right {
  align-self: flex-start; /* 垂直对齐到容器的顶部 */
  margin-top: 15px !important;
  flex: 1;
}
.addPoint{
  margin-left: -20px;
}
.grid{
  margin-left: 50px;
}
.addSeg{
  margin-left: -20px;
}
.cleargrid{
  margin-left: 20px;
}
.confirm{
  height: 32px; /* 调整按钮高度 */
  padding: 0 30px; /* 调整按钮内边距 */
}
.firm{
  margin-left: 60px;
}
.viewsetup{
  font-size: 16px;
}
.divider {
  margin-top: 3px; /* 调整这个值以控制线条与上方内容的间距 */
  margin-bottom: 3px;
  border: none;
  border-top: 1px solid #ccc; /* 调整颜色和宽度 */
}
.wellsize{
  width: 120px;
}
.well-name{
  margin-left: 25px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>