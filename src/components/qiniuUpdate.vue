<!-- 
    *** 上传成功后触发 qiniuSucc,回调参数fileUrl
    *** 文件状态改变时触发 fileChange,回调参数fileUrl
    *** oldFileUrl为重新上传图片时需要传入旧的文件url，格式需和配置的一致
    *** isImg默认值为true，表示上传的文件为jpg/png图片。如需上传其它格式文件设置为false
 -->
<template>
  <div class="qiniu">
    <el-upload
      :action="domain"
      :http-request="upqiniu"
      :show-file-list="false"
      :on-change="getKey"
      :before-upload="beforeUpload"
    >
      <slot></slot>
    </el-upload>
  </div>
</template>

<script>
import { getToken, QINIU_PARAMS } from "@/api/qiniu.js";

export default {
  props: {
    //传入需要删除的文件URL
    oldFileUrl: {
      type: String
    },
    //是否是上传图片
    isImg: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 七牛云的上传地址，根据自己所在地区选择
      domain: QINIU_PARAMS.domain,
      // 这是七牛云空间的外链默认域名
      qiniuaddr: QINIU_PARAMS.qiniuaddr,
      fileUrl: ""
    };
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    }
  },
  created() {},
  methods: {
    //getKey获取要删除图片的key
    getKey(file, fileList) {
      this.$emit("fileChange", this.oldFileUrl);
    },
    // 上传pc图片到七牛云
    upqiniu(req) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      let filetype = req.file.name.split(".").pop();
      // let filetype = "";
      // if (req.file.type === "image/png") {
      //   filetype = "png";
      // } else {
      //   filetype = "jpg";
      // }
      // 获取token需要的参数
      let paramsObj = {
        fileName:
          "olanbo_pc_" +
          Date.parse(new Date()) +
          Math.floor(Math.random() * 100) +
          "." +
          filetype,
        userId: this.userId,
        deleteKey: this.oldFileUrl.split("/").pop() || " "
      };
      //获取token
      getToken(paramsObj).then(res => {
        const formdata = new FormData();
        formdata.append("file", req.file);
        formdata.append("token", res.data.data.token);
        formdata.append("key", paramsObj.fileName);
        // 上传到七牛
        this.axios.post(this.domain, formdata, config).then(res => {
          this.fileUrl = "http://" + this.qiniuaddr + "/" + res.data.key;
          this.$emit("qiniuSucc", this.fileUrl);
        });
      });
    },
    // 验证文件合法性
    beforeUpload(file) {
      if (this.isImg) {
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        !isJPG && this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        !isLt2M && this.$message.error("上传头像图片大小不能超过 2MB!");
        return isJPG && isLt2M;
      }else{
        return true;
      }
    }
  }
};
</script>

<style  lang = "scss" scoped>
.qiniu {
  display: inline-block;
}
</style>
