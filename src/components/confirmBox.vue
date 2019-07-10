<template>
  <div class="confirm-box">
    <el-dialog title="温馨提示" :visible.sync="deleteDialogVisible" width="30%" :before-close="handleClose" center>
      <span>您确定要删除id为{{deleteId}}的图片吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="okSend">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "confirmBox",
  props: {
    deleteDialogVisible: {
      type: Boolean,
      required: true
    },
    deleteId:{
      type: Number,
      required: true
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleClose(done) {
      this.$emit("cancel");
    },
    okSend() {
      this.$emit("confirm");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang = "scss">
.confirm-box {
  .el-dialog__wrapper {
    .el-dialog {
      width: 390px !important;
      position: relative;
      left: 7%;
      top: 20%;
    }
  }
}
</style>
