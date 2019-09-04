<template>
  <div class="app-upgrade">
    <el-row>
      <span class="add-user" @click="centerDialogVisible = true">添加用户</span>
    </el-row>

    <!-- 表格数据 -->
    <el-row class="app-show">
      <span v-show="tableData.length<=0" class="prompt">您还没有任何用户，请点击按钮上传。</span>

      <el-table v-show="tableData.length>0" :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
        <el-table-column prop="dealers" label="经销商名字" width="180" align="center"></el-table-column>
        <el-table-column prop="version" label="版本号" align="center"></el-table-column>
        <el-table-column prop="date" label="更新时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              style="color:#FFD250"
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 添加用户弹窗 -->
    <el-row>
      <el-dialog
        class="add-dialog"
        title
        :visible.sync="centerDialogVisible"
        width="30%"
        @closed="resetForm('formLabelAlign')"
      >
        <el-form label-width="100px" :rules="rules" ref="formLabelAlign" :model="formLabelAlign">
          <el-form-item label="上传APK:" class="up-apk">
            <el-button class="up-btn" plain>上传APK</el-button>
            <i class="icon-suncc iconfont icon-gou1"></i>
          </el-form-item>
          <el-form-item label="设置版本号:" prop="version">
            <el-input v-model="formLabelAlign.version" placeholder="输入版本号"></el-input>
          </el-form-item>
          <el-form-item label="经销商:" prop="dealers">
            <el-input v-model="formLabelAlign.dealers" placeholder="输入经销商"></el-input>
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
export default {
  data() {
    return {
      tableData: [
        {
          id: "01",
          dealers: "王小虎",
          version: "2.0",
          date: "2016-05-04"
        },
        {
          id: "01",
          dealers: "王小虎2",
          version: "2.0",
          date: "2016-05-04"
        },
        {
          id: "01",
          dealers: "王小虎3",
          version: "2.0",
          date: "2016-05-04"
        }
      ],
      centerDialogVisible: false,
      formLabelAlign: {
        version: "",
        dealers: ""
      },
      rules: {
        version: [
          { required: true, message: "请输入版本号", trigger: "change" }
        ],
        dealers: [
          { required: true, message: "请输入经销商", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    }
  },
  created() {},
  methods: {
    //编辑用户
    handleEdit(index, row) {
      this.centerDialogVisible = true;
      this.formLabelAlign = {
        version: row.version,
        dealers: row.dealers
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.formLabelAlign = {
        version: "",
        dealers: ""
      };
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style  lang = "scss">
.app-upgrade {
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
  .app-show {
    text-align: center;
    .prompt {
      display: inline-block;
      margin-top: 20%;
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(182, 182, 182, 1);
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
