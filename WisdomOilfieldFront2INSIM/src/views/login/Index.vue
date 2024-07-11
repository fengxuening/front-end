<template>
  <div class="login-container">
    <a-form
        :model="loginForm"
        autocomplete="on"  ref="elForm">
      <h3 class="title" style="text-align:center">智能注采优化平台</h3>
      <a-form-item
          name="username"
          :rules="[{ required: true,trigger: 'blur', message: '用户名不能为空!' }]" >
        <div class="text">姓名：</div>
        <a-input v-model:value="loginForm.username" />
      </a-form-item>
      <a-form-item
          name="password"
          :rules="[{ required: true,trigger: 'blur', message: '密码不能为空!' }]" >
        <div class="text">密码：</div>
        <a-input-password  v-model:value="loginForm.password"
                           style="  box-sizing: border-box;
                                    position: relative;
                                    left:36%;
                                    width: 28%;
                                    padding: 7px 27px;
                                    font-size: 16px;
                                    border: 1px solid #2d3a4b;
                                    border-radius: 2px;">
                                          </a-input-password>
      </a-form-item>
      <a-form-item style="margin-left: 47%">
        <a-button type="primary"   @click="login01()">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import { useStore } from "vuex";
import  {reactive,watch}  from "vue";
import { handleLogin } from '@/api/login';
import {router} from '@/router'
import {message} from "ant-design-vue";
const store = useStore();
const  loginForm=reactive({
  username: undefined,
  password: undefined,
  grant_type: 'password',
  client_secret: '123456',
  client_id: 'client-app'
})
const login01=()=>{
  var promise = new Promise((resolve, reject) => {
    store.commit('clear')
    resolve('success')
  });
  promise.then((res) => {
    handleLogin(loginForm).then((r) => {

      let data= r;
      if ("操作成功"===data.msg) {
        //存储token值
        store.commit('updateAuthorization', r.data.token_type + " " + r.data.access_token);
        store.commit('updateRefreshToken', r.data.refresh_token);
        //转到首页面
        router.push('/dashboard')
      }
    }).finally(() => {

    })
  }).catch((err) => {
    message.error("登录失败!")
  })


}
</script>
<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters([
      'permission_routers',
    ]),
  },
  mounted(){
    if(this.permission_routers.length!==4){
      window.location.reload();
    }
  }

}
</script>
<style>
.ant-form-item-explain-error {
  position:absolute;
  left:36%;
}
</style>
<style lang="scss" scoped>
@import "src/styles/mixin";
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position:relative;
  height: 100vh;
  background-color: $bg;
}
.title {
  font-size: 26px;
  color: $light_gray;
  margin: 0 auto 40px auto;
  text-align: center;
  font-weight: bold;
  padding-top: 110px;
}
.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input, .ant-form-item-has-error :not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper, .ant-form-item-has-error :not(.ant-input-number-affix-wrapper-disabled):not(.ant-input-number-affix-wrapper-borderless).ant-input-number-affix-wrapper, .ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input:hover, .ant-form-item-has-error :not(.ant-input-affix-wrapper-disabled):not(.ant-input-affix-wrapper-borderless).ant-input-affix-wrapper:hover, .ant-form-item-has-error :not(.ant-input-number-affix-wrapper-disabled):not(.ant-input-number-affix-wrapper-borderless).ant-input-number-affix-wrapper:hover {
  background-color: #2d3a4b;
  border-color: #ff4d4f;
}
.ant-input {
  box-sizing: border-box;
  position: relative;
  left:36%;
  width: 28%;
  padding: 7px 27px;
  font-size: 16px;
  border: 1px solid #2d3a4b;
  border-radius: 2px;
}
.svg-container{
  color: $dark_gray;
  position:absolute;
  font-size:21px;
  top:6px;
  right: 0;
  width:66%;
  height: 100px;
}


.text {
  font-size: 16px;
  color: #eee;
  position: absolute;
  top: 16%;
  left: 32%;
}
</style>
