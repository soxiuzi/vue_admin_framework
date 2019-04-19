<template>
  <div class="edit">
    <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick"></editor>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/plugins/image";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Editor
  },
  props: {
    height: {
      type: Number,
      default: 300
    },
    value: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: "lists, image, media table wordcount"
    },
    toolbar: {
      type: [String, Array],
      default:
        "undo redo | formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist ourdent indent | lists image media table | removeformat"
    }
  },
  data() {
    //这里存放数据
    return {
      init: {
        language_url: "/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: "/tinymce/skins/ui/oxide",
        height: this.height,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        images_upload_handler: (blobInfo, success, failure) => {
          const img = "data:image/jpeg;base64," + blobInfo.base64();
          success(img);
        }
      },
      myValue: this.value
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit("input", newValue, tinymce.activeEditor.getContent({ 'format' : 'text' }));
    }
  },
  //方法集合
  methods: {
    onClick(e) {
      var activeEditor = tinymce.activeEditor;
      var editBody = activeEditor.getBody();
      activeEditor.selection.select(editBody);
      var text = activeEditor.selection.getContent({ format: "text" });
      this.$emit(
        "onClick",
        e,
        text
      );
    },
    clear() {
      this.myValue = "";
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    tinymce.init({});
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>