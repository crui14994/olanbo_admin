<template>
  <div class="recommend">
    <!-- //顶部操作 -->
    <el-row class="recommend-edit">
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
                  v-for="(item,index) in smartSysType"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <!-- add -->
      <el-col :span="3" :offset="2">
        <div class="recommend-add">
          <el-button class="edit-add" icon="iconfont icon-xinzeng" @click="addRecommend">&nbsp;新增推荐</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column align="center" prop="id" label="id" width="100"></el-table-column>
      <el-table-column align="center" prop="devName" label="名称"></el-table-column>
      <el-table-column align="center" prop="sysTypeId" label="分类">
        <template slot-scope="scope">
          <span>{{typeName(scope.row.sysTypeId)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="timeStamp" label="更新时间" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.timeStamp | timeFormat}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="logoPath" label="缩略图" width="140">
        <template slot-scope="scope">
          <el-image :lazy="true" :src="scope.row.logoPath" fit="scale-down"></el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="user" label="发布人" width="120">
        <template>
          <span>admin</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button style="color:#6b6b6b;" type="text" @click="cancelRecommend(scope.$index, scope.row)">取消推荐</el-button>
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
import { smartList, updateSmart } from "@/api/devs.js";
import pagination from "@/components/pagination";

export default {
  name: "recommend",
  data() {
    return {
      //搜索
      search: "",
      //分类
      typeId: "",
      tableData: [],
      pageNum: 1, //分页当前页码
      pageSize: 5, //分页查询中每页返回的总条数
      total: 0 //总共有多少条数据
    };
  },
  components: {
    pagination
  },
  computed: {
    //用户id
    userId() {
      return this.$store.state.user.userId;
    },
    //设备类型
    smartSysType() {
      return this.$store.state.user.smartSysType;
    },
    //设备类型名称
    typeName() {
      return function(value) {
        for(let i=0;i<this.smartSysType.length;i++){
          if(value == this.smartSysType[i].id){
            return this.smartSysType[i].typeName
          }
        }
      };
    }
  },
  created() {
    let options = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      typeId: this.typeId
    };
    this.getSmartList(options);
  },
  methods: {
    //根据传入参数的不同获取对应设备列表
    getSmartList(options) {
      options.status = 1;
      smartList(options).then(res => {
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
      let options = {
        pageNum: index,
        pageSize: this.pageSize
      };
      this.getSmartList(options);
    },
    //根据关键词搜索
    searchList() {
      let options = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        devName: this.search,
        typeId: this.typeId
      };
      this.getSmartList(options);
    },
    //根据选中得到分类搜索
    selectList(typeId) {
      let options = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        devName: this.search,
        typeId: typeId
      };
      this.getSmartList(options);
    },
    //跳转到新增页面
    addRecommend() {
      this.$router.push("/operat/productList");
    },
    //取消推荐
    cancelRecommend(index, row) {
      console.log(row);
      let options = {
        userId: this.userId,
        id: row.id,
        status: 0,
      };
      //执行修改
      updateSmart(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          let options = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            typeId: this.typeId
          };
          this.getSmartList(options);
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" >
.recommend {
  padding: 0 40px 80px;
  .recommend-edit {
    padding: 25px 0;
    .el-input__inner:focus {
      border-color: rgba(118, 112, 217, 1) !important;
    }
    .recommend-add {
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
  .pagination {
    text-align: right;
    margin: 50px 0;
  }
}
</style>
