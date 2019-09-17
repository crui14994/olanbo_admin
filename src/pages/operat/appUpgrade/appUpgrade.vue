<template>
  <div class="app-upgrade">
    <el-row>
      <span class="add-user" @click="centerDialogVisible = true">添加版本号</span>
    </el-row>

    <!-- 表格数据 -->
    <el-row class="app-show">
      <span v-show="tableData.length<=0" class="prompt">您还没有任何经销商信息，请点击按钮上传。</span>

      <el-table v-show="tableData.length>0" :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="180" align="center"></el-table-column>
        <el-table-column prop="userId" label="经销商名字" width="180" align="center"></el-table-column>
        <el-table-column prop="version" label="版本号" align="center"></el-table-column>
        <el-table-column prop="timeStamp" label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.timeStamp | timeFormat}}</span>
          </template>
        </el-table-column>
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
          <el-form-item label="上传APK:" class="up-apk">
            <!-- //七牛文件上传 -->
            <qiniu-update
              :oldFileUrl="urlPath"
              :isImg="false"
              @qiniuSucc="qiniuSucc"
              @fileChange="fileChange"
            >
              <el-button class="up-btn" plain>{{upApkTxt}}</el-button>
            </qiniu-update>

            <i v-show="urlPath" class="icon-suncc iconfont icon-gou1"></i>
          </el-form-item>
          <el-form-item label="设置版本号:" prop="version">
            <el-input v-model="formLabelAlign.version" placeholder="输入版本号"></el-input>
          </el-form-item>
          <el-form-item label="经销商:" prop="dealers">
            <el-select v-model="formLabelAlign.dealers" placeholder="选择经销商">
              <el-option
                v-for="(item,index) in agentList"
                :key="index"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="formLabelAlign.isforce">是否强制更新</el-checkbox>
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
import qiniuUpdate from "@/components/qiniuUpdate";
import pagination from "@/components/pagination";
import {
  managerConfig,
  managerList,
  addManager,
  updateManager
} from "@/api/appUpgrade";
import { mapGetters } from "vuex";

export default {
  data() {
    var validateVersion = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入版本号"));
      } else {
        //验证版本号格式
        let isVersion = /^\d+\.\d+\.\d+$/.test(value);
        if (!isVersion) {
          callback(new Error("版本号格式错误！"));
        }
        callback();
      }
    };
    return {
      agentList: [], //用户经销商列表
      pageNum: managerConfig.PAGENUM,
      pageSize: managerConfig.PAGESIZE,
      total:0,
      //apk文件地址
      urlPath: "",
      //表格展示数据
      tableData: [],
      //是否是修改数据
      isUpdate:false,
      //弹窗的显示隐藏
      centerDialogVisible: false,
      //表单数据
      formLabelAlign: {
        version: "",
        dealers: "",
        isforce: false
      },
      rules: {
        version: [{ validator: validateVersion, trigger: "blur" }],
        dealers: [
          { required: true, message: "请选择经销商", trigger: "change" }
        ]
      }
    };
  },
  components: {
    qiniuUpdate,
    pagination
  },
  computed: {
    ...mapGetters(["userId", "id"]),
    //上传apk按钮文字
    upApkTxt() {
      return this.urlPath ? "已上传" : "上传APK";
    },
    //判断是否有数据
    isEmpty(){
       return this.tableData.length===0 ? true : false;
    }
  },
  created() {
    this._managerList();
  },
  mounted(){
  },
  methods: {
    //分页状态改变时重新请求数据
    currentChange(index) {
      this.pageNum = index;
      this._managerList();
    },
    //获取列表
    _managerList() {
      let options = {
        adminId: this.id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      managerList(options).then(res => {
        const { data } = res.data;
        const { pageInfo, agentList } = data;

        this.agentList = agentList;
        this.tableData = pageInfo.records;
        this.total = pageInfo.total;
      });
    },
    //添加
    _addManager() {
      let options = {
        urlPath: this.urlPath,
        userId: this.formLabelAlign.dealers,
        version: this.formLabelAlign.version,
        isforce: this.formLabelAlign.isforce,
        adminiUserId: this.id
      };
      addManager(options).then(res => {
        const { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.centerDialogVisible = false;
        }
      });
    },
    //更新
    _updateManager() {
      let options = {
        id:1,
        urlPath: this.urlPath,
        userId: this.formLabelAlign.dealers,
        version: this.formLabelAlign.version,
        isforce: this.formLabelAlign.isforce,
        adminiUserId: this.id
      };
      updateManager(options).then(res => {
        const { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.centerDialogVisible = false;
        }
      });
    },
    //七牛上传成功
    qiniuSucc(url) {
      this.urlPath = url;
    },
    //七牛状态改变，重新上传时触发
    fileChange(oldUrl) {
      this.key7 = oldUrl.split("/").pop() || null;
    },
    //编辑用户
    handleEdit(index, row) {
      this.isUpdate = true; //表示为修改数据
      this.centerDialogVisible = true;
      this.formLabelAlign.version = row.version;
      this.formLabelAlign.isforce = row.isforce;
      this.formLabelAlign.dealers = row.userId;
      /***注意此处还应设置urlPath的值***/
      this.urlPath = row.urlPath;
    },
    submitForm(formName) {
      // 先判断有没有上传apk文件
      if (!this.urlPath) {
        this.$message({
          type: "error",
          message: "请先上传apk文件！"
        });
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          //如果是修改就执行修改，否则执行添加
          this.isUpdate ? this._updateManager() : this._addManager();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.isUpdate = false;
      this.formLabelAlign = {
        version: "",
        dealers: "",
        isforce:false
      };
      this.urlPath = "";
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
  .pagination{
    text-align: right;
    margin: 50px 0;
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
