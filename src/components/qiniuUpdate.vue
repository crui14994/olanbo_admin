<!-- 
    *** 上传成功后触发 qiniuSucc,回调参数fileUrl ;
    *** 上传成功后触发 getFileSize , 回调参数文件大小
    *** 文件状态改变时触发 fileChange,回调参数fileUrl
    *** oldFileUrl为重新上传图片时需要传入旧的文件url，格式需和配置的一致
    *** fileType默认值为img，表示上传的文件为jpg/png图片。
             值为 zip/rar/tar 表示上传文件必须是这两种格式的压缩文件；
             值为 apk 表示上传文件必须apk文件； 
             other表示除图片/zip/rar/tar格式外的文件 
    *** preview为true表示以预览图代替按钮
 -->
<template>
  <div class="qiniu">
    <el-upload
      :class="{ 'avatar-uploader': preview}"
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
import { mapGetters } from "vuex";
export default {
  props: {
    //传入需要删除的文件URL
    oldFileUrl: {
      type: String
    },
    //上传文件类型
    fileType: {
      type: String,
      default: "img"
    },
    // 以预览图代替按钮
    preview: {
      type: Boolean,
      default: false
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
    ...mapGetters(["userId"])
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
          this.$emit("getFileSize", req.file.size);
        });
      });
    },
    // 验证文件合法性
    beforeUpload(file) {
      let fileName = file.name;
      let fileType = fileName.split(".").pop();

      if (this.fileType === "img") {
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
        const isLt2M = file.size / 1024 / 1024 < 2;
        !isJPG && this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        !isLt2M && this.$message.error("上传头像图片大小不能超过 2MB!");
        return isJPG && isLt2M;
      } else if (this.fileType === "zip/rar/tar") {
        const compressedFiles = fileType === "zip" || fileType === "rar" || fileType === "tar";
        !compressedFiles && this.$message.error("上传文件只能是 zip/rar/tar 格式!");
        return compressedFiles;
      } else if (this.fileType === "apk") {
        const compressedFiles = fileType === "apk";
        !compressedFiles && this.$message.error("上传文件只能是apk格式!");
        return compressedFiles;
      } else {
        return true;
      }
    }
  }
};
</script>

<style  lang = "scss">
.qiniu {
  display: inline-block;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
