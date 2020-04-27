<template>
  <div class="Sidebar">
    <el-row>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo el-menu01"
        @open="handleOpen"
        @close="handleClose"
        background-color="#3C3C50"
        text-color="#b6b6b6"
        active-text-color="#96BEFF"
        unique-opened
        router
      >
        <!-- 一级循环路由 -->
        <div class="submenu01" v-for="(item,index) in siderBarRouters.children" :key="index">
          <!-- 如果当前路由下有子路由则用el-submenu -->
          <el-submenu
            class="submenu01-div"
            v-show="!item.hidden"
            :index="item.path"
            v-if="item.children"
          >
            <template slot="title">
              <i class="iconfont" :class="item.meta.icon"></i>
              <span>{{item.meta.title}}</span>
            </template>

            <!-- 二级循环路由 -->
            <div class="submenu02" v-for="(item2,index2) in item.children" :key="index2">
              <el-submenu
                class="submenu02-div"
                v-show="!item2.hidden"
                :index="item2.path"
                v-if="item2.children"
              >
                <template slot="title">
                  <span>{{item2.meta.title}}</span>
                </template>

                <!-- 三级循环路由 -->
                <div class="submenu03" v-for="(item3,index3) in item2.children" :key="index3">
                  <el-submenu v-show="!item3.hidden" :index="item3.path" v-if="item3.children">
                    <template slot="title">
                      <span>{{item3.meta.title}}</span>
                    </template>
                  </el-submenu>
                  <el-menu-item
                    v-show="!item3.hidden"
                    :index="item.path+'/'+item2.path+'/'+item3.path"
                    v-if="!item3.children"
                  >{{item3.meta.title}}</el-menu-item>
                </div>
              </el-submenu>

              <el-menu-item
                v-show="!item2.hidden"
                :index="item.path+'/'+item2.path"
                v-if="!item2.children"
              >{{item2.meta.title}}</el-menu-item>
            </div>
          </el-submenu>
          <!-- 如果当前路由下没有你子路由则用el-menu-item -->
          <el-menu-item
            class="submenu01-li"
            v-show="!item.hidden"
            :index="item.path"
            v-if="!item.children"
          >
            <i class="iconfont" :class="item.meta.icon"></i>
            <span slot="title">{{item.meta.title}}</span>
          </el-menu-item>
        </div>
      </el-menu>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Sidebar",
  data() {
    return {
      //当前显示的导航
      activeIndex: ""
    };
  },
  watch: {
    $route(to, from) {
      this.activeIndex = to.path;
    }
  },
  computed: {
    ...mapGetters(["siderBarRouters"])
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.Sidebar {
  .el-menu01 {
    border: none;
    background: none;
    //一级路由样式
    .submenu01 {
      font-size: 16px;
      padding-left: 10px;
      .iconfont {
        font-size: 20px;
        color: aliceblue;
        display: inline-block;
        padding: 0px 25px 0 15px;
      }
      .submenu01-li {
        border-radius: 30px 0px 0px 30px;
        text-align: left;
        color: aliceblue !important;
        > span {
          font-size: 16px;
        }
      }
      > .is-active {
        background: none !important;
      }
      .submenu01-li:hover {
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      .submenu01-div {
        text-align: left;
        > .el-submenu__title {
          border-radius: 30px 0px 0px 30px;
          color: aliceblue !important;
          > span {
            font-size: 16px;
          }
        }
        > .el-submenu__title:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
      }
      //二级路由样式
      .submenu02 {
        padding-left: 45px;
        .submenu02-div {
          > .el-submenu__title:hover {
            background-color: rgba(255, 255, 255, 0) !important;
            color: #96beff !important;
          }
        }
        > .is-active {
          background: none !important;
        }
        > li:hover {
          background-color: rgba(255, 255, 255, 0) !important;
          color: #96beff !important;
        }
        //三级路由样式
        .submenu03 {
          > li {
            height: 35px;
            line-height: 30px;
          }
          > li:hover {
            background-color: rgba(255, 255, 255, 0) !important;
            color: #96beff !important;
          }
          > li:before {
            content: "·";
            height: 30px;
            vertical-align: middle;
            margin-right: 5px;
            font-size: 30px;
            // background: rgba(182, 182, 182, 1);
            // border-radius: 50%;
            display: inline-block;
          }
        }
      }
    }
    .submenu01 {
      > .is-active {
        background: none !important;
      }
    }
  }
}
</style>
