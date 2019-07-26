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
        <div class="product-list-add">
          <el-button class="edit-add" icon="iconfont icon-xinzeng" @click="addProduct">&nbsp;新增产品</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="id" width="80" align="center"></el-table-column>
      <el-table-column prop="devName" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="status" label="推荐状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status ==0 ? '否' :'是'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="logoPath" label="缩略图" width="140" align="center">
        <template slot-scope="scope">
          <el-image :lazy="true" :src="scope.row.logoPath" fit="scale-down"></el-image>
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
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-row class="table-btns">
            <el-col :span="8">
              <el-button style="color:rgba(118,112,217,1);" size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </el-col>
            <el-col :span="8">
              <el-button style="color:#6b6b6b;" size="mini" @click="_deleteSmart(scope.$index, scope.row)" type="text">删除</el-button>
            </el-col>
            <el-col :span="8">
              <el-button v-if="scope.row.status==1" size="mini" type="text">已推荐</el-button>
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
import { smartList, updateSmart, deleteSmart,devPage } from "@/api/devs.js";
import pagination from "@/components/pagination";

export default {
  name: "productList",
  data() {
    return {
      //搜索
      search: "",
      //分类
      typeId: "",
      tableData: [],
      pageNum: devPage.PAGENUM, //分页当前页码
      pageSize: devPage.PAGESIZE, //分页查询中每页返回的总条数
      total: 0 //总共有多少条数据
    };
  },
  components: {
    pagination
  },
  created() {
    this.getSmartList();
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
  methods: {
    //删除
    _deleteSmart(index, row) {
      let options = {
        userId: this.userId,
        devId: row.id
      };
      deleteSmart(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.getSmartList();
          this.$message({
            message: "删除成功！",
            type: "success"
          });
        }
      });
    },
    //推荐
    recommend(index, row) {
      let options = {
        userId: this.userId,
        id: row.id,
        devName: row.devName,
        typeId: row.typeId,
        desc: row.desc,
        status: 1,
        htmlContent: row.htmlContent,
        linkUrl: row.linkUrl,
        logoPath: row.logoPath,
        key7: " "
      };
      //执行修改
      updateSmart(options).then(res => {
        let { code } = res.data;
        if (code == 200) {
          this.$message({
            message: "已推荐！",
            type: "success"
          });
          row.status = 1;
        }
      });
    },
    //编辑产品
    handleEdit(index, row) {
      this.$router.push({ path: '/web/productEdit', query: { item: JSON.stringify(row)}})
    },
    //新增产品
    addProduct() {
      this.$router.push("/web/productEdit/");
    },
    //根据传入参数的不同获取对应设备列表
    getSmartList() {
      let options = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        devName: this.search,
        typeId: this.typeId
      };
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
      this.pageNum = index;
      this.getSmartList();
    },
    //根据关键词搜索
    searchList() {
      this.getSmartList();
    },
    //根据选中得到分类搜索
    selectList(typeId) {
      this.typeId = typeId;
      this.getSmartList();
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
