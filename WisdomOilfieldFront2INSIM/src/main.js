import { createApp } from 'vue';
import ant from 'ant-design-vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import {router} from './router';
import store from './store';
import './permission';

import * as echarts from 'echarts'

//createApp(App).mount('#app')
let app = createApp(App);
app.use(store);
app.use(ElementPlus)
app.use(ant);
app.use(router);
app.config.globalProperties.$echarts = echarts
app.mount('#app');

app.config.warnHandler = (msg, vm, trace) => {
    // 忽略特定警告，不输出到控制台
    if (msg.includes('Invalid prop: type check failed for prop "value"')) {
        return;
    }

    // 默认警告处理逻辑
    console.warn(msg, vm, trace);
};
