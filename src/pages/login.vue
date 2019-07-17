<template>
  <div class="login">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model.number="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  components: {},
  computed: {},
  data() {
    return {
      ruleForm: {
        pass: "",
        name: ""
      },
      rules: {
        pass: { required: true, message: "请输入密码", trigger: "blur" },
        name: { required: true, message: "请输入用户名", trigger: "blur" }
      }
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //判断用户名是否是手机号
    checkMobile(s) {
      var length = s.length;
      var isPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(
        s
      );
      if (isPhone) {
        return true;
      } else {
        return false;
      }
    },
    //登陆
    login() {
      let userInfo;

      if (this.checkMobile(this.ruleForm.name)) {
        userInfo = {
          mobile: this.ruleForm.name,
          passWord: this.ruleForm.pass
        };
      } else {
        userInfo = {
          userName: this.ruleForm.name,
          passWord: this.ruleForm.pass
        };
      }
      this.$store.dispatch("login", userInfo).then(res => {
        let { code } = res;
        if (code == 200) {
          this.$message({
            message: "登录成功！",
            type: "success"
          });
        } else if (code == 404) {
          this.$message({
            message: "当前账号不存在",
            type: "waring"
          });
        }
        else if(code==999){
          this.$message({
            message: "服务端异常,请稍后再试！",
            type: "waring"
          });
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" scoped>
</style>
