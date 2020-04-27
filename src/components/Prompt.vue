<template></template>
<script>
export default {
  mounted() {
    this.$alert("暂未开放...", "提示", {
      confirmButtonText: "确定"
      // callback: action => {
      //   this.$message({
      //     type: "info",
      //     message: `action: ${action}`
      //   });
      // }
    });
  }
};
</script>