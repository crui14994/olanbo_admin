<template>
  <div class="Sidebar">
    <el-menu
      default-active="/home"
      class="el-menu-vertical-demo  layout-menu"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <!-- 一级循环路由 -->
      <div v-for="(item,index) in siderBarRouters.children" :key="index">
        <!-- 如果当前路由下有你子路由则用el-submenu -->
        <el-submenu v-show="!item.hidden" :index="item.path" v-if="item.children">
          <template slot="title">
            <i class="iconfont" :class="item.meta.icon"></i>
            <span>{{item.meta.title}}</span>
          </template>

          <!-- 二级循环路由 -->
          <div v-for="(item2,index2) in item.children" :key="index2">
            <el-submenu v-show="!item2.hidden" :index="item2.path" v-if="item2.children">
              <template slot="title">
                <span>{{item2.meta.title}}</span>
              </template>

              <!-- 三级循环路由 -->
              <div v-for="(item3,index3) in item2.children" :key="index3">
                <el-submenu v-show="!item3.hidden" :index="item3.path" v-if="item3.children">
                  <template slot="title">
                    <span>{{item3.meta.title}}</span>
                  </template>
                </el-submenu>
                <el-menu-item v-show="!item3.hidden" :index="item.path+'/'+item2.path+'/'+item3.path" v-if="!item3.children">{{item3.meta.title}}</el-menu-item>
              </div>
            </el-submenu>

            <el-menu-item  v-show="!item2.hidden" :index="item.path+'/'+item2.path" v-if="!item2.children">{{item2.meta.title}}</el-menu-item>
          </div>

        </el-submenu>
        <!-- 如果当前路由下没有你子路由则用el-menu-item -->
        <el-menu-item v-show="!item.hidden" :index="item.path" v-if="!item.children">
          <i class="iconfont" :class="item.meta.icon"></i>
          <span slot="title">{{item.meta.title}}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Sidebar",
  data() {
    return {
        // siderBarRouters:null
    };
  },
  computed: {
    ...mapGetters(["siderBarRouters"])
  },
  created() {
    
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Sidebar {
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
</style>
