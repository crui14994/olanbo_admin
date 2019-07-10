<template>
  <div class="hello">
    <div class="user-message">
      <div class="user-img">
        <img src="https://www.olanboa.com/images/logo@2x.png" alt>
      </div>
      <span>
        {{userId}}
      </span>
    </div>
    <ul class="header-nav">
      <li class="nav-active">
        <div>
          <i class="iconfont icon-yunying"></i>
          <span>运营系统</span>
        </div>
      </li>
      <li>
        <div>
          <i class="iconfont icon-baobiaotongji"></i>
          <span>报表统计</span>
        </div>
      </li>
      <li>
        <div>
          <i class="iconfont icon-fangqiuzhiyepeiyangzhuanhuan"></i>
          <span>用户系统</span>
        </div>
      </li>
      <li>
        <div>
          <i class="iconfont icon-tuichu"></i>
          <span>退出系统</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "headerNav",
  data() {
    return {};
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang = "scss">
.hello {
  height: 100%;
  position: relative;
  padding: 0 70px;
  .user-message {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    .user-img{
      width: 65px;
      height: 65px;
      display: inline-block;
      overflow: hidden;
      border-radius: 100%;
      background-color: #3c3c50;
      vertical-align: middle;
      margin-right: 10px;
    }
    >span{
      font-size: 16px;
      vertical-align: middle;
      color: #3C3C50;
    }
  }
  .header-nav {
    width: 50%;
    height: 100%;
    float: right;
    > li {
      width: 25%;
      height: 100%;
      float: left;
      text-align: center;
      position: relative;
      > div {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        padding: 15px;
        color: #3c3c50;
        opacity: 0.6;
        cursor: pointer;
        > i {
          font-size: 30px;
        }
        > span {
          display: block;
          font-size: 14px;
          margin-top: 7px;
        }
      }
    }
    .nav-active,
    > li:hover {
      > div {
        opacity: 1;
      }
    }
  }
}
</style>
