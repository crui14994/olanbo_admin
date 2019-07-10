<template>
  <div class="regist">
      regist
  </div>
</template>

<script>
import {userRegist } from "@/api/user.js";

export default {
  name: "regist",
  components: {
  },
  data() {
    return {
    };
  },
  created() {
    this.regist();
  },
  methods: {
    //注册
    regist(){
      userRegist("456789","哈哈哈哈","admin","17895465824","4561423").then(res=>{
        console.log(res)
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" scoped>

</style>
