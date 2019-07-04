<template>
  <div class="banner">
    <!-- 操作 -->
    <div class="home-column">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="4" :class="{'column-active':showOperation=='allUpload'}">
          <div class="grid-content">
            <span @click="columnToggle('allUpload')">所有上传</span>
          </div>
        </el-col>
        <el-col :span="4" :class="{'column-active':showOperation=='myUpload'}">
          <div class="grid-content">
            <span @click="columnToggle('myUpload')">我的上传</span>
          </div>
        </el-col>
        <el-col :span="4" :class="{'column-active':showOperation=='addUpload'}">
          <div class="grid-content">
            <span @click="columnToggle('addUpload')">添加上传</span>
          </div>
        </el-col>
        <el-col :span="4" :class="{'column-active':showOperation=='column'}">
          <div class="grid-content">
            <span @click="columnToggle('column')">栏目管理</span>
          </div>
        </el-col>
        <el-col :span="4" :class="{'column-active':showOperation=='recycleBin'}">
          <div class="grid-content">
            <span @click="columnToggle('recycleBin')">回收站</span>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 所有上传 -->
    <div class="home-box" v-if="showOperation=='allUpload'">
      <el-table :data="allUpload" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="banner" label="banner 标题" width="360"></el-table-column>
        <el-table-column prop="date" label="更新时间" width="200"></el-table-column>
        <el-table-column prop="classify" label="类目"></el-table-column>
        <el-table-column prop="browse" label="浏览"></el-table-column>
        <el-table-column prop="permissions" label="权限"></el-table-column>
        <el-table-column prop="userName" label="发布人"></el-table-column>
        <el-table-column prop="edit" label="操作">
          <template>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <pagination :total="50" :pagerCount="5" @getChange="allUploadPagination"></pagination>
      </div>
    </div>
    <!-- 我的上传 -->
    <div class="home-box" v-if="showOperation=='myUpload'">
      <el-table :data="myUpload" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="banner" label="banner 标题" width="360"></el-table-column>
        <el-table-column prop="date" label="更新时间" width="200"></el-table-column>
        <el-table-column prop="classify" label="类目"></el-table-column>
        <el-table-column prop="browse" label="浏览"></el-table-column>
        <el-table-column prop="permissions" label="权限"></el-table-column>
        <el-table-column prop="userName" label="发布人"></el-table-column>
        <el-table-column prop="edit" label="操作">
          <template>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <pagination :total="20" :pagerCount="5" @getChange="myUploadPagination"></pagination>
      </div>
    </div>

    <!-- 添加上传 -->
    <div class="home-box" v-if="showOperation=='addUpload'">
      <el-form ref="form" :model="addUpload" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="addUpload.name"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="addUpload.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ID">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="addUpload.date1"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="addUpload.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="即时配送">
          <el-switch v-model="addUpload.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质">
          <el-checkbox-group v-model="addUpload.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="addUpload.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea" v-model="addUpload.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 栏目管理 -->
    <div class="home-box" v-if="showOperation=='column'">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="日期" width="120">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
    </div>
    <!-- 回收站 -->
    <div class="home-box" v-if="showOperation=='recycleBin'">
      <el-table :data="recycleBin" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="banner" label="banner 标题" width="360"></el-table-column>
        <el-table-column prop="date" label="更新时间" width="200"></el-table-column>
        <el-table-column prop="classify" label="类目"></el-table-column>
        <el-table-column prop="browse" label="浏览"></el-table-column>
        <el-table-column prop="permissions" label="权限"></el-table-column>
        <el-table-column prop="userName" label="发布人"></el-table-column>
        <el-table-column prop="edit" label="操作">
          <template>
            <el-button type="text" size="small">移除回收站</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-box">
        <pagination :total="20" :pagerCount="5" @getChange="recycleBinPagination"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/pagination";
import { mock } from "@/api/main.js";

export default {
  name: "banner",
  components: {
    pagination
  },
  data() {
    return {
      //当前显示的栏目
      showOperation: "allUpload",
      //所有上传
      allUpload: [
        {
          id: "01",
          banner: "某主题图片banner",
          date: "2019-06-17  16：18：23",
          classify: "banner",
          browse: "166",
          permissions: "开放浏览",
          userName: "admin",
          edit: ""
        },
        {
          id: "02",
          banner: "某主题图片banner",
          date: "2019-06-17  16：18：23",
          classify: "banner",
          browse: "166",
          permissions: "开放浏览",
          userName: "admin",
          edit: ""
        },
        {
          id: "03",
          banner: "某主题图片banner",
          date: "2019-06-17  16：18：23",
          classify: "banner",
          browse: "166",
          permissions: "开放浏览",
          userName: "admin",
          edit: ""
        },
        {
          id: "04",
          banner: "某主题图片banner",
          date: "2019-06-17  16：18：23",
          classify: "banner",
          browse: "166",
          permissions: "开放浏览",
          userName: "admin",
          edit: ""
        }
      ],
      //我的上传
      myUpload: [
        {
          id: "01",
          banner: "某主题图片banner",
          date: "2019-06-17  16：18：23",
          classify: "banner",
          browse: "166",
          permissions: "开放浏览",
          userName: "admin",
          edit: ""
        },
        {
          id: "02",
          banner: "某主题图片banner",
          date: "2019-06-17  16：18：23",
          classify: "banner",
          browse: "166",
          permissions: "开放浏览",
          userName: "admin",
          edit: ""
        }
      ],
      //添加上传
      addUpload: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      //栏目管理
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: [],
      //回收站
      recycleBin: [
        {
          id: "01",
          banner: "某主题图片banner",
          date: "2019-06-17  16：18：23",
          classify: "banner",
          browse: "166",
          permissions: "开放浏览",
          userName: "admin",
          edit: ""
        },
        {
          id: "02",
          banner: "某主题图片banner",
          date: "2019-06-17  16：18：23",
          classify: "banner",
          browse: "166",
          permissions: "开放浏览",
          userName: "admin",
          edit: ""
        }
      ]
    };
  },
  created() {
    let paramsObj = {
      fileName: "key",
      userId: 1
    };
    mock(paramsObj)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    //切换栏目点击事件
    columnToggle(name) {
      this.showOperation = name;
    },
    //所有上传分页事件
    allUploadPagination(index) {
      //index为要显示的页面id
      console.log(index);
    },
    //我的上传分页事件
    myUploadPagination(index) {
      //index为要显示的页面id
      console.log(index);
    },
    //添加上传
    onSubmit() {
      console.log("submit!");
    },
    //栏目管理
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //回收站分页事件
    recycleBinPagination(index) {
      //index为要显示的页面id
      console.log(index);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang = "scss">
.banner {
  .home-column {
    padding: 20px 0;
    .row-bg {
      > div {
        .grid-content {
          width: 100%;
          text-align: center;
          > span {
            display: inline-block;
            width: 80%;
            height: 60px;
            line-height: 60px;
            font-size: 16px;
            background: rgba(255, 255, 255, 1);
            color: #6b6b6b;
            cursor: pointer;
          }
        }
      }
      .column-active {
        .grid-content {
          > span {
            font-weight: bold;
            color: #7670d9;
          }
        }
      }
    }
  }
  .home-box {
    .pagination-box {
      padding: 20px 0;
      float: right;
    }
  }
}
</style>
