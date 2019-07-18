<template>
  <div class="login">
    <div class="login-box"></div>
    <div class="from-box">
      <div class="from-logo">
        <img src="../assets/logo@3x.png" alt />
      </div>
      <p class="from-title">在线商城后台管理中心</p>
      <div class="from-sub">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="name">
            <el-input
              prefix-icon="iconfont icon-xingmingyonghumingnicheng"
              v-model.number="ruleForm.name"
              placeholder="请输入手机号或用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              prefix-icon="iconfont icon-suo"
              type="password"
              v-model="ruleForm.pass"
              placeholder="请输入密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item class="login-btn-box">
            <span class="forgot"><router-link :to="{ path: '/updateInfo' }">忘记密码 </router-link><i class="iconfont icon-iconfontquestion"></i></span>
            <span class="login-btn" @click="submitForm('ruleForm')">登录</span>
          </el-form-item>
          <el-form-item>
            <router-link class="reg-btn" :to="{ path: '/regist' }">注册</router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <p class="login-footer">成都欧朗博科技有限公司版权所有</p>
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
      //判断用户输入是用户名还是手机号来确定用哪一种方式来登录
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
          this.$router.push("/");
        } else{
         this.$message.error(res.data.desc);
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" >
.login {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(238, 238, 238, 1);
  .login-box {
    height: 55%;
    width: 100%;
    position: absolute;
    top: 0;
    background: url("../assets/banner@3x.png") no-repeat center top 0px;
  }
  .from-box {
    width: 520px;
    margin: 0 auto;
    position: relative;
    z-index: 10;
    .from-logo {
      text-align: center;
      margin-top: 20%;
    }
    .from-title {
      font-size: 36px;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      padding: 40px 0 30px;
    }
    .from-sub {
      background: rgba(255, 255, 255, 0.5);
      box-shadow: 0px 3px 8px 0px rgba(60, 80, 60, 0.35);
      border-radius: 10px;
      padding: 50px 50px 5px 50px;
      input {
        padding-left: 50px;
        height: 50px;
      }
      .el-form-item {
        margin-bottom: 30px;
      }
      .el-input__icon {
        padding: 0 15px;
        color: #333333;
        line-height: 50px;
      }
      .login-btn-box{
        position: relative;
        .forgot{
          position: absolute;
          top: -35px;
          right: 0;
          font-size: 12px;
          color: #3C3C50;
          >i{
            font-size: 14px;
            vertical-align: middle;
          }
        }
      }
      .login-btn {
        display: inline-block;
        width: 100%;
        height: 60px;
        background: rgba(60, 60, 80, 1);
        box-shadow: 0px 3px 8px 0px rgba(60, 80, 60, 0.35);
        border-radius: 10px;
        font-size: 21px;
        line-height: 60px;
        text-align: center;
        font-weight: 700;
        color: rgba(255, 255, 255, 1);
        cursor: pointer;
        margin-top: 10px;
      }
      .el-form-item__content{
        text-align: center;
      }
      .reg-btn {
        /* display: inline-block; */
        /* width: 100%; */
        /* text-align: center; */
        /* height: 40px; */
        /* background: rgba(60, 60, 80, 1);
        box-shadow:0px 3px 8px 0px rgba(60, 80, 60, 0.35); */
        /* border-radius: 10px; */
        font-size: 21px;
        line-height: 40px;
        text-align: center;
        font-weight: 400;
        color: #3c3c50;
      }
    }
  }
  .login-footer {
    position: absolute;
    bottom: 3%;
    font-size: 14px;
    font-weight: 400;
    color: rgba(60, 60, 80, 1);
    line-height: 20px;
    text-align: center;
    width: 100%;
  }
}
</style>
