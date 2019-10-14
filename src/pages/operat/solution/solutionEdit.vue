<template>
  <div class="solution-edit">
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
            <el-form-item label="标题：" prop="title">
              <el-input class="edit-input" v-model="ruleForm.title" placeholder="输入标题"></el-input>
            </el-form-item>
            <el-form-item label="子标题：" prop="miniTitle">
              <el-input
                class="edit-input"
                autosize
                type="textarea"
                v-model="ruleForm.miniTitle"
                placeholder="输入子标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="分类：" prop="typeId">
              <el-select v-model="ruleForm.typeId" placeholder="产品分类">
                <el-option class="edit-serach-option" label="全部" value></el-option>
                <el-option
                  :label="item.typeName"
                  :value="item.id"
                  v-for="(item,index) in solutionType"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片：" prop="imgUrl">
              <el-input class="edit-input" v-model="ruleForm.imgUrl" placeholder="请上传图片"></el-input>
              <!-- //七牛文件上传 -->
              <qiniu-update
                :oldFileUrl="ruleForm.imgUrl"
                @qiniuSucc="qiniuSucc"
                @fileChange="fileChange"
              >
                <el-button type="primary">上传图片</el-button>
                <span class="prompt">图片尺寸为：835x350</span>
              </qiniu-update>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="20">
              <el-col :span="24">
                <!-- 富文本编辑器 -->
                <el-form-item class="tinymce">
                  <tinymce-editor v-model="ruleForm.content" ref="editor"></tinymce-editor>
                </el-form-item>
                <el-form-item class="edit-btns">
                  <el-button type @click="$router.push('/web/solutionList')">返回列表</el-button>
                  <el-button type="primary" @click="submitForm('ruleForm')">{{btnText}}</el-button>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="10">
                <div class="ql-editor html-box" v-html="ruleForm.content"></div>
              </el-col> -->
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import TinymceEditor from "@/components/tinymce-editor";
import { getToken, QINIU_PARAMS } from "@/api/qiniu.js";
import {
  solutionConfig,
  getSolutionType,
  addSolution,
  updateSolution,
  getItemInfo
} from "@/api/solution.js";
import qiniuUpdate from "@/components/qiniuUpdate";
import { mapGetters } from "vuex";

export default {
  name: "solutionEdit",
  data() {
    return {
      //表单信息
      ruleForm: {
        title: "",
        miniTitle: "",
        typeId: "",
        imgUrl: "",
        content: "", // 文章内容
        status: 0
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        miniTitle: [
          { required: true, message: "请输入子标题", trigger: "blur" }
        ],
        typeId: [{ required: true, message: "请选择分类", trigger: "change" }],
        imgUrl: [{ required: true, message: "请上传图片" }]
      },
      solutionType: [], //案列类型列表
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
      clonesolution: "",
      // 更新封面图片时，需要删除的原七牛资源的key
      key7: null
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
      this.ruleForm.imgUrl = url;
    },
    //七牛状态改变，重新上传时触发
    fileChange(oldUrl) {
      this.key7 = oldUrl.split("/").pop() || null;
    },
    //编辑解决方案
    updatesolution() {
      let options = {
        id: parseInt(this.infoType),
        key7: this.key7,
        userId: this.userId
      };
      //验证是否有修改过
      let str = JSON.stringify(this.ruleForm);
      if (this.clonesolution != str) {
        // 把修改过的参数添加到请求参数中
        for (var index in this.ruleForm) {
          if (this.ruleForm[index] !== JSON.parse(this.clonesolution)[index]) {
            options[index] = this.ruleForm[index];
          }
        }
        updateSolution(options).then(res => {
          let { code } = res.data;
          if (code == 200) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$router.push("/web/solutionList");
          }
        });
      } else {
        this.$message({
          message: "您没有修改任何内容，无法提交！",
          type: "warning"
        });
      }
    },
    //添加解决方案
    _addSolution() {
      let options = {
        title: this.ruleForm.title,
        miniTitle: this.ruleForm.miniTitle,
        typeId: this.ruleForm.typeId,
        imgUrl: this.ruleForm.imgUrl,
        content: this.ruleForm.content, // 文章内容
        userId: this.userId
      };
      if (!this.ruleForm.content) {
        this.$message({
          message: "您还没有填写设备详情！",
          type: "warning"
        });
        return false;
      }
      addSolution(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.$router.push("/web/solutionList");
          this.resetForm("ruleForm");
        }
      });
    },
    //初始化表单数据
    initFrom() {
      //获取解决方案类型
      getSolutionType().then(res => {
        let { code } = res.data;
        if (code === 200) {
          this.solutionType = res.data.data;
        } else if (code === 300) {
          this.solutionType = [];
        }
      });

      if (this.isAdd) {
        //添加
        this.ruleForm = {
          title: "",
          miniTitle: "",
          typeId: "",
          imgUrl: "",
          content: ""
        };
      } else {
        getItemInfo(this.infoType).then(res => {
          let { code } = res.data;
          if (code == 200) {
            let data = res.data.data;
            this.ruleForm = {
              title: data.title,
              miniTitle: data.miniTitle,
              typeId: data.typeId,
              imgUrl: data.imgUrl,
              content: data.content
            };
            this.clonesolution = JSON.stringify(this.ruleForm);
          }
        });
      }
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isAdd ? this._addSolution() : this.updatesolution();
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
.solution-edit {
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
