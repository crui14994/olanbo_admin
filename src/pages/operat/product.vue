<template>
  <div class="product">
    <!-- //顶部操作 -->
    <el-row class="product-edit">
      <!-- search -->
      <el-col :span="9">
        <div class="grid-content bg-purple">
          <el-input autosize prefix-icon="el-icon-search" placeholder="输入关键词" v-model="input3">
            <el-button class="edit-serach" slot="append">搜索</el-button>
          </el-input>
        </div>
      </el-col>
      <!-- select -->
      <el-col :span="7" :offset="3">
        <div class="grid-content bg-purple-light edit-select">
          <el-form>
            <el-form-item label="分类">
              <el-select v-model="classify" placeholder="请选择分类">
                <el-option class="edit-serach-option" label="全部" value="0"></el-option>
                <el-option label="照明" value="1"></el-option>
                <el-option label="电工" value="2"></el-option>
                <el-option label="家电" value="3"></el-option>
                <el-option label="安防/传感器" value="4"></el-option>
                <el-option label="网关/控制" value="5"></el-option>
                <el-option label="智能仪表" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <!-- add -->
      <el-col :span="3" :offset="2">
        <div class="product-add">
          <el-button class="edit-add" icon="iconfont icon-xinzeng">&nbsp;新增推荐</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="title" label="名称"></el-table-column>
      <el-table-column prop="category" label="分类"></el-table-column>
      <el-table-column prop="date" label="更新时间" width="180"></el-table-column>
      <el-table-column prop="imgUrl" label="缩略图" width="140">
         <template slot-scope="scope">
          <el-image :lazy="true" :src="scope.row.imgUrl" fit="scale-down"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="user" label="发布人" width="120"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <span>取消推荐</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "product",
  data() {
    return {
      input3: "",
      //搜索
      search: "",
      //分类
      classify: "",
      tableData: [
        {
          id: "0",
          title: "上海市普陀区金沙江路 1518 弄",
          category: "王小虎",
          date: "2016-05-04",
          imgUrl: "",
          user: "admin"
        }
      ]
    };
  },
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss" >
.product {
  padding: 0 40px;
  .product-edit {
    padding: 25px 0;
    .el-input__inner:focus {
      border-color: rgba(118, 112, 217, 1) !important;
    }
    .product-add {
      text-align: right;
    }
    .edit-select{

    }
    .edit-serach,.edit-add {
      background: rgba(118, 112, 217, 1);
      color: #fff;
      border-color: rgba(118, 112, 217, 1) !important;
    }
  }
}
</style>
