<template>
  <div class="login">
      {{$store.state.user.userId}}
  </div>
</template>

<script>

export default {
  name: "login",
  components: {
  },
  computed:{
  
  },
  data() {
    return {
    };
  },
  created() {
    this.login();
  },
  methods: {
    //登陆
    login(){
      let userInfo = {
        userName:"admin",
        mobile:"17654265875",
        passWord:"admin"
      }
      this.$store.dispatch("login",userInfo).then(res=>{
        this.$message({
          message: '登录成功！',
          type: 'success'
        });
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss" scoped>

</style>
