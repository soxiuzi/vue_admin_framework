<template>
  <div class="login">
    <a-layout id="login_layout">
      <h1>系统载入中......</h1>
      <!-- <a-layout-content id="login_content">
        <span class="title">账户登录</span>
        <div class="hr"></div>
        <div class="userinfo">
          <a-input class="username" v-model="userInfo.username" placeholder="用户名"></a-input>
          <a-input class="password" type="password" v-model="userInfo.password" placeholder="密码"></a-input>
          <a-button :size="btnSize" type="primary" class="login-btn" @click="login">登录</a-button>
          <router-link
            style="color: #1890FF; font-size: 16px; margin-top: 19px; float: right"
            :to="{ name: 'register' }"
          >快速注册</router-link>
        </div>
        <a-form>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名：">
            
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="密码：">
            
          </a-form-item>
          <third-login class="login_method"></third-login>
        </a-form>
      </a-layout-content>-->
    </a-layout>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import ThirdLogin from "_com/ThirdLogin";
import { register, loginByUserName } from "_api/login";
import { constants } from 'crypto';
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { ThirdLogin },
  data() {
    //这里存放数据
    return {
      btnSize: "large",
      userInfo: {
        username: "", // 用户名
        password: "" // 密码
      },
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
      // 注册
      // register(this.username, this.password).then(res => {
      //   console.log('注册结果：', res)
      // })
      // 登录
      // loginByUserName(this.username, this.password).then(res => {
      //   console.log('登录结果：', res)
      // })
      // this.$router.push({
      //   name: "index"
      // });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    let token = this.$store.getters.token;
    if (!token) {
      this.$store.dispatch("LoginByUsername").then(res => {
        res && this.$router.push({ name: "index" });
      });
    }
  },
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
  h1 {
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 0 5px #000;
  }
  // background: linear-gradient(#aba7bf, #312865);
  background: url("../../assets/login/bj.png") no-repeat;
  .ant-layout-content {
    display: flex;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 50px;
    flex-direction: column;
    // background: #ffffff;
    margin: 0 15% 0 65%;
    .userinfo {
      .username {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
      .password {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
    .title {
      text-align: left;
      font-size: 20px;
      color: #1890ff;
    }
    .hr {
      width: 50px;
      height: 4px;
      background: #1890ff;
      margin-bottom: 49px;
    }
    .login-btn {
      width: 100%;
      font-size: 18px;
      margin-top: 30px;
    }
  }
  .login_layout {
    background: transparent;
    .login_content {
      background-color: transparent;
    }
  }
  .login_method {
    margin-top: 20px;
  }
}
</style>