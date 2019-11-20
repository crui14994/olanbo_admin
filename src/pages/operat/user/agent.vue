<template>
  <div class="agent">
    <!-- 表格数据 -->
    <el-row class="agent-show">
      <span v-show="tableData.length<=0" class="prompt">暂无代理商信息！</span>

      <el-table v-show="tableData.length>0" :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
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
  </div>
</template>


<script>
import pagination from "@/components/pagination";
import { mapGetters } from "vuex";

import { agentConfig, getList } from "@/api/agent";
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
    return {
      pageNum: agentConfig.PAGENUM,
      pageSize: agentConfig.PAGESIZE,
      //表格展示数据
      tableData: [],
      //数据条数
      total: 0
    };
  },
  created() {
    this._getList();
  },
  methods: {
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
<style lang = "scss" scoped>
.agent {
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
}
</style>
