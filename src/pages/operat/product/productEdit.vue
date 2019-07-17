<template>
  <div class="product-edit">
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="edit-left">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="70px"
            class="demo-ruleForm"
          >
            <el-form-item label="名称：" prop="name">
              <el-input class="edit-input" v-model="ruleForm.name" placeholder="输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="分类：" prop="region">
              <el-select v-model="ruleForm.region" placeholder="产品分类">
                <!-- <el-option class="edit-serach-option" label="全部" value="0"></el-option> -->
                <el-option :label="item.typeName" :value="item.id" v-for="(item,index) in smartSysType" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面：" prop="imgUrl">
              <el-input class="edit-input" v-model="ruleForm.imgUrl" placeholder="文件路径" ></el-input>
              <!-- <el-button type="primary">上传图片</el-button> -->
              <el-upload
                class="avatar-uploader"
                :action="domain"
                :http-request="upqiniu"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传图片</el-button>
              </el-upload>
            </el-form-item>
            <!-- 富文本编辑器 -->
            <el-form-item>
              <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
              ></quill-editor>
            </el-form-item>
            <el-form-item class="edit-btns">
              <el-button type @click="$router.push('/operat/productList')">返回列表</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">{{btnText}}</el-button>
              <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="ql-editor html-box" v-html="content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import { getToken, QINIU_PARAMS } from "@/api/qiniu.js";

import { smartList, addSmart, updateSmart } from "@/api/devs.js";
import {mapState} from 'vuex';

export default {
  name: "productEdit",
  data() {
    return {
      // 七牛云的上传地址，根据自己所在地区选择
      domain: QINIU_PARAMS.domain,
      // 这是七牛云空间的外链默认域名
      qiniuaddr: QINIU_PARAMS.qiniuaddr,
      //表单信息
      ruleForm: {
        name: "",
        region: "",
        imgUrl: ""
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        region: [{ required: true, message: "请选择分类", trigger: "change" }],
        imgUrl: [{ required: true, message: "请选择上传图片" }]
      },
      content: "", // 文章内容
      editorOption: {
        // 编辑器选项
        placeholder: "请输入内容"
      },
      //传递过来的id
      infoType: this.$route.params.id,
      //用于验证是否修改
      cloneProduct: ""
    };
  },
  components: {
    quillEditor
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    },
    //设备类型
    smartSysType(){
      return this.$store.state.user.smartSysType;
    },
    //是否是添加设备
    isAdd() {
      if (this.infoType != "add") {
        return false;
      } else {
        return true;
      }
    },
    //按钮文字
    btnText() {
      return this.isAdd ? "立即添加" : "立即修改";
    }
  },
  created() {
    this.initFrom();
  },
  mounted() {},
  methods: {
    //编辑修改设备
    updateProduct() {
      let options = {
        userId: this.userId,
        id: JSON.parse(this.infoType),
        devName: this.ruleForm.name,
        typeId: JSON.parse(this.ruleForm.region),
        desc: "无",
        status: 0,
        htmlContent: this.content,
        linkUrl: "无",
        logoPath: this.ruleForm.imgUrl
      };
      if(options.htmlContent==""){
        this.$message({
          message: "您还没有填写设备详情！",
          type: "warning"
        });
        return;
      }


      //验证是否有修改过
      let str = JSON.stringify(this.ruleForm) + JSON.stringify(this.content);
      if (this.cloneProduct != str) {
        //执行修改
        updateSmart(options).then(res => {
          let { code } = res.data;
          if (code == 200) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$router.push("/operat/productList");
          } else {
            this.$message.error("修改失败");
          }
        });
      } else {
        this.$message({
          message: "您没有修改任何内容，无法提交！",
          type: "warning"
        });
      }
    },
    //添加设备
    addProduct() {
      let options = {
        typeId: this.ruleForm.region,
        status: 0,
        devName: this.ruleForm.name,
        desc: "无",
        htmlContent: this.content,
        linkUrl: "",
        logoPath: this.ruleForm.imgUrl,
        userId: this.userId
      };
      if(options.htmlContent==""){
        this.$message({
          message: "您还没有填写设备详情！",
          type: "warning"
        });
        return;
      }
      addSmart(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.$router.push("/operat/productList");
          this.resetForm("ruleForm");
        } else {
          this.$message.error("添加失败");
        }
      });
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
        userId: this.userId,
        deleteKey: this.ruleForm.imgUrl.split("/").pop()
      };
      //获取token
      getToken(paramsObj).then(res => {
        const formdata = new FormData();
        formdata.append("file", req.file);
        formdata.append("token", res.data.data);
        formdata.append("key", paramsObj.fileName);
        // this.ruleForm.imgUrl = req.file.name;
        // 上传到七牛
        this.axios.post(this.domain, formdata, config).then(res => {
          this.ruleForm.imgUrl =
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
    //初始化表单数据
    initFrom() {
      if (this.isAdd) {
        //添加
        this.ruleForm = {
          name: "",
          region: "",
          imgUrl: ""
        };
      } else {
        //删除
        let options = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          typeId: this.typeId
        };
        smartList(options).then(res => {
          let { records } = res.data.data;
          records.forEach(item => {
            if (item.id == this.infoType) {
              this.ruleForm = {
                name: item.devName,
                region: item.typeId,
                imgUrl: item.logoPath
              };
              this.content = item.htmlContent;

              this.cloneProduct =
                JSON.stringify(this.ruleForm) + JSON.stringify(this.content);
            }
          });
        });
      }
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isAdd ? this.addProduct() : this.updateProduct();
        } else {
          // this.$message({
          //   message: "表单输入有误，重新输入！",
          //   type: "waring"
          // });

          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.content = "";
    },
    onEditorBlur(quill) {
      // console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      // console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      // console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      // console.log("editor change!", quill, html, text);
      this.content = html;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" >
.product-edit {
  /* padding: 0 40px; */
  .edit-left {
    margin-bottom: 150px;
    .ql-toolbar.ql-snow + .ql-container.ql-snow {
      min-height: 250px;
    }
    .edit-input {
      width: 60%;
    }
    .avatar-uploader {
      display: inline-block;
    }
    .edit-btns {
      text-align: right;
    }
  }
}
</style>
