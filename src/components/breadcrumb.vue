<template>
  <div class="breadcrumb-list">
    <span class="now-address">当前位置：</span>
     <el-breadcrumb separator="/" separator-class="el-icon-arrow-right" style="display: inline-block;vertical-align: middle;">
      <el-breadcrumb-item v-for="(item,index) in breadList" :key="index">
        <router-link :to="{ path: item.path }">{{item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  data() {
    return {
      breadList: []
    };
  },
  watch: {
    $route(to, from) {
      this.getBreadList();
    }
  },
  created() {
    this.getBreadList();
  },
  methods: {
    getBreadList() {
      this.breadList = [];
      this.$route.matched.forEach(item => {
        if (item.path === "") {
          item.path = "/";
        }
        this.breadList.push(item);
      });
      return this.breadList;
    }
  }
};
</script>

<style  lang = "scss" scopeds>
.breadcrumb-list{
  .now-address{
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
