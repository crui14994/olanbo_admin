<template>
  <div class="regist">
    <div class="regist-box"></div>
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
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              prefix-icon="iconfont icon-shouji"
              v-model.number="ruleForm.phone"
              placeholder="请输入11位手机号码"
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
          <el-form-item prop="validation">
            <el-input
              prefix-icon="iconfont icon-yunongtongqingshuruyanzhengma"
              autocomplete="off"
              placeholder="请输入验证码"
              v-model="ruleForm.validation"
              @keyup.enter.native="submitForm('ruleForm')"
            >
              <template slot="append">获取验证码</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <span class="regist-btn" @click="submitForm('ruleForm')">立即注册</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <p class="regist-footer">深圳欧朗博科技有限公司版权所有</p>
  </div>
</template>

<script>
import { userRegist } from "@/api/user.js";

export default {
  name: "regist",
  components: {},
  computed: {},
  data() {
    var checkPhone = (rule, value, callback) => {
      let isPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(
        value
      );
      if (value === "") {
        callback(new Error("请输入手机号！"));
      } else if (!isPhone) {
        callback(new Error("请输入11位手机号！"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: "",
        name: "",
        phone: "",
        validation: ""
      },
      rules: {
        pass: { required: true, message: "请输入密码", trigger: "blur" },
        phone: { validator: checkPhone, trigger: "blur" },
        validation: {
          required: true,
          message: "请输入验证码",
          trigger: "blur"
        },
        name: { required: true, message: "请输入用户名", trigger: "blur" }
      }
    };
  },
  created() {
    // this.messageBox();
  },
  methods: {
    //注册成功弹窗
    messageBox() {
      let html = `
        <div class="suc-update">
          <i class="iconfont icon-chenggong"></i>
          <p class="suc-update-tit">注册成功!</p>
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
          //执行注册
          let smsCode = this.ruleForm.validation,
            userName = this.ruleForm.name,
            nickName = "",
            mobile = this.ruleForm.phone,
            passWord = this.ruleForm.pass;

          userRegist(smsCode, userName, nickName, mobile, passWord).then(
            res => {
              let { code } = res.data;
              if (code == 200) {
                // this.$message({
                //   message: "注册成功！",
                //   type: "success"
                // });
                this.messageBox();
              }else {
                this.$message.error(res.data.desc);
              }
            }
          );
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
.regist {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(238, 238, 238, 1);
  .regist-box {
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
      margin-top: 14%;
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
      padding: 50px 50px 30px 50px;
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
      .regist-btn {
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
    }
  }
  .regist-footer {
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
    padding: 18px 30px;
    background: rgba(60, 60, 80, 1);
    box-shadow: 0px 6px 7px 0px rgba(60, 60, 80, 0.4);
    border-radius: 5px;
    font-size: 24px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin: 45px 0;
  }
}
</style>
