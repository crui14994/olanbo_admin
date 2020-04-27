<!--
**  设备ota升级页面表格嵌套组件
 -->
<template>
  <div class="ota-table">
    <el-row>
      <el-col :span="24" class="ota-table-form">
        <div style="width:240px">
          <el-input
            placeholder="请输入家庭id"
            size="small"
            @clear="clearHouseId"
            v-model.number="houseid"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search" @click="searchHouseId"></el-button>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="ota-table-table">
        <el-table :data="tableData" size="small" style="width: 100%">
          <el-table-column prop="devName" label="名称"></el-table-column>
          <el-table-column prop="devMac" label="mac"></el-table-column>
          <el-table-column prop="houseId" label="家庭id"></el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button
                style="color:rgba(118,112,217,1)"
                type="text"
                size="mini"
                @click="pushItem(scope.$index, scope.row)"
              >推送当前</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="ota-table-pagination">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          :current-page="pageNum"
          @current-change="currentChange"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { userDevsList, otaPush } from "@/api/otaUpgrade";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      pageSize: 6,
      pageNum: 1,
      total: 0,
      houseid: "", //家庭id
      tableData: []
    };
  },
  props: {
    //传入设备小分类
    devType:{
      type: Number,
      required:true
    }
  },
  components: {},
  computed: {
    ...mapGetters(["userId"])
  },
  created() {
    this.getDevList();
  },
  methods: {
    clearHouseId() {
      this.pageNum = 1;
      this.getDevList();
    },
    //查询houseId
    searchHouseId() {
      this.pageNum = 1;
      if (this.houseid) {
        if (!Number.isInteger(this.houseid)) {
          this.$message({
            type: "info",
            message: "请输入正确的家庭id！"
          });
          this.houseid = "";
        } else {
          this.getDevList({ houseId: this.houseid });
        }
      } else {
        this.$message({
          type: "info",
          message: "家庭id不能为空！"
        });
      }
    },
    //获取设备列表
    async getDevList(ops) {
      let options = {
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        devType:this.devType
      };
      if (ops) {
        Object.keys(ops).map((item, index) => {
          options[item] = ops[item];
        });
      }
      let res = await userDevsList(options);
      const { code, data } = res.data;
      if (code === 200) {
        this.total = data.total;
        this.tableData = data.records.map(item => {
          return {
            id: item.id,
            devName: item.devName,
            devMac: item.devMac,
            houseId: item.houseId
          };
        });
      } else if (code === 300) {
        this.total = 0;
        this.tableData = [];
      }
    },
    //推送当前
    pushItem(index, row) {
      this.$confirm(
        `当前操作将对houseId为 ${row.houseId} 设备进行更新，是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          otaPush({ userId: this.userId, devId: row.id }).then(res => {
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
            message: "已取消删除"
          });
        });
    },
    //分页
    currentChange(index) {
      this.pageNum = index;
      let options = {};
      if (this.houseid) {
        options = { houseId: this.houseid };
      }
      this.getDevList(options);
    }
  }
};
</script>

<style lang = "scss">
.el-table__expanded-cell,
.el-table__expanded-cell:hover {
  background-color: #fafbfc !important;
}
.ota-table {
  .ota-table-form {
    margin-top: 15px;
    .input-with-select {
      .el-input-group__append {
        border-color: rgba(118, 112, 217, 1);
        background-color: rgba(118, 112, 217, 1);
        i {
          color: #ffffff;
        }
      }
    }
    .search {
      background: rgba(118, 112, 217, 1);
      color: #fff;
      border-color: rgba(118, 112, 217, 1) !important;
    }
  }
  .ota-table-table {
    margin-top: 10px;
    td,
    th {
      border-right: 0;
      background-color: #fafbfc;
    }
  }
  .ota-table-pagination {
    text-align: right;
    padding: 15px 0;
    .el-pager li {
      background: none;
    }
  }
}
</style>