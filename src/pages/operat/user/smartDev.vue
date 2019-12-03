<template>
  <div class="smart-dev">
    <el-row>
      <el-col :span="7">
        <el-form :inline="true" label-width="60px" label-position="left">
          <el-form-item label="账号:">
            <el-input
              placeholder="登录账号"
              v-model="smartForm.userName"
              clearable
              @clear="smartFilter"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="7">
        <el-form :inline="true" label-width="60px" label-position="left">
          <el-form-item label="昵称:">
            <el-input placeholder="昵称" v-model="smartForm.nickName" clearable @clear="smartFilter"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-form :inline="true" label-width="60px" label-position="left">
          <el-form-item label="手机号:">
            <el-input placeholder="手机号" v-model="smartForm.mobile" clearable @clear="smartFilter"></el-input>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="2" style="text-align: right;">
        <el-button
          @click="smartFilter"
          type="primary"
          style="background:rgba(118,112,217,1);border:none;"
        >查找</el-button>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <el-row class="smart-dev-show">
      <span v-show="tableData.length<=0" class="prompt">暂无智能家居控制端(APP)用户信息！</span>

      <el-table v-show="tableData.length>0" :data="tableData" border style="width: 100%">
        <el-table-column prop="id" sortable label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="headImg" label="头像" width="90" align="center">
          <template slot-scope="scope">
            <!-- <el-avatar :src="scope.row.headImg"></el-avatar> -->
            <el-image class="avatar" :lazy="true" :src="scope.row.headImg" fit="cover"></el-image>
          </template>
        </el-table-column>
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
        <el-table-column prop="timeStamp" label="当前状态" width="80" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status==0 ? "已启用" : "已禁用"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-row class="table-btns">
              <el-col :span="24">
                <el-button
                  style="color:rgba(118,112,217,1);"
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
              </el-col>
            </el-row>
            <!-- <el-switch v-model="scope.row.status" active-color="#898995" inactive-color="#7670D9" active-text="启用"></el-switch> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- //分页组件 -->
      <div v-show="!isEmpty" class="pagination">
        <pagination :total="total" :pageSize="pageSize" @getChange="currentChange"></pagination>
      </div>
    </el-row>

    <!-- 编辑用户弹窗 -->
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
          <el-form-item label="昵称：" prop="nickName">
            <el-input v-model="formLabelAlign.nickName" placeholder="昵称"></el-input>
          </el-form-item>

          <el-form-item label="启用：">
            <el-switch v-model="formLabelAlign.status"></el-switch>
          </el-form-item>

          <el-form-item label="上传头像：">
            <!-- <el-switch v-model="formLabelAlign.headImg"></el-switch> -->
            <qiniuUpdate
              :oldFileUrl="formLabelAlign.headImg"
              :preview="true"
              @qiniuSucc="qiniuSucc"
              @fileChange="fileChange"
            >
              <img v-if="formLabelAlign.headImg" :src="formLabelAlign.headImg" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </qiniuUpdate>
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
import qiniuUpdate from "@/components/qiniuUpdate";
import { mapGetters } from "vuex";

import { agentConfig, getList, updateInfo } from "@/api/smartDev";
import { userType } from "@/api/user";

export default {
  name: "smart-dev",
  components: {
    pagination,
    qiniuUpdate
  },
  computed: {
    ...mapGetters(["userId"]),
    //判断是否有数据
    isEmpty() {
      return this.tableData.length === 0 ? true : false;
    }
  },
  data() {
    return {
      pageNum: agentConfig.PAGENUM,
      pageSize: agentConfig.PAGESIZE,
      //表格展示数据
      tableData: [],
      //数据条数
      total: 0,
      //表单数据
      formLabelAlign: {
        id:"",
        nickName: "",
        status: "",
        headImg: ""
      },
      //弹窗的显示隐藏
      centerDialogVisible: false,
      //过滤数据
      smartForm: {
        nickName: "",
        userName: "",
        mobile: ""
      },
      //更新头像的时候原七牛的资源key
      key7: null,
      //拷贝数据用于验证是否更改
      copyData: null,
      rules: {
        nickName: [
          { required: true, message: "请输入代理商名称！", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态！", trigger: "blur" }],
        headImg: [
          { required: true, message: "请上传头像！", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this._getList();
  },
  methods: {
    handleEdit(index, row) {
      this.centerDialogVisible = true;

      this.formLabelAlign.nickName = row.nickName;
      this.formLabelAlign.id = row.userId;
      this.formLabelAlign.status = row.status === 0 ? true : false;
      this.formLabelAlign.headImg = row.headImg;

      //拷贝数据
      this.copyData = JSON.stringify(this.formLabelAlign);
    },
    //上传成功后触发
    qiniuSucc(url) {
      this.formLabelAlign.headImg = url;
    },
    //文件状态改变时触发
    fileChange(oldUrl) {
      this.key7 = oldUrl.split("/").pop() || null;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let str = JSON.stringify(this.formLabelAlign);
          if (str === this.copyData) {
            this.$message({
              message: "您没有修改任何内容，无法提交！",
              type: "warning"
            });
            return;
          }
          //执行添加
          this._updateInfo();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.copyData = null;
      this.key7 = null;
    },
    //查询过滤
    smartFilter() {
      this._getList();
    },
    //分页状态改变时重新请求数据
    currentChange(index) {
      this.pageNum = index;
      this._getList();
    },
    //更新用户信息
    _updateInfo() {
      let options = {
        userId:this.formLabelAlign.id,
        nickName: this.formLabelAlign.nickName,
        status: this.formLabelAlign.status ? 0 : 1,
        headImg: this.formLabelAlign.headImg
      };
      this.key7 && (options.key7 = this.key7);
      updateInfo(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.centerDialogVisible = false;
          this.updatePage(options);
        }
      });
    },
    //不重新请求数据更新本地页面
    updatePage(options){
      this.tableData.forEach((item,index)=>{
        if(item.userId === options.userId){
          item.nickName = options.nickName;
          item.status = options.status;
          item.headImg = options.headImg;
        }
      })
    },
    //获取列表
    _getList() {
      let options = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userType: userType.SMARTDEV.type
      };

      //查询参数
      this.smartForm.nickName != ""
        ? (options.nickName = this.smartForm.nickName)
        : options;
      this.smartForm.userName != ""
        ? (options.userName = this.smartForm.userName)
        : options;
      this.smartForm.mobile != ""
        ? (options.mobile = this.smartForm.mobile)
        : options;

      getList(options).then(res => {
        if (res.data.code === 200) {
          const { records, total } = res.data.data;
          this.tableData = records;
          this.total = total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" >
.smart-dev {
  .smart-dev-show {
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
    .avatar {
      width: 65px;
      height: 65px;
      border-radius: 50%;
      overflow: hidden;
      background-size: 100%;
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
