<template>
  <div class="banner">
      <!-- 资源方案 -->
    <div class="home-operation">
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="4" class="operation-active">
          <div class="grid-content">
            <span>所有上传</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <span>我的上传</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <span>添加上传</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <span>栏目管理</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <span>回收站</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="home-box">
      <el-table :data="tableData" border style="width: 100%">
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
    </div>
  </div>
</template>

<script>
export default {
  name: "banner",
  data() {
    return {
      tableData: [
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
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang = "scss">
.banner{
    .home-operation {
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
      .operation-active {
        .grid-content {
          > span {
            font-weight: bold;
            color: #7670d9;
          }
        }
      }
    }
  }
}
</style>
