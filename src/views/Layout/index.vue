<template>
  <div class="layout">
    <back-up :visible="loadVisible" :spinText="spinText"></back-up>
    <a-layout>
      <a-layout-sider :collapsed="collapsed">
        <div style="color: #fff; height: 70px" class="logo">logo区</div>
        <a-menu :defaultSelectedKeys="defaultSelectedKeys" mode="inline" theme="dark">
          <a-menu-item key="1">
            <router-link :to="{ name: 'welcome' }">
              <a-icon type="home"/>
              <span>首页</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link :to="{ name: 'majormanage' }">
              <a-icon type="database"/>
              <span>专业管理</span>
            </router-link>
          </a-menu-item>
          <!-- <a-menu-item key="3">
            <router-link :to="{ name: 'teachermanage' }">
              <a-icon type="pie-chart" />
              <span>教师管理</span>
            </router-link>
          </a-menu-item>-->
          <a-menu-item key="4">
            <router-link :to="{ name: 'coursemanage' }">
              <a-icon type="pie-chart"/>
              <span>课程管理</span>
            </router-link>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="mail"/>
              <span>题库管理</span>
            </span>
            <a-menu-item key="5">
              <router-link :to="{ name: 'questionmanage' }">题目管理</router-link>
            </a-menu-item>
            <!-- <a-menu-item key="6">
              <router-link :to="{ name: 'questionimport' }">题目导入</router-link>
            </a-menu-item>-->
            <a-menu-item key="7">
              <router-link :to="{ name: 'questionshare' }">题库共享</router-link>
            </a-menu-item>
            <a-menu-item key="8">
              <router-link :to="{ name: 'answermanage' }">答案管理</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="mail"/>
              <span>出题组卷管理</span>
            </span>
            <a-menu-item key="9">
              <router-link :to="{ name: 'papermanage' }">出题组卷管理</router-link>
            </a-menu-item>
            <a-menu-item key="10">
              <router-link :to="{ name: 'papermake' }">组卷一键生成</router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout-header
        :style="{ left: collapsed ? '80px' : '200px', width: collapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 200px)' }"
      >
        <a-button type="primary" @click="toggleCollapsed">
          <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold' "/>
        </a-button>
        <div>
          <a-dropdown>
            <div class="userInfo">
              <a-avatar :size="32" icon="user"/>
              <span class="username">管理员</span>
            </div>
            <a-menu slot="overlay">
              <a-menu-item>
                <router-link :to="{ name: 'login' }">登出</router-link>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout class="right_container" :style="{ 'margin-left': collapsed ? '80px' : '200px' }">
        <a-layout-content>
          <Header :explain="explain" :current-page="currentPage" v-if="indexPage"/>
          <div :class="currentPath == '/welcome' ? '' : 'content'">
            <transition
              name="fade"
              enter-active-class="lightSpeedIn"
              leave-to-class="flipOutX"
              mode="out-in"
            >
              <router-view class="animated"></router-view>
            </transition>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { PAGEBREAD } from "@/var/pageBread.js";
import Header from "_com/Header";
import BackUp from "_com/BackUp"
import { setTimeout } from "timers";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { Header, BackUp },
  data() {
    //这里存放数据
    return {
      transitionName: "",
      currentPath: "",
      explain: "",
      currentPage: "",
      defaultSelectedKeys: ["1"],
      collapsed: false,
      indexPage: false
    };
  },
  //监听属性 类似于data概念
  computed: {
    loadVisible() {
      return this.$store.getters.layoutStatus
    },
    spinText() {
      return this.$store.getters.loadText
    }
  },
  //监控data中的数据变化
  watch: {
    $route(to, from) {
      this.currentPath = to.path;
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
      to.path == "/welcome"
        ? (this.indexPage = false)
        : (this.indexPage = true);
    }
  },
  //方法集合
  methods: {
    logout() {
      this.$router.push({
        name: "login"
      });
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    // console.log('获取token：', this.$store.getter)
    // this.currentPath = this.$route.path;
    // console.log("当前路由：", this.currentPath);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.$route.path !== "/welcome") {
      this.$router.push({
        name: "welcome"
      });
    }
  },
  beforeCreate() {
    setTimeout(() => {
      if (this.$route.path !== "/welcome") {
        this.indexPage = true;
      } else {
        this.indexPage = false;
      }
    }, 200);
  }, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {
    PAGEBREAD.forEach(item => {
      if (document.title == item.title) {
        this.currentPage = item.title;
        this.explain = item.explain;
      }
    });
  }, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

.layout {
  .right_container {
    position: relative;
    transform: scale3d(1, 1, 1);
    transition: all 0.2s;
    .ant-layout-content {
      margin-top: 7vh;
      min-height: 93vh;
      .router {
        transition: all 0.5s ease;
      }
      .content {
        margin: 30px 30px 0 30px;
        // background: #fff;
      }
    }
  }
  .ant-layout-header {
    display: flex;
    position: fixed;
    top: 0;
    height: 7vh;
    color: #333333;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
    transition: all 0.2s;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    .username {
      margin-left: 10px;
    }
  }
  .ant-layout-sider {
    position: fixed;
    left: 0;
    height: 100vh;
  }
}
</style>