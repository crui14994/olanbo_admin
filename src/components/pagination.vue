<template>
  <div class="pagination">
    <el-pagination
      background
      layout="pager, prev,next"
      :total="total"
      @current-change="currentChange"
      :pager-count="pagerCount"
      prev-text="上一页"
      next-text="下一页"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    //总页数
    total: {
      type: Number,
      required: true
    },
    //页码按钮的数量
    pagerCount: {
      type: Number,
      required: true
    }
  },
  name: "pagination",
  data() {
    return {};
  },
  methods: {
    currentChange(index) {
      this.$emit('getChange', index);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss">
.pagination {
  
  .el-pager {
    > li {
      width: 40px;
      height: 40px;
      padding: 0;
      line-height: 40px;
      background: rgba(238, 238, 238, 1);
    }
    > li:not(.disabled):hover {
      color: #7670d9 !important;
    }
    > li:not(.disabled).active {
      background-color: #7670d9 !important;
      color: #fff !important;
    }
  }
  .btn-prev,
  .btn-next {
    > span {
      width: 90px;
      height: 40px;
      line-height: 40px;
      color: #7670d9;
      background: rgba(255, 182, 0, 0);
      border: 1px solid rgba(118, 112, 217, 1);
    }
    > span:hover {
      background: #7670d9;
      color: #fff;
    }
  }
}
</style>
