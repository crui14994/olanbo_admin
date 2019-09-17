<template>
  <div class="updateInfo">
    <div class="updateInfo-box"></div>
    <div class="from-box">
      <div class="from-logo">
        <img src="../assets/logo@3x.png" alt />
      </div>
      <p class="from-title">在线商城后台管理中心</p>
      <div class="from-sub">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item prop="phone">
            <el-input
              prefix-icon="iconfont icon-shouji"
              v-model.number="ruleForm.phone"
              placeholder="请输入需验证的手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="validation">
            <el-input
              prefix-icon="iconfont icon-yunongtongqingshuruyanzhengma"
              autocomplete="off"
              placeholder="请输入验证码"
              v-model="ruleForm.validation"
            >
              <template slot="append">获取验证码</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              prefix-icon="iconfont icon-suo"
              type="password"
              v-model="ruleForm.pass"
              placeholder="新密码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              prefix-icon="iconfont icon-suo"
              type="password"
              v-model="ruleForm.checkPass"
              placeholder="确认密码"
              autocomplete="off"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <span class="updateInfo-btn" @click="submitForm('ruleForm')">确认修改</span>
          </el-form-item>
          <el-form-item>
            <router-link class="reg-btn" :to="{ path: '/login' }">返回登录页面</router-link>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <p class="updateInfo-footer">深圳欧朗博科技有限公司版权所有</p>
  </div>
</template>

<script>
export default {
  name: "updateInfo",
  components: {},
  computed: {},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        phone: "",
        validation: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        phone: {
          required: true,
          message: "输入错误，请重新输入11位手机号码",
          trigger: "blur"
        },
        validation: {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {
    // this.messageBox();
  },
  methods: {
    //成功弹窗修改
    messageBox() {
      let html = `
        <div class="suc-update">
          <i class="iconfont icon-chenggong"></i>
          <p class="suc-update-tit">密码修改成功!</p>
          <p>
            <a class="suc-update-btn" href="/login">返回登录页面</a>
          </p>
        </div>
      `;
      this.$alert(html, "", {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateInfo();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" >
.updateInfo {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(238, 238, 238, 1);
  .updateInfo-box {
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
      margin-top: 12%;
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
      padding: 50px 50px 10px 50px;
      input {
        padding-left: 50px;
        height: 50px;
      }
      .el-form-item {
        margin-bottom: 25px;
      }
      .el-input__icon {
        padding: 0 15px;
        color: #333333;
        line-height: 50px;
      }
      .icon-shouji {
        font-size: 20px;
      }
      .updateInfo-btn {
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
      }
      .el-form-item__content {
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
  .updateInfo-footer {
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
.suc-update {
  text-align: center;
  > i {
    font-size: 88px;
    color: rgba(60, 60, 80, 1);
    margin: 70px 0 60px 0;
    display: inline-block;
  }
  .suc-update-tit {
    font-size: 24px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  .suc-update-btn {
    display: inline-block;
    padding: 18px  30px;
    background: rgba(60, 60, 80, 1);
    box-shadow:0px 6px 7px 0px rgba(60,60,80,0.4);
    border-radius: 5px;
    font-size: 24px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin: 45px 0;
  }
}
</style>
