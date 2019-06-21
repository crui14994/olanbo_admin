<template>
  <div class="layout">
    <el-container>
      <!-- 侧边导航 -->
      <el-aside width="250px">
        <el-row class="tac">
          <el-col :span="24">
            <!-- logo -->
            <div class="logo-wrapper">
              <img src="@/assets/logo.png">
            </div>
            <el-menu
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              background-color="#3C3C50"
              text-color="#b6b6b6"
              active-text-color="#96BEFF"
              router
              unique-opened
              default-active="/home"
            >
              <el-submenu :index="item.path" v-for="(item,index) in operatMenu" :key="index">
                <template slot="title">
                  <i class="iconfont" :class="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
                <el-menu-item
                  :index="sub_item.path"
                  v-for="(sub_item,sub_index) in item.children"
                  :key="sub_index"
                >{{sub_item.title}}</el-menu-item>
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
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item>当前位置：</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/' }">运营系统</el-breadcrumb-item>
              <el-breadcrumb-item>网站文案管理</el-breadcrumb-item>
              <el-breadcrumb-item>首页管理</el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <div class="main-container">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import headerNav from '@/components/header';

export default {
  name: "layout",
  components:{
    headerNav
  },
  data() {
    return {
      // 运营系统菜单数据
      operatMenu: [
        {
          path: "/operat",
          title: "网站文案管理",
          icon: "icon-wenjian",
          children: [
            { path: "/home", title: "首页管理" },
            { path: "/product", title: "智能产品" },
            { path: "/plan", title: "解决方案" },
            { path: "/case", title: "成功案例" },
            { path: "/cooperate", title: "招商合作" },
            { path: "/about", title: "关于我们" }
          ]
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
      ]
    };
  },
  created() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
      .el-menu-vertical-demo {
        border: none;
        > li {
          padding-left: 10px;
          .el-submenu__title {
            font-size: 16px;
            border-radius: 50px 0 0 50px;
            text-align: left;
            > i:first-child {
              font-size: 20px;
              padding: 0 20px;
              color: #fff;
            }
            > span {
              /* padding: 0 0px 0 20px; */
              color: #fff;
            }
          }
          .el-submenu__title:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
          > ul {
            > li {
              padding-left: 60px !important;
            }
            > li:hover {
              background-color: #3c3c50 !important;
              color: #96beff !important;
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
    }
    .el-main{
      padding: 0px  70px 0;
      .breadcrumb{
        padding: 30px 0;
      }
    }
  }
}
</style>
