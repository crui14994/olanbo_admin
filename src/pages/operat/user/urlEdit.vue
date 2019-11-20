<template>
  <div class="agent-edit">
    <div class="agent-form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        label-position="top"
        class="demo-ruleForm"
      >
        <el-form-item label="用户使用协议跳转地址" prop="layerUrl">
          <el-input v-model="ruleForm.layerUrl"></el-input>
        </el-form-item>
        <el-form-item label="App使用简介跳转地址" prop="funcUrl">
          <el-input v-model="ruleForm.funcUrl"></el-input>
        </el-form-item>
        <el-form-item label="关于我们跳转地址" prop="aboutUsUrl">
          <el-input v-model="ruleForm.aboutUsUrl"></el-input>
        </el-form-item>

        <el-form-item style="text-align:right;">
          <el-button type="primary" @click="submitForm('ruleForm')">{{buttonText}}</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
          <el-button @click="returnPre()">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";

import {
  getItemInfo,
  addUrl,
  updateItemInfo,
  getappUrlList
} from "@/api/agent";

export default {
  name: "agent-edit",
  components: {},
  computed: {
    ...mapGetters(["userId"]),
    //按钮文字
    buttonText() {
      if (this.isAdd) {
        return "立即添加";
      } else {
        return "立即修改";
      }
    }
  },
  data() {
    return {
      //数据id
      dataId: null,
      //是否是添加
      isAdd: true,
      //传入的数据id
      agentUserId: this.$route.query.id,
      //用于验证是否修改
      cloneGrade: "",
      ruleForm: {
        layerUrl: "",
        funcUrl: "",
        aboutUsUrl: ""
      },
      rules: {
        layerUrl: [
          {
            required: true,
            message: "请输入用户使用协议跳转地址",
            trigger: "blur"
          },
          {
            pattern: /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/,
            message: "请输入以http|https开头的地址！",
            trigger: "blur"
          }
        ],
        funcUrl: [
          {
            required: true,
            message: "请输入App使用简介跳转地址",
            trigger: "blur"
          },
          {
            pattern: /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/,
            message: "请输入以http|https开头的地址！",
            trigger: "blur"
          }
        ],
        aboutUsUrl: [
          {
            required: true,
            message: "请输入关于我们跳转地址",
            trigger: "blur"
          },
          {
            pattern: /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/,
            message: "请输入以http|https开头的地址！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    //根据是否是添加页面初始化页面
    init() {
      this._getappUrlList();
    },
    //获取列表数据
    _getappUrlList() {
      let options = {
        agentUserId: this.agentUserId,
        userId: this.userId
      };
      getappUrlList(options).then(res => {
        const { code, data } = res.data;
        //如果没有数据就添加，有数据就更新
        if (code === 300) {
          this.isAdd = true;
        } else if (code === 200) {
          this.isAdd = false;

          this.ruleForm.layerUrl = data[0].layerUrl;
          this.ruleForm.funcUrl = data[0].funcUrl;
          this.ruleForm.aboutUsUrl = data[0].aboutUsUrl;

          this.dataId = data[0].id;

          //深度克隆数据
          this.cloneGrade = JSON.stringify(this.ruleForm);
        }
      });
    },
    //添加跳转地址
    _addUrl() {
      let options = {
        agentUserId: this.agentUserId,
        userId: this.userId,
        layerUrl: this.ruleForm.layerUrl,
        funcUrl: this.ruleForm.funcUrl,
        aboutUsUrl: this.ruleForm.aboutUsUrl
      };
      addUrl(options).then(res => {
        const { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });

          // this.$router.push({ path: "/user/agent" });
          //更新表单数据
          this._getappUrlList();
        }
      });
    },

    //更新信息
    _updateItemInfo() {
      let options = {
        id: this.dataId, //数据id
        userId: this.userId,
        // agentUserId: this.agentUserId,
        layerUrl: this.ruleForm.layerUrl,
        funcUrl: this.ruleForm.funcUrl,
        aboutUsUrl: this.ruleForm.aboutUsUrl
      };

      let str = JSON.stringify(this.ruleForm);
      if (str === this.cloneGrade) {
        this.$message({
          message: "您没有修改任何内容，无法提交！",
          type: "warning"
        });
      } else {
        updateItemInfo(options).then(res => {
          const { code } = res.data;
          if (code == 200) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            // this.$router.push({ path: "/user/agent" });
            //更新表单数据
            this._getappUrlList();
          }
        });
      }
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isAdd ? this._addUrl() : this._updateItemInfo();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //返回上一页
    returnPre() {
      this.$router.push({ path: "/user/agent" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" scoped>
.agent-edit {
  .agent-form {
    width: 80%;
  }
}
</style>
