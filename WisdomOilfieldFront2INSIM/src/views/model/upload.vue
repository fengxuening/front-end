
<template>

<div   >
  <el-button size="small" type="primary" @click="chooseFiles">选择文件夹</el-button>
  <div v-show="false">
    <input type="file" id="file" ref="file" webkitdirectory directory multiple="multiple" v-on:change="handleFileUpload($event)" />

  </div>
  <div> <el-button size="small"   @click="upload">上传</el-button></div>

  Last name: <input type="text" name="lname" value="Duck"><br>

</div>

</template>

<script>
  export default {
    name: 'dashboard',
    data() {
      return {

        modeList: ''
      }
    },
    created() {

    },
    methods: {

      handleFileUpload(event){
        this.modeList = document.getElementById("file").files;
      },
      //触发文件夹选择
      chooseFiles(e){
        document.getElementById('file').click();
      },
      upload(){
        let formData = new FormData();
        formData.append('file', this.modeList);
        console.log("ss"+this.modeList);
        this.api({
          url: "/api-tag/file/upload",
          method: "get",
          data:  formData

        }).then(data => {
          this.message = data;
        })
      }
    },
  }
</script>
