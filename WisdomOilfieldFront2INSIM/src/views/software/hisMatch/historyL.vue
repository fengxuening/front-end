<template>
  <el-container id="historyL">
    <el-aside style="width: 50%;height: 95%"
    >
      <el-radio-group v-model="performanceRadio" class="ml-4">
        <el-radio label="wlpr" size="large">产液/注水</el-radio>
        <el-radio label="wopr" size="large">产油</el-radio>
        <el-radio label="wwct" size="large">含水率</el-radio>
      </el-radio-group>
      <div class="fileInput" style="width: 100%;height: 10%">
        <el-upload
        >
          <el-button type="primary">选择生产动态文件</el-button>
          <el-button type="primary">导入</el-button>
          <el-button type="primary">清空</el-button>
        </el-upload>

      </div>
      <div class="loadedFile">
        <el-input placeholder="当前文件名为"></el-input>
      </div>
      <el-table
        border
        :data="L"
        max-height="700"
        width="600"
      >
        <el-table-column  fixed prop="id" label="id"></el-table-column>
        <el-table-column width="100px" fixed prop="date" label="date"></el-table-column>
        <el-table-column width="100px" fixed prop="time_step" label="time_step"></el-table-column>
        <template v-for="(wellName,index) in wellNames">
          <span>wellName</span>
          <el-table-column   :width="wellName.prop.length*16" :prop="wellName.prop" :label="wellName.prop">
          </el-table-column>
        </template>


      </el-table>
    </el-aside>
    <el-main style="width: 50%;height: 100%">
      <el-select v-model="selectedWellName" placeholder="请选择">
        <el-option
          v-for="item , index in wellNames"
          :key="index"
          :label="item.prop"
          :value="item.prop">
        </el-option>
      </el-select>
      <div  id="conChart" ref="conChart" style="width: 85%;height:400px;"></div>
      <div id="conChart2" ref="conChart2" style="width: 85%;height:400px;"></div>
    </el-main>
  </el-container>

</template>

<script>
import service from '@/utils/api'
import * as echarts from 'echarts';
import { ref, reactive, watch, onMounted } from 'vue';



export default {
  setup() {
    let fileList=[]
    const performanceRadio = ref('wlpr');
    const tableData = ref([]);
    let selectedWellName = ref('');
    const wellNames = ref([]);
    const dataZoomSet = reactive({
      strat: null,
      end: null
    });

    const option = reactive({
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 20
        },
        {
          start: 0,
          end: 20
        }
      ],
      xAxis: {
        type: 'time',
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          smooth: true,
          symbol: 'none',
          areaStyle: {color: 'gray'},
          data: [1,2,3],
          type: 'line'
        }
      ],
      title: {
        left: 'center',
        text: '单井注采液量'
      },
    });
    const option2 = reactive({
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 20
        },
        {
          start: 0,
          end: 20
        }
      ],
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          smooth: true,
          symbol: 'none',
          areaStyle: {color: 'gray'},
          data: [],
          type: 'line'
        }
      ],
      title: {
        left: 'center',
        text: '区块注采液量'
      },
    });

    const loadAll = () => {
      const str = performanceRadio.value.toUpperCase();
      service.get("/znfx/history/" + str).then((res) => {
        tableData.value = res.data;
      });
    };
    const getWellNameS = () => {
      const dic = {
        "wlpr": "getWellNames",
        "wopr": "getProWellNames",
        "wwct": "getProWellNames",
      };

      const str = dic[performanceRadio.value];
      service.get("/znfx/BaseData/WellInitParam/" + str).then((res) => {
        wellNames.value.splice(0, wellNames.value.length);
        res.data.forEach((name) => {
          wellNames.value.push({ label: name, prop: name });
        });
      });
    };
    const plotLBywellName = (wellName) => {
      const str = performanceRadio.value.toUpperCase();
      service.get("/znfx/history/get" + str + "col", { params: { wellName: wellName } }).then((res) => {
        let Ldate = [];
        for (var i = 0; i < res.data[0].length; i++) {
          Ldate.push([res.data[0][i], res.data[1][i]]);
        }
        option.series[0].data.splice(0, option.series[0].data.length);
        Ldate.forEach((item) => option.series[0].data.push(item));
        refeshEchart();
      });
    };
    const plotSumL = () => {
      let str = "F" + performanceRadio.value.toUpperCase().slice(1);
      service.get("/znfx/history/get" + str).then((res) => {
        let Ldate = [];
        for (var i = 0; i < res.data[0].length; i++) {
          Ldate.push([res.data[0][i], res.data[1][i]]);
        }
        option2.series[0].data.splice(0, option2.series[0].data.length);
        Ldate.forEach((item) => option2.series[0].data.push(item));
        refeshEchart();
      });
    };
    const refeshEchart = () => {
      option.dataZoom[0].start = dataZoomSet.strat;
      option.dataZoom[0].end = dataZoomSet.end;
      if (myChart) {
        console.log('dispose')
        myChart.dispose();
        myChart = null;
      }
      if (myChart2) {
        console.log('dispose2')
        myChart2.dispose();
        myChart2 = null;
      }

      var myChart = echarts.init(document.getElementById("conChart"))
      var myChart2 = echarts.init(document.getElementById("conChart2"))

      console.log(myChart)
      console.log(myChart2)
      console.log(option)
      console.log(option2)

      myChart.setOption(option);
      myChart2.setOption(option2);
    }
    const selectedWellNameHandler = (newVal, oldVal) => {
      plotLBywellName(newVal);
    };
    const performanceRadioHandler = (newVal, oldVal) => {

      const wellTitile = {
        "wlpr": "单井注采液量",
        "wopr": "单井产油",
        "wwct": "单井含水率",
      };
      const fieldTitle= {
        "wlpr": "区块注采液量",
        "wopr": "区块产油",
        "wwct": "区块含水率",
      };

      var wellAreaColor= {
        "wlpr": "gray",
        "wopr": "red",
        "wwct": "blue",
      };

      option.title.text=wellTitile[performanceRadio.value]
      option2.title.text=fieldTitle[performanceRadio.value]
      // 曲线图标题
      
      option2.series[0].areaStyle.color=wellAreaColor[performanceRadio.value]
      option.series[0].areaStyle.color=wellAreaColor[performanceRadio.value]
      getWellNameS()
      loadAll();
      plotLBywellName(wellNames.value[0].prop)

      getWellNameS();
      plotSumL();
      refeshEchart();

    };

    const chartLine =option.series[0].data;
    const chartLine2 = option2.series[0].data;

    watch(selectedWellName, selectedWellNameHandler);
    watch(performanceRadio, performanceRadioHandler);

    onMounted(() => {
      loadAll();
      getWellNameS();
      plotSumL();
    });

    return {
      fileList,
      performanceRadio,
      L: tableData,
      selectedWellName,
      wellNames,
      dataZoomSet,
      option,
      option2,
      chartLine,
      chartLine2,
      refeshEchart,
      plotLBywellName,
      plotSumL
    };
  }
}
</script>

<style scoped>
.el-main
{
  padding: 0px;
}
</style>
