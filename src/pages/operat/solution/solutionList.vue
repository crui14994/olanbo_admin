<template>
  <div class="solution-list">
    <!-- //顶部操作 -->
    <el-row class="solution-list-edit">
      <!-- search -->
      <el-col :span="9">
        <div class="grid-content bg-purple">
          <el-input autosize prefix-icon="el-icon-search" placeholder="输入关键词" v-model="search">
            <el-button class="edit-serach" slot="append" @click="searchList">搜索</el-button>
          </el-input>
        </div>
      </el-col>
      <!-- select -->
      <el-col :span="7" :offset="3">
        <div class="grid-content bg-purple-light edit-select">
          <el-form>
            <el-form-item label="分类">
              <el-select v-model="solutionTypeId" placeholder="请选择分类" @change="selectList">
                <el-option class="edit-serach-option" label="全部" value></el-option>
                <el-option
                  :label="item.typeName"
                  :value="item.id"
                  v-for="(item,index) in solutionTypeArr"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <!-- add -->
      <el-col :span="3" :offset="2">
        <div class="solution-list-add">
          <el-button class="edit-add" icon="iconfont icon-xinzeng" @click="addsolution">&nbsp;新增方案</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="id" width="80" align="center"></el-table-column>
      <el-table-column prop="title" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="status" label="推荐状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status ==0 ? '否' :'是'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="imgUrl" label="缩略图" width="140" align="center">
        <template slot-scope="scope">
          <el-image :lazy="true" :src="scope.row.imgUrl" fit="scale-down"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="typeId" label="分类" width="180" align="center">
        <template slot-scope="scope">
          <span>{{typeName(scope.row.typeId)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="timeStamp" label="更新时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.timeStamp | timeFormat}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="user" label="发布人" width="100" align="center">
        <template>
          <span>admin</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-row class="table-btns">
            <el-col :span="7">
              <el-button
                style="color:rgba(118,112,217,1);"
                size="mini"
                type="text"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
            </el-col>
            <el-col :span="7">
              <el-button
                style="color:#6b6b6b;"
                size="mini"
                @click="_deleteSolution(scope.$index, scope.row)"
                type="text"
              >删除</el-button>
            </el-col>
            <el-col :span="10">
              <el-button v-if="scope.row.status==1" size="mini" type="text" @click="recommend(scope.$index, scope.row)">取消推荐</el-button>
              <el-button
                v-if="scope.row.status==0"
                style="background:rgba(118,112,217,1);border-color:rgba(118,112,217,1);"
                size="mini"
                type="primary"
                @click="recommend(scope.$index, scope.row)"
              >推荐</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- //分页组件 -->
    <div class="pagination">
      <pagination :total="total" :pageSize="pageSize" @getChange="currentChange"></pagination>
    </div>
  </div>
</template>

<script>
import {
  getSolution,
  deleteSolution,
  getSolutionType,
  updateSolution,
  solutionConfig
} from "@/api/solution.js";
import pagination from "@/components/pagination";

export default {
  name: "solutionList",
  data() {
    return {
      //搜索
      search: "",
      solutionTypeId: "", //选中的分类
      solutionTypeArr: [], //分类列表
      tableData: [],
      pageNum: solutionConfig.PAGENUM, //分页当前页码
      pageSize: solutionConfig.PAGESIZE, //分页查询中每页返回的总条数
      total: 0 //总共有多少条数据
    };
  },
  components: {
    pagination
  },
  created() {
    this._getSolutionType();
    this._getSolution();
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    },
    //类型名称
    typeName() {
      return function(value) {
        for (let i = 0; i < this.solutionTypeArr.length; i++) {
          if (value == this.solutionTypeArr[i].id) {
            return this.solutionTypeArr[i].typeName;
          }
        }
      };
    }
  },
  methods: {
    //推荐或取消
    recommend(index, row){
      let options = {
        id: row.id,
        userId: this.userId,
        status: row.status ? 0 : 1
      };
      updateSolution(options).then(res => {
        const { code } = res.data;
        if (code == 200) {
          this._getSolution();
          this.$message({
            type: "success",
            message: options.status ? "推荐成功!" :"已取消推荐！"
          });
        }
      });
    },
    //编辑
    handleEdit(index, row) {
      this.$router.push("/web/solutionEdit/" + row.id);
    },
    //删除
    _deleteSolution(index, row) {
      this.$confirm(
        `此操作将永久删除id为${row.id}的解决方案, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let options = {
            userId: this.userId,
            id: row.id
          };
          deleteSolution(options).then(res => {
            let { code } = res.data;
            if (code == 200) {
              this._getSolution();
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
    //获取解决方案类型
    _getSolutionType() {
      getSolutionType().then(res => {
        let { code } = res.data;
        if (code === 200) {
          this.solutionTypeArr = res.data.data;
        } else if (code === 300) {
          this.solutionTypeArr = [];
        }
      });
    },
    //根据传入参数的不同获取对应解决方案
    _getSolution() {
      let options = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        title: this.search,
        typeId: this.solutionTypeId
      };
      getSolution(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          let { total, records } = res.data.data;
          this.tableData = records;
          this.total = total;
        } else if (code == 300) {
          this.tableData = [];
        }
      });
    },
    //分页状态改变时重新请求数据
    currentChange(index) {
      this.pageNum = index;
      this._getSolution();
    },
    //新增解决方案
    addsolution() {
      this.$router.push("/web/solutionEdit/add");
    },
    //根据关键词搜索
    searchList() {
      this._getSolution();
    },
    //根据选中得到分类搜索
    selectList(sysTypeId) {
      this._getSolution();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" >
.solution-list {
  padding: 0 40px;
  .solution-list-edit {
    padding: 25px 0;
    .el-input__inner:focus {
      border-color: rgba(118, 112, 217, 1) !important;
    }
    .solution-list-add {
      text-align: right;
    }
    .edit-select {
    }
    .edit-serach,
    .edit-add {
      background: rgba(118, 112, 217, 1);
      color: #fff;
      border-color: rgba(118, 112, 217, 1) !important;
    }
  }
  .table-btns {
    > div {
      text-align: center;
    }
  }
  .pagination {
    text-align: right;
    margin: 50px 0;
  }
}
</style>
