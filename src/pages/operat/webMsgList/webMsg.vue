<template>
  <div class="web-msg">
    <!-- //顶部操作 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-row>
        <el-col :span="7">
          <el-form-item label="联系人姓名:">
            <el-input v-model="formInline.user" placeholder="输入联系人姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <!-- <el-form-item label="留言时间:">
            <el-date-picker
              v-model="formInline.datePicker"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>-->
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="formInline.region" placeholder="状态">
              <el-option label="全部" value></el-option>
              <el-option label="未回访" value="0"></el-option>
              <el-option label="已回访" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="primary" style="background:rgba(118,112,217,1);border-color:rgba(118,112,217,1);" @click="onSubmit">一键查询</el-button>
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
        <!-- <el-table-column prop="city" label="所在省份" align="center" width="120"></el-table-column> -->
        <el-table-column prop="email" label="邮箱" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p>{{ scope.row.email }}</p>
              <div slot="reference" class="name-wrapper overflow-text">
                <span>{{ scope.row.email }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="timeStamp" label="留言时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.timeStamp | timeFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="留言内容" align="center">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="bottom">
              <p>{{ scope.row.content }}</p>
              <div slot="reference" class="name-wrapper overflow-text">
                <span>{{ scope.row.content }}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button
              style="width:60px;background:rgba(118,112,217,1);border-color:rgba(118,112,217,1);padding: 7px 10px;"
              v-if="scope.row.status==0"
              type="primary"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >未回访</el-button>
            <el-button style="color:#7670D9;width:60px;" v-if="scope.row.status==1" size="mini" type="text">已回访</el-button>
            <el-button style="color:#6B6B6B;" size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  getWebMsgList,
  changeStatus,
  deleteMsg
} from "@/api/webMsg.js";
export default {
  name: "webMsg",
  data() {
    return {
      //   pickerOptions: {
      //     shortcuts: [
      //       {
      //         text: "最近一周",
      //         onClick(picker) {
      //           const end = new Date();
      //           const start = new Date();
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //           picker.$emit("pick", [start, end]);
      //         }
      //       },
      //       {
      //         text: "最近一个月",
      //         onClick(picker) {
      //           const end = new Date();
      //           const start = new Date();
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //           picker.$emit("pick", [start, end]);
      //         }
      //       },
      //       {
      //         text: "最近三个月",
      //         onClick(picker) {
      //           const end = new Date();
      //           const start = new Date();
      //           start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      //           picker.$emit("pick", [start, end]);
      //         }
      //       }
      //     ]
      //   },
      formInline: {
        user: "",
        region: "",
        datePicker: "",
        tel: "",
        email: ""
      },
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
    //设置已回访
    handleEdit(index, row) {
      let options = {
        id: row.id,
        status: typeStatus.REPLY,
        userId: this.userId
      };
      changeStatus(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "已回访成功！",
            type: "success"
          });
          this._getList();
        }
      });
    },
    // 删除留言信息
    handleDelete(index, row) {
      this.$confirm(
        `此操作将永久删除id为${row.id}的留言信息, 是否继续?`,
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
          deleteMsg(options).then(res => {
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
        status: this.formInline.region,
        name: this.formInline.user,
        tel: this.formInline.tel,
        email: this.formInline.email
      };
      getWebMsgList(options).then(res => {
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
    selectList() {},
    onSubmit() {
      this._getList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" >
.web-msg {
  .tables {
    padding: 40px 0;
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
