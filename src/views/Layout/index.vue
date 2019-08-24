<template>
  <div class="layout">
    <back-up
      :visible="loadVisible"
      :spinText="spinText"
    ></back-up>
    <a-layout>
      <a-layout-sider
        collapsedWidth="80"
        breakpoint="lg"
        @breakpoint="test"
        :collapsed="collapsed"
      >
        <div
          style="height: 64px"
          class="logo"
        >
          <h4>logo区</h4>
        </div>
        <a-menu
          :defaultSelectedKeys="defaultSelectedKeys"
          mode="inline"
          theme="dark"
          @select="selectMenu"
        >
          <a-menu-item key="1">
            <router-link :to="{ name: 'welcome' }">
              <a-icon type="home"></a-icon>
              <span>首页</span>
            </router-link>
          </a-menu-item>
          <template v-for="item in sidebarData">
            <a-menu-item
              v-if="!item.chhildren"
              :key="item.key"
            >
              <router-link :to="{name: item.path}">
                <a-icon :type="item.icon" />
                <span>{{ item.name }}</span>
              </router-link>
            </a-menu-item>
          </template>
          <!-- <a-menu-item key="1">
            <router-link :to="{ name: 'welcome' }">
              <a-icon type="home" />
              <span>首页</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link :to="{ name: 'majormanage' }">
              <a-icon type="database" />
              <span>专业管理</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <router-link :to="{ name: 'coursemanage' }">
              <a-icon type="pie-chart" />
              <span>课程管理</span>
            </router-link>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="mail" />
              <span>题库管理</span>
            </span>
            <a-menu-item key="5">
              <router-link :to="{ name: 'questionmanage' }">题目管理</router-link>
            </a-menu-item>
            <a-menu-item key="7">
              <router-link :to="{ name: 'questionshare' }">题库共享</router-link>
            </a-menu-item>
            <a-menu-item key="8">
              <router-link :to="{ name: 'answermanage' }">答案管理</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="mail" />
              <span>出题组卷管理</span>
            </span>
            <a-menu-item key="9">
              <router-link :to="{ name: 'papermanage' }">出题组卷管理</router-link>
            </a-menu-item>
            <a-menu-item key="10">
              <router-link :to="{ name: 'papershare' }">出题组卷分享</router-link>
            </a-menu-item>
            <a-menu-item key="11">
              <router-link :to="{ name: 'papermake' }">组卷一键生成</router-link>
            </a-menu-item>
          </a-sub-menu> -->
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header
          :class="collapsed ? 'collapsed_width' : 'no_collapsed_width'"
          :style="{ padding: '0px 24px', position: 'fixed', zIndex: 1,}"
        >
          <a-button
            type="primary"
            @click="toggleCollapsed"
          >
            <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold' " />
          </a-button>
          <div>
            <a-dropdown>
              <div class="userInfo">
                <!-- <a-avatar :size="32" icon="user"/> -->
                <svg-icon icon-class="manage_user"></svg-icon>
                <span class="username">{{ userName }}</span>
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  <span @click="logout">登出</span>
                  <!-- <router-link :to="{ name: 'login' }">登出</router-link> -->
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-layout-header>
        <a-layout-content :style="{ marginTop: '64px'}">
          <Header
            :explain="explain"
            :current-page="currentPageTitle"
            v-if="indexPage"
          />
          <div :class="currentPath == '/welcome' ? 'index' : 'content'">
            <!-- <transition
              name="fade"
              enter-active-class="fadeIn"
              leave-to-class="fadeOut"
              mode="out-in"
            > -->
            <router-view class="animated"></router-view>
            <!-- </transition> -->
          </div>
        </a-layout-content>
        <!-- <a-layout-footer style="textAlign: center">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer> -->
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';
import { PAGEBREAD } from '@/var/pageBread.js'
import Header from '_com/Header'
import BackUp from '_com/BackUp'
import sideMenuCfg from '@/var/sidebarCFG.js'
import {
  setSessionStorage,
  getSessionStorage
} from '_utils/sessions.js'

export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Header, BackUp },
  data () {
    // 这里存放数据
    return {
      transitionName: '',
      currentPath: '',
      defaultSelectedKeys: ['2'],
      collapsed: false,
      indexPage: false
    }
  },
  // 监听属性 类似于data概念
  computed: {
    loadVisible () {
      return this.$store.getters.layoutStatus
    },
    spinText () {
      return this.$store.getters.loadText
    },
    userName () {
      return this.$store.getters.userName
    },
    sidebarData () {
      return sideMenuCfg
    },
    currentPageTitle () {
      return this.$store.getters.currentPageTitle
    },
    explain () {
      return this.$store.getters.explain
    }
  },
  // 监控data中的数据变化
  watch: {
    $route (to, from) {
      this.currentPath = to.path
      setSessionStorage('currentPath', to.path)
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
      to.path == '/welcome'
        ? (this.indexPage = false)
        : (this.indexPage = true)
    }
  },
  // 方法集合
  methods: {
    // 当前点击的侧边栏位置
    selectMenu (item) {
      // 保存当前点击的侧边栏key
      this.defaultSelectedKeys = item.selectedKeys
      setSessionStorage('currentMenu', item.selectedKeys)
    },
    test (broken) {
      this.collapsed = broken
    },
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    },
    logout () {
      this.$store.dispatch('LogOut').then(res => {
        if (res) {
          this.$router.push({ path: '/login' })
        }
      })
    }
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created () {
    // 获取当前侧边栏点击的位置
    let currentKeys = getSessionStorage('currentMenu')
    this.defaultSelectedKeys = currentKeys || ['1']
    let currentPath = getSessionStorage('currentPath')
    this.currentPath = currentPath || '/welcome'
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted () {
    if (this.$route.path !== '/welcome') {
      this.indexPage = true
    } else {
      this.indexPage = false
    }
  },
  beforeCreate () {
  }, // 生命周期 - 创建之前
  beforeMount () { }, // 生命周期 - 挂载之前
  beforeUpdate () { }, // 生命周期 - 更新之前
  updated () {
  }, // 生命周期 - 更新之后
  beforeDestroy () { }, // 生命周期 - 销毁之前
  destroyed () { }, // 生命周期 - 销毁完成
  activated () { } // 如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

.layout {
  .ant-layout-header {
    display: flex;
    height: 64px;
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
    .userInfo {
      font-size: 18px;
    }
  }
  .ant-layout-sider {
    min-height: 100vh;
    .logo {
      padding: 15px;
      img {
        width: 100%;
        height: 100%;
      }
      h4 {
        color: #eee;
      }
    }
    .ant-menu-item {
      text-align: left;
    }
    .ant-menu-submenu {
      text-align: left;
    }
  }
}

.collapsed_width {
  width: calc(100vw - 80px);
}
.no_collapsed_width {
  width: calc(100vw - 200px);
}
.index {
  height: 100%;
}
.content {
  margin: 30px;
  background: #fff;
  min-height: calc(100vh - 274px);
}
</style>
