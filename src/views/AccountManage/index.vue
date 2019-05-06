<template>
  <div class="account_manage">
    <a-modal
      centered
      :closable="false"
      v-model="userVisible"
      @ok="addUser"
      okText="添加"
      cancelText="取消"
    >
      <a-input placeholder="用户名"></a-input>
      <a-input placeholder="密码"></a-input>
    </a-modal>
    <a-button @click="showUserVisible">
      <svg-icon icon-class="add"></svg-icon>添加账户
    </a-button>
    <a-table bordered :dataSource="dataSource" :columns="columns">
      <template class="operation" slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="dataSource.length"
          okText="确认"
          cancelText="取消"
          title="确认删除该账户?"
          @confirm="() => onDelete(record.key)"
        >
          <a style="color: #40a9ff; line-height: 32px;" href="javascript:;">删除账户</a>
        </a-popconfirm>
        <a-button style="color: #40a9ff" @click="editUserInfo" >修改账户信息</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getAllUsers } from "_api/QuestionShare";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      userVisible: false,
      dataSource: [
        {
          key: "0",
          name: "Edward King 0",
          age: "32",
          address: "London, Park Lane no. 0"
        },
        {
          key: "1",
          name: "Edward King 1",
          age: "32",
          address: "London, Park Lane no. 1"
        }
      ],
      columns: [
        {
          title: "username",
          dataIndex: "username",
        },
        {
          title: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
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
    /**
     * 显示添加账户模态框
     */
    showUserVisible() {
      this.userVisible = true;
    },
    /**
     * 添加账户
     */
    addUser() {
      console.log("添加账户");
      this.userVisible = false;
    },
    /**
     * 更新账户信息
     */
    editUserInfo() {
      console.log('更新账户信息')
    },
    /**
     * 获取所有用户列表
     */
    getAllUserList() {
      getAllUsers().then(res => {
        console.log("所有用户列表：", res.data.data);
      });
    },
    /**
     * 页面数据初始化
     */
    initData() {
      console.log("页面初始化");
      this.getAllUserList();
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData();
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
.account_manage {
  overflow: hidden;
  .ant-btn {
    float: left;
  }
  .ant-table-wrapper {
    .ant-btn {
      border: 0;
      box-shadow: none;
      background: transparent;
    }
  }
}
</style>