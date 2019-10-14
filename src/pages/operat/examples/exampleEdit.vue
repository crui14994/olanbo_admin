<template>
  <div class="example-edit">
    <div class="edit-left">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称：" prop="title">
              <el-input class="edit-input" v-model="ruleForm.title" placeholder="输入案例名称"></el-input>
            </el-form-item>
            <el-form-item label="简介信息：" prop="desc">
              <el-input
                class="edit-input"
                autosize
                type="textarea"
                v-model="ruleForm.desc"
                placeholder="输入案例简介信息"
              ></el-input>
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
              <!-- //七牛文件上传 -->
              <qiniu-update
                :oldFileUrl="ruleForm.logoUrl"
                @qiniuSucc="qiniuSucc"
                @fileChange="fileChange"
              >
                <el-button type="primary">上传图片</el-button>
                <span class="prompt">图片尺寸为：750x750</span>
              </qiniu-update>
            </el-form-item>
            <el-form-item label="推荐:" prop="homeShowImg">
              <el-input class="edit-input" v-model="ruleForm.homeShowImg" placeholder="文件路径"></el-input>
              <!-- //七牛文件上传 -->
              <qiniu-update
                :oldFileUrl="ruleForm.homeShowImg"
                @qiniuSucc="qiniuSucc2"
                @fileChange="fileChange"
              >
                <el-button type="primary">上传推荐显示图片</el-button>
                <span class="prompt">图片尺寸为：1240x600</span>
               </qiniu-update>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="20">
              <el-col :span="24">
                <!-- 富文本编辑器 -->
                <el-form-item class="tinymce">
                  <tinymce-editor v-model="ruleForm.htmlContent" ref="editor"></tinymce-editor>
                </el-form-item>
                <el-form-item class="edit-btns">
                  <el-button type @click="$router.push('/web/exampleList')">返回列表</el-button>
                  <el-button type="primary" @click="submitForm('ruleForm')">{{btnText}}</el-button>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="10">
                <div class="ql-editor html-box" v-html="ruleForm.htmlContent"></div>
              </el-col> -->
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
// require styles
import TinymceEditor from "@/components/tinymce-editor";
import qiniuUpdate from "@/components/qiniuUpdate";

import { getListType, getItemInfo, update, addItem } from "@/api/examples.js";
import { mapGetters } from "vuex";

export default {
  name: "exampleEdit",
  data() {
    return {
      //表单信息
      ruleForm: {
        title: "",
        desc: "",
        typeId: "",
        logoUrl: "",
        homeShowImg: "",
        htmlContent: "", // 文章内容
        status: 0
      },
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入名称", trigger: "blur" }],
        typeId: [{ required: true, message: "请选择分类", trigger: "change" }],
        logoUrl: [{ required: true, message: "请选择上传图片" }]
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
    TinymceEditor,
    qiniuUpdate
  },
  computed: {
    //用户id
    ...mapGetters(["userId"]),
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
    //七牛上传成功
    qiniuSucc(url) {
      this.ruleForm.logoUrl = url;
    },
    qiniuSucc2(url) {
      this.ruleForm.homeShowImg = url;
    },
    //七牛状态改变，重新上传时触发
    fileChange(oldUrl) {
      this.key7 = oldUrl.split("/").pop() || null;
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
        homeShowImg: this.ruleForm.homeShowImg,
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
    //初始化表单数据
    initFrom() {
      if (this.isAdd) {
        //添加
        this.ruleForm = {
          title: "",
          typeId: "",
          logoUrl: "",
          homeShowImg: ""
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
              homeShowImg: data.homeShowImg,
              htmlContent: data.htmlContent,
              status: data.status,
              desc: data.desc
            };
            this.cloneexample = JSON.stringify(this.ruleForm);
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
      width: 40%;
    }
    .prompt{
      color: #999999;
      padding-left: 10px;
      font-size: 12px;
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
