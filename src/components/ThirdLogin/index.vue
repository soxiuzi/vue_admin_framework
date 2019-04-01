<template>
  <div class="third_login">
    <span>第三方登录：</span>
    <div v-for="(svg, index) in loginMethod" :key="index">
      <div
        class="login_method"
        :title="svg.title"
        :ref="svg.type"
        @click="test(svg.type)"
        :data-type="svg.type"
      >
        <svg-icon :style="{fontSize: fontSize}" :icon-class="svg.iconClass"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    fontSize: {
      type: String,
      default: "30px"
    }
  },
  data() {
    //这里存放数据
    return {
      loginMethod: [
        {
          title: "QQ登录",
          type: "QQ",
          iconClass: "qq",
          value: "qq"
        },
        {
          title: "微博登录",
          type: "SINA",
          iconClass: "sina",
          value: "sina"
        },
        {
          title: "微信登录",
          type: "WECHAT",
          iconClass: "wechat",
          value: "wechat"
        }
      ]
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    test(type) {
      let that = this;
      // const method = {
      //   QQ: that.$store.dispatch('QQLogin'),
      //   SINA: that.$store.dispatch('SinaLogin'),
      //   WECHAT: 
      // }
      console.log("类型：", type);
      //   console.log("第三方登录", this.$refs.type);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
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
.third_login {
  display: flex;
  justify-content: center;
  align-items: center;
  .login_method {
    cursor: pointer;
    margin-left: 15px;
  }
}
</style>