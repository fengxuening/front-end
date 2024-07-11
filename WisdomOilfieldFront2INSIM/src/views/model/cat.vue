<meta http-equiv="Content-Type" content="multipart/form-data; charset=utf-8" />
<template>

<div>


  <form action="/file/upload" enctype="multipart/form-data" method="post">

    <input type="hidden" name="type" value="1"/>

    <input id="dir" type="file" name="file" webkitdirectory mozdirectory/>

    <input id="uploadDir" type="submit" value="提交文件夹">

  </form>

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
        console.log("modeList"+this.modeList);
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
