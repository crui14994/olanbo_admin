<template>
  <div class="video-box" id="container">
    <el-upload
      class="upload-demo"
      drag
      ref="upload"
      :auto-upload="false"
      :action="upload_qiniu_url"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-error="handleError"
      :on-change="changeUpload"
      :before-upload="beforeAvatarUpload"
      :data="qiniuData"
    >
      <img class="avatar upload-img" v-if="imageUrl" :src="imageUrl" />
      <div v-else class="el-default">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
    </el-upload>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
  </div>
</template>

<script>

import * as qiniu from "qiniu-js";
export default {
  data() {
    return {
      qiniuData: {
        key: "",
        token: ""
      },
      // 七牛云上传储存区域的上传域名（华东、华北、华南、北美、东南亚）
      upload_qiniu_url: "https://upload.qiniup.com",
      // 七牛云返回储存图片的子域名
      upload_qiniu_addr: "http://static.52pkmir.cn/",
      imageUrl: "",
      nowData: 0,
      fName: ""
    };
  },
  // watch:{
  //   fName :function(val){
  //     this.getQiniuToken(val);
  //   }
  // },
  created() {
    // this.nowData=Date.parse(new Date())
    // this.getQiniuToken(this.fName);
  },
  methods: {
    //获取token
    getQiniuToken: function(key) {
      const _this = this;
      this.axios
        .get("/api/get7Token", {
          params: {
            fileName: key,
            userId: 1
          }
        })
        .then(function(res) {
          if (res.data.code == 200) {
            _this.qiniuData.token = res.data.data;
            console.log(_this.qiniuData.token);
          } else {
            _this.$message({
              message: "上传失败，请联系网站管理员！"
            });
          }
        });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    changeUpload(file) {
      this.fName = file.name;
      this.getQiniuToken(this.fName);
    },
    beforeAvatarUpload: function(file) {
      //对文件重命名
      // let filetype = "";
      // if (file.type === "image/png") {
      //   filetype = "png";
      // } else {
      //   filetype = "jpg";
      // }
      // this.fName = file.name;
      this.qiniuData.key = file.name;

      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
        return false;
      }
    },
    handleAvatarSuccess: function(res, file) {
      this.imageUrl = this.upload_qiniu_addr + res.key;
    },
    handleError: function(res) {
      this.$message({
        message: "上传失败",
        duration: 2000,
        type: "warning"
      });
    }
  }
};

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang = "scss">
.upload-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
}
</style>
