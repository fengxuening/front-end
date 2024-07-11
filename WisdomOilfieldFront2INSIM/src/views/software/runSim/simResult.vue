<template>
  <h1>模拟结果</h1>
</template>

<script>
import {computed, reactive, ref, toRef} from "vue";

export default {
  setup(){
    var option=reactive({
      title:{
        text:"",
        textAlign:"auto"
      },
      xAxis: {
        type:'value',
        scale:true,
        max:  (value) =>{
          this.xmaxNum=value.max+0.2*value.max
          return value.max+0.2*value.max;
        },
      },
      yAxis: {
        type:'value',
        scale:true,
        max:  (value) =>{
          this.ymaxNum=value.max+0.2*value.max
          return value.max+0.2*value.max;
        },
      },
      label:{
        show:true,
        position:'top',
        color:'#000',
        formatter:(params)=>{

          return params.name
        }
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
      tooltip:{
        formatter : (params)=>{
          if (params.componentType=='series' && params.seriesName!="img"){return params.name+':'+this.wells[params.name].wellName+' <br/>'+params.value}
          else if(params.componentType=='markLine'){return null}
          return null
        }
//这里设置的是鼠标悬停的提示
      },
      series: [
        {
          color:'red',
          name:'producer',
          type: 'scatter',
          symbolSize:10,
          yAxisIndex: 0,
          xAxisIndex: 0,
          data:[
            {name:null,value:[null,null]}
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
            {name:null,value:[null,null]}
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
            {name:null,value:[null,null]}
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
      ]
    })
    function deepRef(obj, property) {
      return ref(obj[property]);
    }
    var echaProPoint=deepRef(option.series[0],'data')
    console.log(option.series[0].data)
    echaProPoint.value.push([1,2,3,4])
    // echaProPoint.value=([1,2,3,4])
    console.log(option.series[0].data)
  }

}
</script>

<style scoped>

</style>