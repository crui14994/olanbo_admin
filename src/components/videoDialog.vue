<template>
  <div class="banner-dialog">
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="video-preview">
        <div v-if="form.videoUrl==''" class="video-txt">视频预览</div>
        <div v-if="form.videoUrl!=''">
          <video class="video-item" width="100%" :src="form.videoUrl" controls></video>
        </div>
      </div>
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <!-- <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
          <el-input v-model="form.title" autocomplete="off" placeholder="输入视频名称"></el-input>
        </el-form-item>-->
        <el-form-item label="地址" :label-width="formLabelWidth" prop="videoUrl">
          <el-input v-model="form.videoUrl" autocomplete="off" disabled placeholder="上传视频后自动显示跳转地址"></el-input>
        </el-form-item>
        <el-form-item label="文件" :label-width="formLabelWidth" prop="videoUrl">
          <!-- 视频上传 -->
          <el-upload
            class="avatar-uploader"
            :action="domain"
            v-model="form.videoUrl"
            :http-request="upqiniu"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <span class="check-file">{{videoBtnTexe}}</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken,uploadQiniu, QINIU_PARAMS } from "@/api/qiniu.js";
import { addHomeVideo, getHomeVideo, updateHomeVideo } from "@/api/video.js";

export default {
  name: "videoDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    updata: {
      type: Object,
      required: true
    },
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    dialogVisible: function(val) {
      if (!val) {
        this.form.address = "";
        this.form.videoUrl = "";
      } else {
        this.form.address = this.updata.url ? this.updata.url : "";
        this.form.videoUrl = this.updata.url ? this.updata.url : "";
      }
    }
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    },
    //重新上传或者更新需要获取上一个七牛资源的key
    deleteKey() {
      if (this.form.videoUrl == "") {
        if (this.updata.url) {
          return this.updata.url.split("_").pop();
        } else {
          return "";
        }
      } else {
        return this.form.videoUrl.split("_").pop();
      }
    },
    //视频上传按钮文字
    videoBtnTexe(){
      if(this.form.videoUrl==""){
        return "选择文件"
      }else{
        return "重新上传视频"
      }
    }
  },
  data() {
    return {
      form: {
        // title: "",
        address: "",
        videoUrl: ""
      },
      //复制传入的数据用于判断是否有修改
      cloneVideoFrom: "",
      rules: {
        // title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        address: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        videoUrl: [{ required: true, message: "请上传视频", trigger: "blur" }]
      },
      formLabelWidth: "50px",
      // 七牛云的上传地址，根据自己所在地区选择
      domain: QINIU_PARAMS.domain,
      // 这是七牛云空间的外链默认域名
      qiniuaddr: QINIU_PARAMS.qiniuaddr
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //isAdd为true时为上传，否则为更新
          this.isAdd ? this.upLoadVideo() : this.updateVideo();
        } else {
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 上传pc图片到七牛云
    upqiniu(req) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      let filetype = "";

      if (req.file.type === "video/mp4") {
        filetype = "mp4";
      } else {
        filetype = "3gp";
      }

      // 获取token需要的参数
      let paramsObj = {
        fileName:
          "olanbo_video_" +
          Date.parse(new Date()) +
          Math.floor(Math.random() * 100) +
          "." +
          filetype,
        userId: this.userId,
        deleteKey: "olanbo_video_" + this.deleteKey
      };
      //获取token
      getToken(paramsObj).then(res => {
        const formdata = new FormData();
        formdata.append("file", req.file);
        formdata.append("token", res.data.data.token);
        formdata.append("key", paramsObj.fileName);

        
        // 上传到七牛
        uploadQiniu(this.domain, formdata, config).then(res => {
          this.form.videoUrl = "http://" + this.qiniuaddr + "/" + res.data.key;
        });
      });
    },
    // 验证文件合法性
    beforeUpload(file) {
      const isJPG = file.type === "video/mp4" || file.type === "video/3gp";
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 mp4/3gp 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //关闭弹窗后药品执行的操作
    dialogClose() {},
    //仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效
    handleClose() {
      this.$emit("dialogClose");
      this.resetForm("ruleForm");
    },

    //上传视频
    upLoadVideo() {
      addHomeVideo(this.userId, this.form.videoUrl).then(res => {
        if (res.data.code == 200) {
          this.handleClose();
        } else if (res.data.code == 404) {
          this.$message({
            message: res.data.desc,
            type: "warning"
          });
        } else {
          this.handleClose();
        }
      });
    },
    //修改视频
    updateVideo() {
      let id = this.updata.id;
      let url = this.form.videoUrl;
      let key = this.updata.url.split("/").pop();
      if (this.updata.url == this.form.videoUrl) {
        this.$message({
          message: "没有修改任何内容！",
          type: "warning"
        });
        return false;
      }
      updateHomeVideo(this.userId, id, url, key).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.handleClose();
          this.$emit("succUpdate");
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss">
.banner-dialog {
  .el-dialog__wrapper {
    .el-dialog {
      width: 700px !important;
      position: relative;
      left: 7%;
      top: 7%;
      .el-dialog__body {
        padding: 25px 85px 0 85px;
        .video-preview {
          width: 100%;
          min-height: 200px;
          margin-bottom: 40px;
          background: rgba(238, 238, 238, 1);
          border-radius: 5px;
          position: relative;
          .video-txt {
            display: inline-block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #b6b6b6;
          }
        }
        .el-form {
          .el-form-item__label {
            text-align: left;
          }
          .avatar-uploader {
            display: inline-block;
            .check-file {
              display: inline-block;
              padding: 3px 10px;
              margin-right: 5px;
              font-size: 12px;
              line-height: 30px;
              background: rgba(238, 238, 238, 1);
              border-radius: 5px;
            }
            .check-file:hover {
              color: #7670d9;
            }
          }
        }
      }
      .el-dialog__footer {
        text-align: right;
        padding: 10px 70px 20px;
      }
    }
  }
}
</style>
