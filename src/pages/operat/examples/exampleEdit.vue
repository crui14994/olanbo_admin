<template>
  <div class="example-edit">
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="edit-left">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="名称：" prop="title">
              <el-input class="edit-input" v-model="ruleForm.title" placeholder="输入案例名称"></el-input>
            </el-form-item>
             <el-form-item label="简介信息：" prop="desc">
              <el-input class="edit-input" autosize type="textarea" v-model="ruleForm.desc" placeholder="输入案例简介信息"></el-input>
            </el-form-item>
            <el-form-item label="分类：" prop="typeId">
              <el-select v-model="ruleForm.typeId" placeholder="案例分类">
                <!-- <el-option class="edit-serach-option" label="全部" value="0"></el-option> -->
                <el-option
                  :label="item.typeName"
                  :value="item.id"
                  v-for="(item,index) in ListType"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面：" prop="logoUrl">
              <el-input class="edit-input" v-model="ruleForm.logoUrl" placeholder="文件路径"></el-input>
              <!-- <el-button type="primary">上传图片</el-button> -->
              <el-upload
                class="avatar-uploader"
                :action="domain"
                :http-request="upqiniu"
                :show-file-list="false"
                :on-change="getKey7"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传图片</el-button>
              </el-upload>
            </el-form-item>
             <el-form-item label="推荐:" prop="homeShowImg">
              <el-input class="edit-input" v-model="ruleForm.homeShowImg" placeholder="文件路径"></el-input>
              <!-- <el-button type="primary">上传图片</el-button> -->
              <el-upload
                class="avatar-uploader"
                :action="domain"
                :http-request="upqiniu2"
                :show-file-list="false"
                :on-change="getKey7_02"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传推荐显示图片</el-button>
              </el-upload>
            </el-form-item>
            <!-- 富文本编辑器 -->
            <el-form-item>
              <quill-editor
                v-model="ruleForm.htmlContent"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
              ></quill-editor>
            </el-form-item>
            <el-form-item class="edit-btns">
              <el-button type @click="$router.push('/web/exampleList')">返回列表</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">{{btnText}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="ql-editor html-box" v-html="ruleForm.htmlContent"></div>
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

import { getListType, getItemInfo, update, addItem } from "@/api/examples.js";
// import {mapState} from 'vuex';

export default {
  name: "exampleEdit",
  data() {
    return {
      // 七牛云的上传地址，根据自己所在地区选择
      domain: QINIU_PARAMS.domain,
      // 这是七牛云空间的外链默认域名
      qiniuaddr: QINIU_PARAMS.qiniuaddr,
      //表单信息
      ruleForm: {
        title: "",
        desc:"",
        typeId: "",
        logoUrl: "",
        homeShowImg:"",
        htmlContent:"", // 文章内容
        status: 0
      },
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入名称", trigger: "blur" }],
        typeId: [{ required: true, message: "请选择分类", trigger: "change" }],
        logoUrl: [{ required: true, message: "请选择上传图片" }],
      },
      ListType: [], //案列类型列表
      editorOption: {
        // 编辑器选项
        placeholder: "请输入内容",
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["clean"],
          ["link", "image", "video"]
        ]
      },
      //传递过来的id
      infoType: this.$route.params.id,
      //用于验证是否修改
      cloneexample: "",
      // 更新封面图片时，需要删除的原七牛资源的key
      key7: " "
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
    //是否是添加案例
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
    //getKey7
    getKey7(file, fileList) {
      let oldFileUrl = this.ruleForm.logoUrl;
      this.key7 = oldFileUrl.split("/").pop() || " ";
    },
    //getKey7
    getKey7_02(file, fileList) {
      let oldFileUrl = this.ruleForm.homeShowImg;
      this.key7 = oldFileUrl.split("/").pop() || " ";
    },
    //编辑修改设备
    updateexample() {
      let options = {
        id: parseInt(this.infoType),
        key7: this.key7,
        userId: this.userId
      };
      //验证是否有修改过
      let str = JSON.stringify(this.ruleForm);
      if (this.cloneexample != str) {
        //把修改过的参数添加到请求参数中
        for (var index in this.ruleForm) {
          if (this.ruleForm[index] !== JSON.parse(this.cloneexample)[index]) {
            options[index] = this.ruleForm[index];
          }
        }
        update(options).then(res => {
          let { code } = res.data;
          if (code == 200) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$router.push("/web/exampleList");
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
    addexample() {
      let options = {
        title: this.ruleForm.title,
        typeId: this.ruleForm.typeId,
        logoUrl: this.ruleForm.logoUrl,
        homeShowImg:this.ruleForm.homeShowImg,
        desc: this.ruleForm.desc,
        htmlContent: this.ruleForm.htmlContent,
        status: 0,
        userId: this.userId
      };
      if (!this.ruleForm.htmlContent) {
        this.$message({
          message: "您还没有填写设备详情！",
          type: "warning"
        });
        return false;
      }

      addItem(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.$router.push("/web/exampleList");
          this.resetForm("ruleForm");
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
        deleteKey: this.ruleForm.logoUrl.split("/").pop()
      };
      //获取token
      getToken(paramsObj).then(res => {
        const formdata = new FormData();
        formdata.append("file", req.file);
        formdata.append("token", res.data.data.token);
        formdata.append("key", paramsObj.fileName);
        // this.ruleForm.logoUrl = req.file.name;
        // 上传到七牛
        this.axios.post(this.domain, formdata, config).then(res => {
          this.ruleForm.logoUrl =
            "http://" + this.qiniuaddr + "/" + res.data.key;
        });
      });
    },
    // 上传pc图片到七牛云
    upqiniu2(req) {
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
        deleteKey: this.ruleForm.homeShowImg.split("/").pop()
      };
      //获取token
      getToken(paramsObj).then(res => {
        const formdata = new FormData();
        formdata.append("file", req.file);
        formdata.append("token", res.data.data.token);
        formdata.append("key", paramsObj.fileName);
        // this.ruleForm.imgUrl = req.file.name;
        // 上传到七牛
        this.axios.post(this.domain, formdata, config).then(res => {
          this.ruleForm.homeShowImg =
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
          title: "",
          typeId: "",
          logoUrl: "",
          homeShowImg:"",
        };
      } else {
        getItemInfo(this.infoType).then(res => {
          let { code } = res.data;
          if (code == 200) {
            let data = res.data.data;
            this.ruleForm = {
              title: data.title,
              typeId: data.typeId,
              logoUrl: data.logoUrl,
              homeShowImg:data.homeShowImg,
              htmlContent:data.htmlContent,
              status: data.status,
              desc:data.desc
            };
            this.cloneexample =
              JSON.stringify(this.ruleForm);
          }
        });
      }

      getListType().then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.ListType = res.data.data;
        }
      });
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isAdd ? this.addexample() : this.updateexample();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
      this.ruleForm.htmlContent = html;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" >
.example-edit {
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
