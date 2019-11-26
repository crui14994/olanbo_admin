<template>
  <div class="agent">
    <el-row>
      <span class="add-user" @click="centerDialogVisible = true">添加代理商</span>
    </el-row>

    <!-- 表格数据 -->
    <el-row class="agent-show">
      <span v-show="tableData.length<=0" class="prompt">暂无代理商信息！</span>

      <el-table v-show="tableData.length>0" :data="tableData" border style="width: 100%">
        <el-table-column prop="id" sortable label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="userName" label="账号" align="center"></el-table-column>
        <el-table-column prop="nickName" label="昵称" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.nickName | nullData}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.mobile | nullData}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.email | nullData}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="timeStamp" label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.timeStamp | timeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <el-select value placeholder="设置">
              <el-option label="APP信息管理" value="APP信息管理">
                <span @click="goToUrlEdit(scope.row.userId)">APP信息管理</span>
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <!-- //分页组件 -->
      <div v-show="!isEmpty" class="pagination">
        <pagination :total="total" :pageSize="pageSize" @getChange="currentChange"></pagination>
      </div>
    </el-row>

    <!-- 添加用户弹窗 -->
    <el-row>
      <el-dialog
        class="add-dialog"
        title
        :visible.sync="centerDialogVisible"
        :close-on-click-modal="false"
        width="30%"
        center
        @closed="resetForm('formLabelAlign')"
      >
        <el-form label-width="100px" :rules="rules" ref="formLabelAlign" :model="formLabelAlign">
          <el-form-item label="代理商名称:" prop="nickName">
            <el-input v-model="formLabelAlign.nickName" placeholder="输入代理商名称"></el-input>
          </el-form-item>

          <el-form-item label="手机号码:" prop="mobile">
            <el-input v-model="formLabelAlign.mobile" placeholder="输入手机号码"></el-input>
          </el-form-item>

          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="formLabelAlign.email" placeholder="输入邮箱"></el-input>
          </el-form-item>

          <el-form-item label="登录密码：" prop="passWord">
            <el-input
              type="passWord"
              v-model="formLabelAlign.passWord"
              autocomplete="off"
              placeholder="输入登录密码"
            ></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              v-model="formLabelAlign.checkPass"
              autocomplete="off"
              placeholder="确认密码"
            ></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button class="cancel-btn" @click="centerDialogVisible = false">取 消</el-button>
          <el-button class="ok-btn" @click="submitForm('formLabelAlign')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
  </div>
</template>


<script>
import pagination from "@/components/pagination";
import { mapGetters } from "vuex";

import { agentConfig, getList, agentRegist } from "@/api/agent";
import { userType } from "@/api/user";

export default {
  name: "agent",
  components: {
    pagination
  },
  computed: {
    ...mapGetters(["userId"]),
    //判断是否有数据
    isEmpty() {
      return this.tableData.length === 0 ? true : false;
    }
  },
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号!"));
      } else {
        //验证版本号格式
        let isMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
          value
        );
        if (!isMobile) {
          callback(new Error("手机号格式错误！"));
        }
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱!"));
      } else {
        //验证版本号格式
        let reg = new RegExp(
          "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
        );
        let isEmail = reg.test(value);
        if (!isEmail) {
          callback(new Error("邮箱格式错误！"));
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formLabelAlign.checkPass !== "") {
          this.$refs.formLabelAlign.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.formLabelAlign.passWord) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      pageNum: agentConfig.PAGENUM,
      pageSize: agentConfig.PAGESIZE,
      //表格展示数据
      tableData: [],
      //数据条数
      total: 0,
      //弹窗的显示隐藏
      centerDialogVisible: false,
      //表单数据
      formLabelAlign: {
        nickName: "",
        mobile: "",
        email: "",
        passWord: "",
        checkPass: ""
      },
      rules: {
        nickName: [
          { required: true, message: "请输入代理商名称！", trigger: "blur" }
        ],
        mobile: [
          { required: true, validator: validateMobile, trigger: "blur" }
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        passWord: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this._getList();
  },
  methods: {
    //添加代理商
    _agentRegist() {
      let options = {
        userType: userType.AGENT.type,
        mobile: this.formLabelAlign.mobile,
        nickName: this.formLabelAlign.nickName,
        email: this.formLabelAlign.email,
        passWord: this.formLabelAlign.passWord
      };
      agentRegist(options).then(res => {
        const { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.centerDialogVisible = false;
          //更新数据
          this._getList();
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._agentRegist();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //分页状态改变时重新请求数据
    currentChange(index) {
      this.pageNum = index;
      this._getList();
    },
    //跳转到APP跳转地址管理,isAdd为1代表是添加，0代表更新
    goToUrlEdit(id) {
      this.$router.push({ path: "/user/urlEdit", query: { id } });
    },
    //获取列表
    _getList() {
      let options = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userType: userType.AGENT.type
      };
      getList(options).then(res => {
        if (res.data.code === 200) {
          const { records, total } = res.data.data;
          this.tableData = records;
          this.total = total;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" >
.agent {
  .add-user {
    cursor: pointer;
    display: inline-block;
    width: 160px;
    font-size: 20px;
    color: aliceblue;
    font-weight: bold;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: rgba(255, 210, 80, 1);
    border-radius: 10px;
    box-shadow: 0px 6px 7px 0px rgba(255, 210, 80, 0.4);
    border-radius: 10px;
    margin: 15px 0 45px 0;
  }
  .agent-show {
    text-align: center;
    .prompt {
      display: inline-block;
      margin-top: 20%;
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(182, 182, 182, 1);
    }
    .pagination {
      text-align: right;
      margin: 50px 0;
    }
  }
  .add-dialog {
    .el-dialog {
      padding: 2% 1% 1% 1%;
      position: relative;
      top: 14%;
      left: 7%;
      width: 40% !important;
      .el-dialog__body {
        padding: 0 20%;
      }
    }
    .dialog-footer {
      .cancel-btn {
        border: none;
        background: rgba(238, 238, 238, 1);
        box-shadow: 0px 6px 7px 0px rgba(202, 202, 204, 0.2);
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: rgba(181, 181, 181, 1);
      }
      .ok-btn {
        border: none;
        background: rgba(255, 210, 80, 1);
        font-size: 16px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 7px 0px rgba(255, 210, 80, 0.4);
      }
    }
    .up-apk {
      .up-btn:hover {
        border: solid 1px #ffd250;
        color: #ffd250;
      }
      .icon-suncc {
        margin-left: 15px;
        color: #ffd250;
      }
    }
  }
}
</style>
