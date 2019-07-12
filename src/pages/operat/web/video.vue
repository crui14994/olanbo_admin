<template>
  <div class="video">
    <!-- addUpload -->
    <el-row class="upload">
      <span class="upLoad-btn" @click="addVideo">添加上传</span>
    </el-row>

    <div class="video-container">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="id" width="80"></el-table-column>
        <el-table-column prop="url" label="地址">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="timeStamp" label="更新时间" width="200">
          <template slot-scope="scope">
            <span>{{scope.row.timeStamp | timeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="发布人" width="170">
          <template>
            <span>admin</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="90">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹窗 -->
    <div class="dialog">
      <video-dialog
        :updata="updataDialog"
        :isAdd="isAdd"
        :dialogVisible="DialogVideoVisible"
        @dialogClose="dialogToggle"
        @succUpdate="getVideoList"
      ></video-dialog>
    </div>
  </div>
</template>

<script>
import videoDialog from "@/components/videoDialog";
import { getHomeVideo } from "@/api/video.js";

export default {
  name: "webVideo",
  components: {
    videoDialog
  },
  data() {
    return {
      //弹窗是否显示
      DialogVideoVisible: false,
      //表格数据
      tableData: [],
      //需要传递到弹窗的数据
      updataDialog: {},
      //是否是添加视频
      isAdd: true
    };
  },
  created() {
    this.getVideoList();
  },
  methods: {
    //修改视频事件
    handleEdit(index, row) {
      this.isAdd = false;
      this.updataDialog = row;
      this.dialogToggle();
    },
    handleDelete(index, row) {},
    //添加视频事件
    addVideo() {
      this.isAdd = true;
      if (this.tableData.length != 0) {
        this.$message({
          message: "当前只能上传一个视频，如需更改请点击编辑！",
          type: "warning"
        });
      } else {
        this.updataDialog = {};
        this.dialogToggle();
      }
    },
    //弹窗的显示与隐藏
    dialogToggle() {
      this.DialogVideoVisible = !this.DialogVideoVisible;
    },
    //获取视频列表
    getVideoList() {
      getHomeVideo().then(res => {
        if (res.data.code == 200) {
          this.tableData = [res.data.data];
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" scoped>
.video {
  padding: 0 40px;
  .upload {
    .upLoad-btn {
      cursor: pointer;
      display: inline-block;
      width: 160px;
      font-size: 20px;
      color: aliceblue;
      font-weight: bold;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background: rgba(118, 112, 217, 1);
      border-radius: 10px;
      box-shadow: 0px 6px 7px 0px rgba(118, 112, 217, 0.4);
      border-radius: 10px;
      margin: 15px 0 45px 0;
    }
  }
}
</style>
