<template>
  <div class="coop-msg">
    <!-- //顶部操作 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-row>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="status" @change="selectList" placeholder="状态">
              <el-option label="全部" value></el-option>
              <el-option label="提交" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核不通过" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格 -->
    <div class="tables">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" sortable label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="联系人姓名" align="center" width="150"></el-table-column>
        <el-table-column prop="tel" label="联系电话" align="center" width="150"></el-table-column>
        <el-table-column prop="address" label="详细地址" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p>{{ scope.row.address }}</p>
              <div slot="reference" class="name-wrapper overflow-text">
                <span>{{ scope.row.address }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="timeStamp" label="留言时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.timeStamp | timeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="msgInfo" label="留言内容" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p>{{ scope.row.msgInfo }}</p>
              <div slot="reference" class="name-wrapper overflow-text">
                <span>{{ scope.row.msgInfo }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button
              style="width:60px;background:rgba(118,112,217,1);border-color:rgba(118,112,217,1);padding: 7px 10px;"
              size="mini"
              v-if="scope.row.status!=1"
              type="primary"
              @click="handlePass(scope.$index, scope.row)"
            >通过</el-button>
            <el-button style="color:#6B6B6B;" v-if="scope.row.status==1" size="mini" type="text">已通过</el-button>

            <el-button
              style="color:#ffffff;"
              v-if="scope.row.status!=2"
              size="mini"
              type="primary"
              @click="handleRefused(scope.$index, scope.row)"
            >审核失败</el-button>
            <el-button
              style="color:#6B6B6B;"
              v-if="scope.row.status==2"
              size="mini"
              type="text"
            >审核不通过</el-button>

            <el-button
              style="color:#6B6B6B;"
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- //分页组件 -->
    <div class="pagination">
      <pagination :total="total" :pageSize="pageSize" @getChange="currentChange"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/pagination";
import {
  typeStatus,
  addMsg,
  getcoopMsgList,
  changeStatus,
  deleteCoopMsg
} from "@/api/coopMsg.js";

export default {
  name: "webMsg",
  data() {
    return {
      status: "", //设备筛选状态
      pageNum: 1, //分页当前页码
      pageSize: 5, //分页查询中每页返回的总条数
      total: 0, //总共有多少条数据,
      tableData: [] //表格数据
    };
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    }
  },
  components: {
    pagination
  },
  created() {
    this._getList();
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    }
  },
  methods: {
    //通过审核
    handlePass(index, row) {
      this.updateMsg(row.id, typeStatus.REPLY);
    },
    //拒绝通过
    handleRefused(index, row) {
      this.updateMsg(row.id, typeStatus.REFUSED_TO);
    },
    //修改申请信息状态
    updateMsg(id, status) {
      let options = {
        id: id,
        status: status,
        userId: this.userId
      };
      changeStatus(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "操作成功！",
            type: "success"
          });
          this._getList();
        }
      });
    },
    // 删除留言信息
    handleDelete(index, row) {
      this.$confirm(
        `此操作将永久删除id为${row.id}的申请信息, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let options = {
            id: row.id,
            userId: this.userId
          };
          deleteCoopMsg(options).then(res => {
            let { code } = res.data;
            if (code == 200) {
              this._getList();
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
    //获取案例列表
    _getList() {
      let options = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        status: this.status
      };
      getcoopMsgList(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.total = res.data.data.total;
          this.tableData = res.data.data.records;
        } else if (code == 300) {
          this.total = 0;
          this.tableData = [];
        }
      });
    },
    //分页状态改变时重新请求数据
    currentChange(index) {
      this.pageNum = index;
      this._getList();
    },
    //根据选中得到分类搜索
    selectList(value) {
      this.status = value;
      this._getList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" >
.coop-msg {
  .tables {
    padding: 20px 0 40px;
    .overflow-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .pagination {
    text-align: right;
  }
}
</style>
