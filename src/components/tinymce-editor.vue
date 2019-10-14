
<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" @onClick="onClick"></editor>
  </div>
</template>

<script>
import { getToken, QINIU_PARAMS } from "@/api/qiniu.js";
import { mapGetters } from "vuex";

import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/preview";
import "tinymce/plugins/paste";

// 扩展插件在此网站下载后按如下配置使用(http://tinymce.ax-z.cn/plugins/advlist.php)
import  "@/utils/tinymce/lineheight/lineheight.js"

export default {
  components: {
    Editor
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ""
    },
    plugins: {
      type: [String, Array],
      default: "link lists image code table lineheight  wordcount preview paste"
    },
    toolbar: {
      type: [String, Array],
      default:
        "preview | undo redo | bold italic underline strikethrough forecolor | fontsizeselect lineheight | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote  | link unlink image table | removeformat"
    }
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: process.env.BASE_URL === "/api/" ? "/static/tinymce/langs/zh_CN.js" : "/smartAdmin/static/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: process.env.BASE_URL === "/api/" ? "/static/tinymce/skins/ui/oxide" : "/smartAdmin/static/tinymce/skins/ui/oxide",
        height: 800,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        paste_auto_cleanup_on_paste : true,
        paste_remove_styles: true,
        paste_remove_styles_if_webkit: true,
        paste_strip_class_attributes: true,
        //图片上传处理函数
        images_upload_handler: (blobInfo, success, failure) => {
          let img = this.upImg(blobInfo);
          success(img);
        }
      },
      myValue: this.value
    };
  },
  mounted() {
    tinymce.init({});
  },
  computed: {
    //用户id
    ...mapGetters(["userId"])
  },
  methods: {
    //添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    //需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
    //上传图片
    async upImg(blobInfo) {
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      let filetype = blobInfo
        .filename()
        .split(".")
        .pop();
      // 获取token需要的参数
      let paramsObj = {
        fileName:
          "olanbo_pc_" +
          Date.parse(new Date()) +
          Math.floor(Math.random() * 100) +
          "." +
          filetype,
        userId: this.userId,
        deleteKey: " "
      };
      //获取token
      let tokenData = await getToken(paramsObj);
      const formdata = new FormData();
      formdata.append("file", blobInfo.blob());
      formdata.append("token", tokenData.data.data.token);
      formdata.append("key", paramsObj.fileName);
      //上传到七牛云
      let file = await this.axios.post(QINIU_PARAMS.domain, formdata, config);
      return "http://" + QINIU_PARAMS.qiniuaddr + "/" + file.data.key;

    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    }
  }
};
</script>
<style>
</style>