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
            <el-menu
              :default-active="activeIndex"
              class="el-menu-vertical-demo layout-menu"
              @open="handleOpen"
              @close="handleClose"
              @select="handleSelect"
              background-color="#3C3C50"
              text-color="#b6b6b6"
              active-text-color="#96BEFF"
              unique-opened
              router
            >
              <!-- 网站文案管理 -->
              <el-submenu class="menu-box01" :index="'/operat'">
                <template slot="title">
                  <i class="iconfont icon-wenjian"></i>
                  <span>网站文案管理</span>
                </template>
                <!-- 首页管理 -->
                <el-submenu class="menu-box02" :index="'/operat/web'">
                  <template slot="title">首页管理</template>
                  <el-menu-item :index="'/web/home/banner'">banner管理</el-menu-item>
                  <el-menu-item :index="'/web/home/video'">视频管理</el-menu-item>
                  <el-menu-item :index="'/web/home/recommend'">推荐单品选择</el-menu-item>
                </el-submenu>
                <!-- 智能产品 -->
                <el-menu-item :index="'/web/productList'">智能产品</el-menu-item>
                <!-- 解决方案 -->
                <el-menu-item :index="'/web/solutionList'">解决方案</el-menu-item>
                <!-- 成功案例 -->
                <el-menu-item :index="'/web/exampleList'">成功案例</el-menu-item>
                <!-- 用户留言 -->
                <el-menu-item :index="'/web/webMsg'">用户留言</el-menu-item>
                <!-- 合作申请 -->
                <el-menu-item :index="'/web/coopMsg'">合作申请</el-menu-item>
              </el-submenu>

              <!-- 订单物流管理 -->
              <el-submenu class="menu-box01" :index="'/order'">
                <template slot="title">
                  <i class="iconfont icon-icon-aobi_dingdanwuliuon"></i>
                  <span>订单物流管理</span>
                </template>
              </el-submenu>

              <!-- 开发者资质认证 -->
              <el-submenu class="menu-box01" :index="'/developers'">
                <template slot="title">
                  <i class="iconfont icon-zizhi"></i>
                  <span>开发者资质认证</span>
                </template>
              </el-submenu>

              <!-- 开发者账号管理 -->
              <el-submenu class="menu-box01" :index="'/account'">
                <template slot="title">
                  <i class="iconfont icon-tubiao39"></i>
                  <span>开发者账号管理</span>
                </template>
              </el-submenu>

              <!-- 代理商管理 -->
              <el-submenu class="menu-box01" :index="'/agent'">
                <template slot="title">
                  <i class="iconfont icon-ziyuan"></i>
                  <span>代理商管理</span>
                </template>
              </el-submenu>
            </el-menu>
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
            <breadcrumb :list="list"></breadcrumb>
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

export default {
  name: "layout",
  components: {
    headerNav,
    breadcrumb
  },
  data() {
    return {
      //当前显示的导航状态
      activeIndex: "",
      list: [] //面包屑数组
    };
  },
  computed: {},
  watch: {
    $route(to, from) {
      this.activeIndex = to.path;
    }
  },
  created() {
    this.activeIndex = this.$route.path;
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
    }
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
