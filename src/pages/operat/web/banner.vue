<template>
  <div class="banner">
    <!-- addUpload -->
    <el-row class="upload">
      <span class="upLoad-btn" @click.stop="dialogShow">添加上传</span>
    </el-row>
    <!-- tanle -->
    <el-table :data="tableData" stripe border style="width: 100%" class="banner-table">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column prop="bannerTitle" label="banner 标题"></el-table-column>
      <el-table-column prop="linkUrl" label="地址">
        <template slot-scope="scope">
          <a :href="scope.row.linkUrl" target="_blank">{{scope.row.linkUrl}}</a>
        </template>
      </el-table-column>

      <el-table-column prop="mobileDataUrl" label="缩略图" width="140">
        <template slot-scope="scope">
          <el-image :lazy="true" :src="scope.row.mobileDataUrl" fit="scale-down"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="timeStamp" label="更新时间" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.timeStamp | filterFun}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="user" label="发布人" width="140">
        <template>
          <span>admin</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="175">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <div class="pagination">
      <pagination :total="50" :pagerCount="pagerCount" @getChange="change"></pagination>
    </div>-->
    <!-- 弹窗 -->
    <div class="dialog">
      <banner-dialog 
      :DialogVisible="dialogVisible" :updata="updata" @dialogClose="dialogShow"
      @succBanner="getBannerList"></banner-dialog>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/pagination";
import bannerDialog from "@/components/bannerDialog";
import { bannerList, deleteBanner } from "@/api/banner.js";
import utils from "@/utils/index"; //导入工具函数

export default {
  name: "banner",
  components: {
    pagination,
    bannerDialog
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    }
  },
  filters: {
    filterFun: function(value) {
      return utils.formatDate("YYYY-mm-dd hh:ff:ss", new Date(value));
    }
  },
  data() {
    return {
      //分页每一页显示的数量
      // pagerCount: 5,
      //表格数据
      tableData: null,
      //是否显示添加和编辑弹窗
      dialogVisible: false,
      //当前要删除的banner的id
      deleteId: 0,
      //当前删除banner的key
      keys: [],
      //当前要修改的数据
      updata: null
    };
  },
  created() {
    this.getBannerList();
  },
  mounted() {},
  methods: {
    handleEdit(index, row) {
      this.updata = row;
      this.dialogVisible = !this.dialogVisible;
    },
    //删除
    handleDelete(index, row) {
      this.deleteId = row.id;
      let key1 = row.mobileDataUrl.split("/").pop();
      this.keys.push(key1);
      let key2 = row.pcDataUrl.split("/").pop();
      this.keys.push(key2);

      this.$confirm(
        `此操作将删除该id为${this.deleteId}的图片, 是否继续?`,
        "温馨提示！",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //删除banner
          deleteBanner(this.userId, this.deleteId, this.keys).then(res => {
            if (res.data.code == 200) {
              this.getBannerList();
              this.$message({
                message: "删除成功！",
                type: "success"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //获取banner列表
    getBannerList() {
      bannerList().then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
    //分页事件
    change(index) {},
    //打开或关闭添加弹窗
    dialogShow() {
      this.updata = null;
      this.dialogVisible = !this.dialogVisible;
      // this.getBannerList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" scoped>
.banner {
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
  .banner-table {
    .small-img {
    }
  }
  .pagination {
    text-align: right;
    margin-top: 45px;
  }
  .dialog {
    position: relative;
    width: 100%;
    height: 100%;
    left: 0;
  }
}
</style>
