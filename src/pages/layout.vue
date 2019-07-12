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
              default-active="/operat/web/banner"
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
              <el-submenu class="menu-box01" :index="item.path" v-for="(item,index) in operatMenu" :key="index">
                <template slot="title">
                  <i class="iconfont" :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-submenu :index="item02.path" class="menu-box02" v-for="(item02,index2) in item.childrenMenu" :key="index2">
                  <template slot="title">{{item02.title}}</template>
                  <el-menu-item :index="item03.path" v-for="(item03,index3) in item02.menuList" :key="index3">{{item03.title}}</el-menu-item>
                </el-submenu>
              </el-submenu>
              <!-- <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
              </el-menu-item>-->
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
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
            
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
      // 运营系统菜单数据
      operatMenu: [
        {
          path: "/operat",
          title: "网站文案管理",
          icon: "icon-wenjian",
          // 二级菜单
          childrenMenu: [
            {
              path: "/operat/web",
              title: "首页管理",
              menuList: [
                { path: "/operat/web/banner", title: "banner管理" },
                { path: "/operat/web/video", title: "视频管理" },
                { path: "/operat/web/recommend", title: "推荐单品选择" },
              ]
            },
            {
              path: "",
              title: "智能产品",
              menuList: [
              ]
            },
            {
              title: "成功案例",
              path: "",
              menuList: [
              ]
            },
            {
              title: "用户留言",
              path: "",
              menuList: [
              ]
            }
          ],
        },
        {
          path: "/order",
          title: "订单物流管理",
          icon: "icon-icon-aobi_dingdanwuliuon",
          children: []
        },
        {
          path: "/developers",
          title: "开发者资质认证",
          icon: "icon-zizhi",
          children: []
        },
        {
          path: "/account",
          title: "开发者账号管理",
          icon: "icon-tubiao39",
          children: []
        },
        {
          path: "/agent",
          title: "代理商管理",
          icon: "icon-ziyuan",
          children: []
        }
      ],
      list:[],//面包屑数组
    };
  },
  computed:{
    // list () {
    //   return this.$route.matched
    // }
  },
  created() {
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleSelect(key,keyPath){
     
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
      .el-menu{
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
</style>
