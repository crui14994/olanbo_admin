<template>
  <div class="banner-dialog">
    <el-dialog :visible.sync="DialogVisible" width="30%" center :before-close="handleClose">
      <div>
        <!-- 图片预览 -->
        <div class="img-preview">
          <el-row>
            <el-col :span="12">
              <el-image :src="imageUrl.pc" fit="contain">
                <div slot="error" class="image-slot">pc端图片预览</div>
              </el-image>
            </el-col>
            <el-col :span="12">
              <el-image :src="imageUrl.mobile" fit="contain">
                <div slot="error" class="image-slot">移动端图片预览</div>
              </el-image>
            </el-col>
          </el-row>
        </div>
        <!-- 填写信息 -->
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="90px"
          class="demo-ruleForm"
        >
          <el-form-item label="标题:" prop="title">
            <el-input
              type="text"
              placeholder="输入banner名称"
              v-model="ruleForm.title"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址:" prop="address">
            <el-input
              type="text"
              placeholder="输入跳转地址"
              v-model="ruleForm.address"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <!-- 上传文件 -->
          <el-form-item label="文件:">
            <!-- pc -->
            <el-upload
              class="avatar-uploader"
              :action="domain"
              :http-request="upqiniu"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <span class="check-file">{{pcBtnText}}</span>
            </el-upload>
            <!-- mobile -->
            <el-upload
              class="avatar-uploader"
              :action="domain"
              :http-request="upqiniu02"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <span class="check-file">{{mobileBtnText}}</span>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken, QINIU_PARAMS } from "@/api/qiniu.js";
import { addBanner, updateBanner } from "@/api/banner.js";

export default {
  name: "bannerDialog",
  props: {
    DialogVisible: {
      type: Boolean,
      required: true
    },
    updata: {
      type: Object
    }
  },
  watch: {
    updata: function(val) {
      //克隆传入的数据
      this.cloneData = JSON.parse(JSON.stringify(val));
      if (val) {
        this.isAdd = false;
        this.imageUrl.pc = val.pcDataUrl;
        this.imageUrl.mobile = val.mobileDataUrl;
        this.ruleForm.title = val.bannerTitle;
        this.ruleForm.address = val.linkUrl;
      } else {
        this.isAdd = true;
      }
    },
    //当弹窗关闭时重置表单
    DialogVisible: function(val) {
      // this.resetForm("ruleForm");
    }
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    },
    //pc上传按钮文字
    pcBtnText() {
      if (this.imageUrl.pc == "") {
        return "上传pc文件";
      } else {
        return "重新上传pc文件";
      }
    },
    //mobile上传按钮文字
    mobileBtnText() {
      if (this.imageUrl.mobile == "") {
        return "上传mobile文件";
      } else {
        return "重新上传mobile文件";
      }
    }
  },
  data() {
    var validatetitle = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("标题不能为空！"));
      } else {
        callback();
      }
    };
    var validateaddress = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("地址不能为空！"));
      } else {
        callback();
      }
    };
    return {
      //表单信息
      ruleForm: {
        title: "",
        address: ""
      },
      //验证规则
      rules: {
        title: [{ validator: validatetitle, trigger: "blur" }],
        address: [{ validator: validateaddress, trigger: "blur" }]
      },
      //上传后图片地址
      imageUrl: {
        pc: "",
        mobile: ""
      },
      // 七牛云的上传地址，根据自己所在地区选择
      domain: QINIU_PARAMS.domain,
      // 这是七牛云空间的外链默认域名
      qiniuaddr: QINIU_PARAMS.qiniuaddr,
      //是否是添加banner
      isAdd: true,
      //深度拷贝传入的数据对象
      cloneData: null
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          let linkUrl = this.ruleForm.address;
          let pcDataUrl = this.imageUrl.pc;
          let mobileDataUrl = this.imageUrl.mobile;
          let bannerTitle = this.ruleForm.title;

          if (pcDataUrl == "" || mobileDataUrl == "") {
            this.$message({
              message: "图片未上传！",
              type: "warning"
            });
            return false;
          }
          //如果isAdd为true则为添加banner，否则为更新banner
          this.isAdd
            ? this.addInit(linkUrl, pcDataUrl, mobileDataUrl, bannerTitle)
            : this.updateInit(linkUrl, pcDataUrl, mobileDataUrl, bannerTitle);
        } else {
          return false;
        }
      });
    },
    //添加banner
    addInit(linkUrl, pcDataUrl, mobileDataUrl, bannerTitle) {
      addBanner(
        linkUrl,
        this.userId,
        pcDataUrl,
        mobileDataUrl,
        bannerTitle
      ).then(res => {
        if (res.data.code == 200) {
          this.handleClose();
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.$emit("succBanner");
        }
      });
    },
    //修改banner
    updateInit(linkUrl, pcDataUrl, mobileDataUrl, bannerTitle) {
      //optinos用户验证有没有更改，如果有更改则把更改的参数内容添加到options中
      let options = {};

      let id = this.updata.id;
      let keys = [];

      // *****
      keys.push(this.updata.mobileDataUrl.split("/").pop());
      keys.push(this.updata.pcDataUrl.split("/").pop());

      this.isUpdata(this.cloneData.linkUrl, linkUrl) &&
        (options.linkUrl = linkUrl || (options.keys = keys));
      this.isUpdata(this.cloneData.pcDataUrl, pcDataUrl) &&
        (options.pcDataUrl = pcDataUrl || (options.keys = keys));
      this.isUpdata(this.cloneData.mobileDataUrl, mobileDataUrl) &&
        (options.mobileDataUrl = mobileDataUrl);
      this.isUpdata(this.cloneData.bannerTitle, bannerTitle) &&
        (options.bannerTitle = bannerTitle);

      options.userId = this.userId;
      options.id = id;

      //获取对象中的个数，判断是否有修改内容
      let i = Object.getOwnPropertyNames(options).length;
      if (i === 2) {
        this.$message({
          message: "没有修改内容！",
          type: "warning"
        });
        return false;
      }
      //修改banner
      updateBanner(options).then(res => {
        if (res.data.code == 200) {
          this.handleClose();
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.$emit("succBanner");
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效
    handleClose() {
      this.$emit("dialogClose");
      this.resetForm("ruleForm");
      this.imageUrl.pc = "";
      this.imageUrl.mobile = "";
      this.ruleForm.title = "";
      this.ruleForm.address = "";
    },
    // 上传pc图片到七牛云
    upqiniu(req) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      let filetype = "";
      if (req.file.type === "image/png") {
        filetype = "png";
      } else {
        filetype = "jpg";
      }

      // 获取token需要的参数
      let paramsObj = {
        fileName:
          "olanbo_pc_" +
          Date.parse(new Date()) +
          Math.floor(Math.random() * 100) +
          "." +
          filetype,
        userId:this.userId,
        deleteKey: this.imageUrl.pc.split("/").pop()
      };
      //获取token
      getToken(paramsObj).then(res => {
        const formdata = new FormData();
        formdata.append("file", req.file);
        formdata.append("token", res.data.data);
        formdata.append("key", paramsObj.fileName);
        
        //上传到七牛
        this.axios.post(this.domain, formdata, config).then(res => {
          this.imageUrl.pc = "http://" + this.qiniuaddr + "/" + res.data.key;
        });
      });
    },
    // 上传pc图片到七牛云
    upqiniu02(req) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      let filetype = "";
      if (req.file.type === "image/png") {
        filetype = "png";
      } else {
        filetype = "jpg";
      }

      // 获取token需要的参数
      let paramsObj = {
        fileName:
          "olanbo_mobile_" +
          Date.parse(new Date()) +
          Math.floor(Math.random() * 100) +
          "." +
          filetype,
        userId: this.userId,
        deleteKey: this.imageUrl.mobile.split("/").pop()
      };
      //获取token
      getToken(paramsObj).then(res => {
        const formdata = new FormData();
        formdata.append("file", req.file);
        formdata.append("token", res.data.data);
        formdata.append("key", paramsObj.fileName);
        //上传到七牛
        this.axios.post(this.domain, formdata, config).then(res => {
          this.imageUrl.mobile =
            "http://" + this.qiniuaddr + "/" + res.data.key;
        });
      });
    },
    // 验证文件合法性
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //判断数据中的值是否更改
    isUpdata(d1, d2) {
      if (d1 == d2) {
        return false;
      }
      return true;
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
        .img-preview {
          margin-bottom: 30px;
          .el-row {
            > .el-col:first-child {
              padding-right: 15px;
            }
            > .el-col:last-child {
              padding-left: 15px;
            }
            .el-image {
              width: 100%;
              background: rgba(238, 238, 238, 0.5);
              border-radius: 5px;
              position: relative;
              height: 200px;
              /* min-height: 200px; */
              .image-slot {
                display: inline-block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #b6b6b6;
              }
            }
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
