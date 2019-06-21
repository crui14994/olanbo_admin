<template>
  <div class="home">
    <!-- 选择栏目分类 -->
    <div class="home-classify">
      <el-row :gutter="30">
        <el-col :span="5">
          <div class="grid-content bg-purple" @click="classifyToggle('banner')">
            <p>banner</p>
            <p>图片管理</p>
            <p>
              <span>+</span>
            </p>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple" @click="classifyToggle('videoBox')">
            <p>视频</p>
            <p>视频管理</p>
            <p>
              <span>+</span>
            </p>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple" @click="classifyToggle('itemBox')">
            <p>优质单品推荐</p>
            <p>推荐单品选择</p>
            <p>
              <span>+</span>
            </p>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple" @click="classifyToggle('graphicBox')">
            <p>图文推送</p>
            <p>相关文案管理</p>
            <p>
              <span>+</span>
            </p>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple" @click="classifyToggle('caseBox')">
            <p>成功案例</p>
            <p>图文编辑</p>
            <p>
              <span>+</span>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>

    <component v-bind:is="currentTabComponent"></component>
    
  </div>
</template>

<script>
import banner from "@/components/home/banner";
import videoBox from "@/components/home/videoBox";
import itemBox from "@/components/home/itemBox";
import graphicBox from "@/components/home/graphicBox";
import caseBox from "@/components/home/caseBox";

export default {
  name: "home",
  components: {
    banner,
    videoBox,
    itemBox,
    graphicBox,
    caseBox
  },
  data() {
    return {
      currentTabComponent:"banner"
    };
  },
  methods:{
    // 栏目分类
    classifyToggle(componentName){
      this.currentTabComponent=componentName;
    }
  }
};
</script>

<style  lang = "scss" scoped>
/* classify的颜色设定 */
$color1: #7670d9;
$color2: #4c9ecd;
$color3: #d970d0;
$color4: #5AC4B6;
$color5: #d9707f;

.home {
  .home-classify {
    .el-col-5{
      width: 20%;
    }
    .grid-content {
      background-color: #fff;
      padding: 20px 30px;
      > p:first-child {
        color: #6b6b6b;
        font-size: 14px;
      }
      > p:nth-child(2) {
        font-size: 24px;
        font-weight: bold;
        padding: 30px 0 20px;
      }
      > p:last-child {
        text-align: center;
        > span {
          display: inline-block;
          width: 160px;
          height: 40px;
          line-height: 40px;
          border-radius: 10px;
          font-size: 30px;
        }
      }
    }
    > div {
      > div:nth-child(1) {
        .grid-content {
          > p:nth-child(2) {
            color: $color1;
          }
          > p:last-child {
            > span {
              border: solid 1px $color1;
              color: $color1;
            }
          }
        }
      }
      > div:nth-child(2) {
        .grid-content {
          > p:nth-child(2) {
            color: $color2;
          }
          > p:last-child {
            > span {
              border: solid 1px $color2;
              color: $color2;
            }
          }
        }
      }
      > div:nth-child(3) {
        .grid-content {
          > p:nth-child(2) {
            color: $color3;
          }
          > p:last-child {
            > span {
              border: solid 1px $color3;
              color: $color3;
            }
          }
        }
      }
      > div:nth-child(4) {
        .grid-content {
          > p:nth-child(2) {
            color: $color4;
          }
          > p:last-child {
            > span {
              border: solid 1px $color4;
              color: $color4;
            }
          }
        }
      }
      > div:nth-child(5) {
        .grid-content {
          > p:nth-child(2) {
            color: $color5;
          }
          > p:last-child {
            > span {
              border: solid 1px $color5;
              color: $color5;
            }
          }
        }
      }
    }
  }
  
}
</style>
