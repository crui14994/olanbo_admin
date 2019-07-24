<template>
  <div class="breadcrumb-list">
    <span class="now-address">当前位置：</span>
    <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block;vertical-align: middle;">
      <el-breadcrumb-item  v-for="(item,index) in list" :to="{ path: item.path }" :key="index">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  watch: {
    $route() {
      this.list = [];
      this.getBreadcrumb();
    }
  },
  computed: {},
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched;
      matched = [{ path: "/", meta: { title: "运营系统" } }].concat(matched);
      this.list = matched;
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
