<template>
  <div class="login">
    <a-layout id="login_layout">
      <a-layout-content id="login_content">
        <span class="title">账户登录</span>
        <a-form>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名：">
            <a-input placeholder="请输入用户名"></a-input>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="密码：">
            <a-input placeholder="请输入密码"></a-input>
          </a-form-item>
          <third-login></third-login>
          <a-button :size="btnSize" type="primary" class="login_btn" @click="login">登录</a-button>
        </a-form>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import ThirdLogin from "_com/ThirdLogin";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { ThirdLogin },
  data() {
    //这里存放数据
    return {
      btnSize: "large",
      labelCol: {
        span: 4,
        offset: 6
      },
      wrapperCol: {
        span: 4
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    login() {
      this.$router.push({
        name: "index"
      });
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
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(#aba7bf, #312865);
  .login_layout {
    background: transparent;
    .login_content {
      background-color: transparent;
    }
  }
  .title {
    display: block;
    font-size: 26px;
    margin-bottom: 10px;
  }
  .login_btn {
    margin-left: 240px;
  }
}
</style>