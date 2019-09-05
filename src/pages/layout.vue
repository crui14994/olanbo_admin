<template>
  <div class="layout">
    <el-container>
      <!-- 侧边导航 -->
      <el-aside width="250px" style="z-index:2003">
        <el-row class="tac">
          <el-col :span="24">
            <!-- logo -->
            <div class="logo-wrapper">
              <img src="@/assets/logo.png" />
            </div>
            <!-- 侧边导航栏 -->
            <sidebar></sidebar>
          </el-col>
        </el-row>
      </el-aside>
      <el-container class="container">
        <!-- 头部 -->
        <el-header class="header-box">
          <header-nav></header-nav>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <!-- //面包屑 -->
          <div class="breadcrumb">
            <breadcrumb></breadcrumb>
          </div>

          <div class="main-container">
            <!-- <keep-alive> -->
            <router-view></router-view>
            <!-- </keep-alive> -->
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import headerNav from "@/components/header";
import breadcrumb from "@/components/breadcrumb";
import sidebar from "@/components/sidebar";

export default {
  name: "layout",
  components: {
    headerNav,
    breadcrumb,
    sidebar
  },
  data() {
    return {
      
    };
  },
  computed: {},
  watch: {
    $route(to, from) {
      // this.navStatus(to);
    }
  },
  created() {
    // this.navStatus(this.$route);
  },
  methods: {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang = "scss">
.layout {
  .el-aside {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    text-align: center;
    background: #3c3c50;
    z-index: 10;
    .tac {
      .logo-wrapper {
        padding: 25px 0;
      }
      .el-menu {
        border: none;
      }
      .layout-menu {
        .menu-box01 {
          padding-left: 10px;
          > .el-submenu__title {
            font-size: 16px;
            border-radius: 50px 0 0 50px;
            text-align: left;
            > i:first-child {
              font-size: 20px;
              padding: 0 20px;
              color: #fff;
            }
            > span {
              color: #fff;
            }
          }
          > .el-submenu__title:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          .el-menu-item:hover {
            background-color: none !important;
          }
          .menu-box02 {
            > .el-submenu__title {
              font-size: 14px;
              padding-left: 85px !important;
              text-align: left;
              height: 40px;
              line-height: 40px;
              > i:first-child {
                display: none;
              }
            }
            > .el-submenu__title:hover {
              background: none !important;
            }
            > ul {
              > li {
                height: 30px;
                line-height: 30px;
                padding-left: 100px !important;
                text-align: left;
                font-size: 12px;
              }
              > li:hover {
                background: none !important;
              }
              > li:before {
                content: "·";
                display: inline-block;
                font-size: 30px;
                vertical-align: middle;
                padding-right: 5px;
              }
            }
          }
        }
      }
    }
  }
  .container {
    width: 100%;
    padding-left: 250px;
    padding-top: 100px;
    position: relative;
    .header-box {
      height: 100px !important;
      padding: 0;
      width: 100%;
      padding-left: 250px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      right: 0;
      z-index: 2000;
    }
    .el-main {
      padding: 0px 70px 0;
      .breadcrumb {
        padding: 30px 0;
      }
    }
  }
}
.el-loading-mask {
  z-index: 2010 !important;
}
</style>
