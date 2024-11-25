// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// 引入 Element Plus 和样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

// 设置全局变量
app.config.globalProperties.$BaseIp = "http://111.231.16.133:5000";

// 全局注册 Element Plus
app.use(ElementPlus);
// 注册 Vue Router
app.use(router);

// 创建并挂载 Vue 实例
router.isReady().then(() => {
    app.mount("#app");
});
