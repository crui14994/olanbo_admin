<template>
  <div class="login">
      {{userId}}
  </div>
</template>

<script>
import {userLogin } from "@/api/user.js";

export default {
  name: "login",
  components: {
  },
  computed:{
    userId(){
      return this.$store.state.userId;
    }
  },
  data() {
    return {
    };
  },
  created() {
    this.login();
    console.log(this.userId)
  },
  methods: {
    //登陆
    login(){
      userLogin("admin","17341055894","admin").then(res=>{
        console.log(res)
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" scoped>

</style>
