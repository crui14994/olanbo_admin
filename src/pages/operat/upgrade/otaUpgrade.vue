<template>
  <div class="ota-upgrade">
    <el-row>
      <span class="add-user" @click="centerDialogVisible = true">新增</span>
    </el-row>

    <!-- 表格数据 -->
    <el-row class="app-show">
      <span v-show="tableData.length<=0" class="prompt">您还没有添加任何OTA设备，请点击按钮上传。</span>

      <el-table
        @expand-change="expandChange"
        v-show="tableData.length>0"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="modelId" label="设备类型" align="center">
          <template slot-scope="scope">
            <span>{{getOtaTypeItem(scope.row.modelId).devName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="filePath" label="filePath" align="center"></el-table-column>
        <el-table-column prop="version" label="版本号" width="100" align="center"></el-table-column>
        <el-table-column prop="timeStamp" label="更新时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.timeStamp | timeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              style="color:rgba(118,112,217,1)"
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>

            <el-button
              style="color:rgba(118,112,217,1)"
              type="text"
              size="mini"
              @click="updaeAll(scope.$index, scope.row)"
            >全部更新</el-button>
          </template>
        </el-table-column>
        <el-table-column label="更多" width="50" align="center" type="expand">
          <template slot-scope="scope">
            <otaTable  :devType="getOtaTypeItem(scope.row.modelId).id"></otaTable>
          </template>
        </el-table-column>
      </el-table>
      <!-- //分页组件 -->
      <div v-show="!isEmpty" class="pagination">
        <pagination :total="total" :pageSize="pageSize" @getChange="currentChange"></pagination>
      </div>
    </el-row>

    <!-- 添加弹窗 -->
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
          <el-form-item label="上传文件:" class="up-apk">
            <!-- //七牛文件上传 -->
            <qiniu-update
              :oldFileUrl="urlPath"
              fileType="zip/rar/tar"
              @qiniuSucc="qiniuSucc"
              @getFileSize="getFileSize"
              @fileChange="fileChange"
            >
              <el-button class="up-btn" plain>{{upApkTxt}}</el-button>
            </qiniu-update>

            <i v-show="urlPath" class="icon-suncc iconfont icon-gou1"></i>
          </el-form-item>
          <el-form-item label="设置版本号:" prop="version">
            <el-input v-model="formLabelAlign.version" placeholder="输入版本号"></el-input>
          </el-form-item>
          <el-form-item label="设备类型:" prop="modelId">
            <el-select v-model="formLabelAlign.modelId" :disabled="isUpdate" placeholder="请选择设备类型">
              <el-option
                v-for="(item,index) in otaTypeList"
                :key="index"
                :label="item.devName"
                :value="item.modelId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="md5地址:" prop="fileMd5">
            <el-input :disabled="true" v-model="formLabelAlign.fileMd5" placeholder="上传后获取md5地址"></el-input>
          </el-form-item>
          <el-form-item label="文件大小:" prop="fileSize">
            <el-input :disabled="true" v-model="formLabelAlign.fileSize" placeholder="上传后获取文件大小"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button class="cancel-btn" @click="centerDialogVisible = false">取 消</el-button>
          <el-button class="ok-btn" @click="submitForm('formLabelAlign')">确 定</el-button>
        </span>
      </el-dialog>
    </el-row>
    <div></div>
  </div>
</template>

<script>
import qiniuUpdate from "@/components/qiniuUpdate";
import pagination from "@/components/pagination";
import otaTable from "@/components/otaTable";

import {
  managerConfig,
  getOtaType,
  getMd5,
  managerList,
  addManager,
  updateManager,
  otaPush
} from "@/api/otaUpgrade";
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
      otaTypeList: [], //设备类型列表
      pageNum: managerConfig.PAGENUM,
      pageSize: managerConfig.PAGESIZE,
      total: 0,
      //文件地址
      urlPath: "",
      //表格展示数据
      tableData: [],
      //Table 目前的展开行
      expands: [],
      //是否是修改数据
      isUpdate: false,
      //弹窗的显示隐藏
      centerDialogVisible: false,
      //表格中的数据id编号
      tableId: null,
      //表单数据
      formLabelAlign: {
        version: "",
        modelId: "",
        //md5地址
        fileMd5: "",
        //文件大小
        fileSize: ""
      },
      //用于验证是否修改
      cloneGrade: "",
      rules: {
        version: [
          { required: true, validator: validateVersion, trigger: "blur" }
        ],
        modelId: [
          { required: true, message: "请选择设备类型", trigger: "change" }
        ],
        fileMd5: [{ required: true, message: "请上传文件", trigger: "change" }],
        fileSize: [{ required: true, message: "请上传文件", trigger: "change" }]
      }
    };
  },
  components: {
    qiniuUpdate,
    pagination,
    otaTable
  },
  computed: {
    ...mapGetters(["userId", "id"]),
    //上传apk按钮文字
    upApkTxt() {
      return this.urlPath ? "已上传" : "点击上传";
    },
    //判断是否有数据
    isEmpty() {
      return this.tableData.length === 0 ? true : false;
    },
    //根据modelId获取设备类型名称和id
    getOtaTypeItem() {
      return function(modelId) {
        let devItem = {};
        this.otaTypeList.forEach(item => {
          if (item.modelId == modelId) {
            devItem.devName = item.devName;
            devItem.id = item.id;
          }
        });

        return devItem;
      };
    }
  },
  created() {
    this._getOtaType();
    this._managerList();
  },
  mounted() {},
  methods: {
    getRowKeys: function(row) {
      return row.id;
    },
    //某一行展开或者关闭的时候会触发该事件
    expandChange(row, expandedRows) {
      // console.log(row, expandedRows);
      var that = this;
      if (expandedRows.length) {
        that.expands = [];
        if (row) {
          that.expands.push(row.id);
        }
      } else {
        that.expands = [];
      }
    },
    //全部更新
    updaeAll(index, item) {
      this.$confirm("当前操作将对已注册的所有设备进行更新，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let options = {
            userId: this.userId,
            modelId: item.modelId
          };
          otaPush(options).then(res => {
            let { code } = res.data;
            if (code === 200) {
              this.$message({
                type: "success",
                message: "更新成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更新"
          });
        });
    },
    //分页状态改变时重新请求数据
    currentChange(index) {
      this.pageNum = index;
      this._managerList();
    },
    //获取设备类型
    _getOtaType() {
      getOtaType().then(res => {
        const { data } = res.data;
        this.otaTypeList = data;
      });
    },
    //获取列表
    _managerList() {
      let options = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      managerList(options).then(res => {
        const { data } = res.data;
        this.tableData = data.records;
        this.total = data.total;
      });
    },
    //添加
    _addManager() {
      let options = {
        userId: this.userId,
        filePath: this.urlPath,
        version: this.formLabelAlign.version,
        fileSize: this.formLabelAlign.fileSize,
        fileMd5: this.formLabelAlign.fileMd5,
        modelId: this.formLabelAlign.modelId
      };
      addManager(options).then(res => {
        const { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
          this.centerDialogVisible = false;
          //更新数据
          this._managerList();
        }
      });
    },
    //更新
    _updateManager() {
      let options = {
        id: this.tableId,
        filePath: this.urlPath,
        userId: this.userId,
        version: this.formLabelAlign.version,
        fileSize: this.formLabelAlign.fileSize,
        fileMd5: this.formLabelAlign.fileMd5
      };
      //验证是否有修改过
      let str = JSON.stringify(this.formLabelAlign) + this.urlPath;
      if (str !== this.cloneGrade) {
        updateManager(options).then(res => {
          const { code } = res.data;
          if (code == 200) {
            this.$message({
              message: "修改成功！",
              type: "success"
            });
            this.centerDialogVisible = false;
            //更新数据
            this._managerList();
          }
        });
      } else {
        this.$message({
          message: "您没有修改任何内容，无法提交！",
          type: "warning"
        });
      }
    },
    //七牛上传成功
    qiniuSucc(url) {
      this.urlPath = url;
      //获取md5
      getMd5(this.urlPath).then(res => {
        this.formLabelAlign.fileMd5 = res.data.md5;
      });
    },
    //获取文件大小
    getFileSize(size) {
      this.formLabelAlign.fileSize = size;
    },
    //七牛状态改变，重新上传时触发
    fileChange(oldUrl) {
      this.key7 = oldUrl.split("/").pop() || null;
    },
    //编辑用户
    handleEdit(index, row) {
      //重置验证是否修改数据
      this.cloneGrade = "";

      this.isUpdate = true; //表示为修改数据
      this.tableId = row.id;
      this.centerDialogVisible = true;

      this.formLabelAlign.version = row.version;
      this.formLabelAlign.fileMd5 = row.fileMd5;
      this.formLabelAlign.modelId = row.modelId;
      this.formLabelAlign.fileSize = row.fileSize;
      /***注意此处还应设置urlPath的值***/
      this.urlPath = row.filePath;

      this.cloneGrade = JSON.stringify(this.formLabelAlign) + this.urlPath;
    },
    submitForm(formName) {
      // 先判断有没有上传文件
      if (!this.urlPath) {
        this.$message({
          type: "error",
          message: "请先上传文件！"
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
        modelId: "",
        isForce: null
      };
      this.urlPath = "";
      this.$refs[formName].resetFields();
    },
    //格式化文件大小的JS方法
    renderSize(filesize) {
      let fileSizeByte = filesize;
      var fileSizeMsg = "";
      if (fileSizeByte < 1048576)
        fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
      else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
      else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824)
        fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
      else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824)
        fileSizeMsg = "1GB";
      else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776)
        fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
      else fileSizeMsg = "文件超过1TB";
      return fileSizeMsg;
    }
  }
};
</script>

<style  lang = "scss">
.ota-upgrade {
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
  .pagination {
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
