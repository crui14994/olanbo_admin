<template>
  <div class="product-list">
    <!-- //顶部操作 -->
    <el-row class="product-list-edit">
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
              <el-select v-model="typeId" placeholder="请选择分类" @change="selectList">
                <el-option class="edit-serach-option" label="全部" value></el-option>
                <el-option
                  :label="item.typeName"
                  :value="item.id"
                  v-for="(item,index) in ListType"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <!-- add -->
      <el-col :span="3" :offset="2">
        <div class="product-list-add">
          <el-button class="edit-add" icon="iconfont icon-xinzeng" @click="addItem">&nbsp;新增案例</el-button>
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
      <el-table-column prop="typeId" label="分类" align="center">
        <template slot-scope="scope">
          <span>{{typeName(scope.row.typeId)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logoUrl" label="封面图" width="140" align="center">
        <template slot-scope="scope">
          <el-image :lazy="true" :src="scope.row.logoUrl" fit="scale-down"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="timeStamp" label="更新时间" align="center">
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
                style="color:#7670D9;"
                size="mini"
                type="text"
                @click="updatItem(scope.$index, scope.row)"
              >编辑</el-button>
            </el-col>
            <el-col :span="7">
              <el-button
                style="color:#6b6b6b;"
                size="mini"
                type="text"
                @click="_deleteItem(scope.$index, scope.row)"
              >删除</el-button>
            </el-col>
            <el-col :span="10">
              <el-button
                style="color:#ffffff;background-color:#7670D9;border-color:#7670D9;"
                size="mini"
                type="primary"
                v-if="scope.row.status===0"
                @click="recommend(scope.$index, scope.row ,1)"
              >推荐</el-button>
              <el-button
                style="color:#7670D9;"
                size="mini"
                type="text"
                v-if="scope.row.status===1"
                @click="recommend(scope.$index, scope.row,0)"
              >取消推荐</el-button>
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
  STATUS,
  getListType,
  update,
  getList,
  deleteItem
} from "@/api/examples.js";
import pagination from "@/components/pagination";
import { mapGetters } from "vuex";
export default {
  name: "exampleList",
  data() {
    return {
      //搜索
      search: "",
      //分类
      typeId: "",
      tableData: [],
      pageNum: 1, //分页当前页码
      pageSize: 5, //分页查询中每页返回的总条数
      total: 0, //总共有多少条数据,
      ListType: [] //案列类型
    };
  },
  components: {
    pagination
  },
  created() {
    this._getList();
  },
  computed: {
    //用户id
    ...mapGetters(["userId"]),
    //案例类型名称
    typeName(value) {
      return function(value) {
        for (let i = 0; i < this.ListType.length; i++) {
          if (value == this.ListType[i].id) {
            return this.ListType[i].typeName;
          }
        }
      };
    }
  },
  methods: {
    //推荐设置
    recommend(index, row, status) {
      let options = {
        id: row.id,
        userId: this.userId,
        status: status
      };
      update(options).then(res => {
        const { code } = res.data;
        if (code == 200) {
          this._getList();
          this.$message({
            type: "success",
            message: options.status ? "推荐成功!" :"已取消推荐！"
          });
        }
      });
    },
    //修改案例
    updatItem(index, row) {
      this.$router.push("/web/exampleEdit/" + row.id);
    },
    //增加案列
    addItem() {
      this.$router.push("/web/exampleEdit/add");
    },
    //删除案列
    _deleteItem(index, row) {
      this.$confirm(`此操作将永久删除id为${row.id}文件, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteItem({ id: row.id, userId: this.userId }).then(res => {
            let { code } = res.data;
            if (code == 200) {
              this._getList();
              this.$message({
                type: "success",
                message: "删除成功!"
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
    //获取案列类型列表
    _getListType() {
      getListType().then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.ListType = res.data.data;
        }
      });
    },
    //获取案例列表
    _getList(status) {
      let options = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        title: this.search,
        typeId: this.typeId
      };
      if (status == "0" || status == "1") {
        options.status = status;
      }
      getList(options).then(res => {
        let { code } = res.data;
        this._getListType();
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
    //根据关键词搜索
    searchList() {
      this._getList();
    },
    //根据选中得到分类搜索
    selectList() {
      this._getList();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" >
.product-list {
  padding: 0 40px;
  .product-list-edit {
    padding: 25px 0;
    .el-input__inner:focus {
      border-color: rgba(118, 112, 217, 1) !important;
    }
    .product-list-add {
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
