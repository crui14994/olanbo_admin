<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item> -->
      <el-breadcrumb-item v-for="(item,index) in list" :key="index">{{item.name}}</el-breadcrumb-item>
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
      this.list=[];
      this.getBreadcrumb();
    }
  },
  computed: {
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.pop().path.split("/");
      matched.forEach(item => {
        switch (item) {
          case "":
            this.list.push({name:"首页",path:"/operat/web/banner"});
            break;
          case "operat":
            this.list.push({name:"运营系统",path:"/operat/web/banner"});
            break;
          case "web":
            this.list.push({name:"网站文案管理",path:"/operat/web/banner"});
            this.list.push({name:"首页管理",path:"/operat/web/banner"});
            break;
           case "banner":
            this.list.push({name:"banner管理",path:"/operat/web/banner"});
            break;
            case "video":
            this.list.push({name:"视频管理",path:"/operat/web/video"});
            break;
            case "recommend":
            this.list.push({name:"推荐单品选择",path:"/operat/web/recommend"});
            break;
        }
      });
    }
  }
};
</script>