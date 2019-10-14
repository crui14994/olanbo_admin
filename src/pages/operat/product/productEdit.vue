<template>
  <div class="product-edit">
    <div class="edit-left">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称：" prop="devName">
              <el-input class="edit-input" v-model="ruleForm.devName" placeholder="输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="简介信息:" prop="desc">
              <el-input
                type="textarea"
                class="edit-input"
                v-model="ruleForm.desc"
                placeholder="输入简介信息"
              ></el-input>
            </el-form-item>
            <el-form-item label="分类：" prop="sysTypeId">
              <el-select v-model="ruleForm.sysTypeId" placeholder="产品分类">
                <!-- <el-option class="edit-serach-option" label="全部" value="0"></el-option> -->
                <el-option
                  :label="item.typeName"
                  :value="item.id"
                  v-for="(item,index) in smartSysType"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面：" prop="logoPath">
              <el-input class="edit-input" v-model="ruleForm.logoPath" placeholder="文件路径"></el-input>
              <!-- //七牛文件上传 -->
              <qiniu-update
                :oldFileUrl="ruleForm.logoPath"
                @qiniuSucc="qiniuSucc"
                @fileChange="fileChange"
              >
                <el-button type="primary">上传图片</el-button>
                <span class="prompt">图片尺寸为：540x350</span>
              </qiniu-update>
            </el-form-item>

            <el-form-item label="推荐：" prop="homeShowImg">
              <el-input class="edit-input" v-model="ruleForm.homeShowImg" placeholder="文件路径"></el-input>
              <!-- //七牛文件上传 -->
              <qiniu-update
                :oldFileUrl="ruleForm.homeShowImg"
                @qiniuSucc="qiniuSucc2"
                @fileChange="fileChange"
              >
                <el-button type="primary">上传推荐显示图片</el-button>
              </qiniu-update>

                <p class="prompt">尺寸：380x380(第一排三个),960x600(第二排大图),480x300(第二排小图)</p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row :gutter="20">
              <el-col :span="24">
                <!-- 富文本编辑器 -->
                <el-form-item class="tinymce">
                  <tinymce-editor v-model="ruleForm.htmlContent" @onClick="onClick" ref="editor"></tinymce-editor>
                </el-form-item>
                <el-form-item class="edit-btns">
                  <el-button type @click="$router.push('/web/productList')">返回列表</el-button>
                  <el-button type="primary" @click="submitForm('ruleForm')">{{btnText}}</el-button>
                  <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
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
import TinymceEditor from "@/components/tinymce-editor";
import qiniuUpdate from "@/components/qiniuUpdate";


import { smartList, addSmart, updateSmart, getDevInfo } from "@/api/devs.js";
import { mapGetters } from "vuex";
export default {
  name: "productEdit",
  data() {
    return {
      //表单信息
      ruleForm: {
        devName: "",
        sysTypeId: "",
        logoPath: "",
        homeShowImg: "", //推荐的时候显示的图片，默认为logoPath的值
        desc: "",
        htmlContent: "", // 文章内容
        status: 0
      },
      rules: {
        devName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入简介信息", trigger: "blur" }],
        sysTypeId: [
          { required: true, message: "请选择分类", trigger: "change" }
        ],
        logoPath: [{ required: true, message: "请选择上传图片" }]
      },
      editorOption: {
        // 编辑器选项
        placeholder: "请输入内容"
      },
      //传递过来的数据
      infoType: this.$route.params.id,
      //复制用于验证是否修改
      cloneProduct: "",
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
    //设备类型
    smartSysType() {
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
    //七牛上传成功
    qiniuSucc(url) {
      this.ruleForm.logoPath = url;
    },
    qiniuSucc2(url) {
      this.ruleForm.homeShowImg = url;
    },
    //七牛状态改变，重新上传时触发
    fileChange(oldUrl) {
      this.key7 = oldUrl.split("/").pop() || null;
    },
    //编辑修改设备
    updateProduct() {
      let options = {
        userId: this.userId,
        id: this.infoType,
        key7: this.key7
      };
      //验证是否有修改过
      let str = JSON.stringify(this.ruleForm);
      if (this.cloneProduct != str) {
        //把修改过的参数添加到请求参数中
        for (var index in this.ruleForm) {
          if (this.ruleForm[index] !== JSON.parse(this.cloneProduct)[index]) {
            options[index] = this.ruleForm[index];
          }
        }
        //执行修改
        updateSmart(options).then(res => {
          let { code } = res.data;
          if (code == 200) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.$router.push("/web/productList");
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
        sysTypeId: this.ruleForm.sysTypeId,
        status: 0,
        devName: this.ruleForm.devName,
        desc: this.ruleForm.desc,
        htmlContent: this.ruleForm.htmlContent,
        linkUrl: " ",
        logoPath: this.ruleForm.logoPath,
        homeShowImg: this.ruleForm.homeShowImg,
        userId: this.userId
      };
      if (!this.ruleForm.htmlContent) {
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
          this.$router.push("/web/productList");
          this.resetForm("ruleForm");
        }
      });
    },
    
    //初始化表单数据
    initFrom() {
      if (this.isAdd) {
        //添加
        this.ruleForm = {
          devName: "",
          sysTypeId: "",
          logoPath: "",
          homeShowImg: "",
          desc: ""
        };
      } else {
        getDevInfo({ id: this.infoType }).then(res => {
          const { code, data } = res.data;
          if (code === 200) {
            this.ruleForm = {
              devName: data.devName,
              sysTypeId: data.sysTypeId,
              logoPath: data.logoPath,
              homeShowImg: data.homeShowImg,
              status: data.status,
              desc: data.desc,
              htmlContent: data.htmlContent
            };
            this.cloneProduct = JSON.stringify(this.ruleForm);
          }
        });
      }
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isAdd ? this.addProduct() : this.updateProduct();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //富文本鼠标单击的事件
    onClick(e, editor) {}
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
