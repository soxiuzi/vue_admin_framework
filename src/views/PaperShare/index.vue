<template>
  <div class="paper_share">
    <a-modal
      :closable="false"
      v-model="shareVisible"
      okText="修改"
      cancelText="取消"
      @ok="updateShareInfo"
    >
      <div class="share_content">
        <a-tree @select="chooseShareUser" class="user_tree" :treeData="gData"/>
        <a-list
          :loading="listLoadStatus"
          :locale="{ emptyText: '暂未选择分享用户' }"
          :dataSource="userData"
        >
          <a-list-item slot="renderItem" slot-scope="item, index">
            {{item}}
            <svg-icon @onClick="deleteUser(index)" slot="actions" icon-class="delete_1"></svg-icon>
          </a-list-item>
        </a-list>
      </div>
    </a-modal>
    <a-radio-group @change="chooseShareType" :defaultValue="0" buttonStyle="solid">
      <a-radio-button :value="0">我共享的</a-radio-button>
      <a-radio-button :value="1">他人共享的</a-radio-button>
    </a-radio-group>
    <a-table
      :locale="{emptyText: '暂无数据'}"
      :loading="loadStatus"
      v-if="!shareType"
      bordered
      :dataSource="examTableData"
      :columns="columns"
    >
      <template slot="subjectType" slot-scope="text">
        <router-link
          style="color: skyblue"
          :to="{name: 'examinationshow', query: { id: text }}"
        >查看试卷</router-link>
        <a style="color: skyblue; margin-left: 20px" @click="showShareVisible(text)" href="#">修改分享用户</a>
      </template>
    </a-table>
    <a-table
      :locale="{emptyText: '暂无数据'}"
      :loading="loadStatus"
      v-else
      bordered
      :dataSource="examTableData"
      :columns="columns"
    >
      <template slot="subjectType" slot-scope="text">
        <router-link
          style="color: skyblue"
          :to="{name: 'examinationshow', query: { id: text }}"
        >查看试卷</router-link>
      </template>
    </a-table>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {
  getSharedExam,
  getShareWithMe,
  getShareUsersForExam
} from "_api/PaperShare";
import { getUserInfo } from "_api/user";
import { getAllUsers } from "_api/QuestionShare";
import { shareExam } from "_api/PaperManage";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      shareVisible: false,
      loadStatus: false,
      listLoadStatus: false,
      shareType: "", // 分享类型
      examTableData: [],
      examId: "",
      userData: [],
      userIdList: [],
      gData: [
        {
          title: "用户列表",
          key: "0-0",
          disabled: true,
          children: []
        }
      ],
      columns: [
        {
          title: "试卷名称",
          dataIndex: "examName"
        },
        {
          title: "操作",
          dataIndex: "subjectType",
          scopedSlots: { customRender: "subjectType" }
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
     * 选择共享的方式
     */
    chooseShareType(e) {
      let value = e.target.value;
      this.shareType = value;
      value ? this.getShareWithMe() : this.getSharedExam();
    },
    /**
     * 获取我共享的试卷信息
     */
    getSharedExam() {
      this.examTableData = [];
      this.loadStatus = true;
      getSharedExam().then(res => {
        let examData = res.data.data;
        if (examData) {
          for (let i = 0; i < examData.length; i++) {
            this.examTableData.push({
              key: i,
              examName: examData[i].examinationName,
              subjectType: examData[i].id
            });
          }
          this.loadStatus = false;
        }
        this.loadStatus = false;
      });
    },
    /**
     * 获取他人与我共享的试卷信息
     */
    getShareWithMe() {
      this.examTableData = [];
      this.loadStatus = true;
      getShareWithMe().then(res => {
        let examData = res.data.data;
        if (examData) {
          for (let i = 0; i < examData.length; i++) {
            this.examTableData.push({
              key: i,
              examName: examData[i].examinationName,
              subjectType: examData[i].id
            });
          }
          this.loadStatus = false;
        }
        this.loadStatus = false;
      });
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter(item => item.key !== key);
    },
    cancelShare(id) {
      console.log("取消分享", id);
    },
    showShareVisible(id) {
      this.shareVisible = true;
      this.examId = id;
      this.listLoadStatus = true;
      getShareUsersForExam(id).then(res => {
        let userInfo = res.data.data;
        for (let i = 0; i < userInfo.length; i++) {
          this.userIdList.push(userInfo[i].id);
          this.userData.push(userInfo[i].account);
        }
        this.listLoadStatus = false;
      });
    },
    updateShareInfo() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "修改分享用户中..."
      });
      let shareInfo = {
        ids: this.userIdList.join("-"),
        examinationIds: this.examId
      };
      shareExam(shareInfo).then(res => {
        if (res.data.data) {
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.shareVisible = false;
          this.$message.success("修改成功！");
        }
      });
    },
    /**
     * 选择分享用户
     */
    chooseShareUser(selectedKeys) {
      let targetName = selectedKeys[0].split("-")[1],
        targetId = selectedKeys[0].split("-")[0];
      this.userData.indexOf(targetName) < 0 && this.userData.push(targetName);
      this.userIdList.indexOf(targetId) < 0 && this.userIdList.push(targetId);
    },
    /**
     * 删除选中的分享用户
     */
    deleteUser(index) {
      this.userData.splice(index, 1);
      this.userIdList.splice(index, 1);
    },
    getAllUsersList() {
      getAllUsers().then(res => {
        let userList = res.data.data;
        for (let i = 0; i < userList.length; i++) {
          this.gData[0].children.push({
            title: userList[i].account,
            key: userList[i].id + "-" + userList[i].account
          });
        }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getSharedExam();
    this.getAllUsersList();
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
.paper_share {
  text-align: left;
  .ant-radio-group {
    margin-bottom: 15px;
  }
}
.share_content {
  display: flex;
  .ant-tree {
    flex: 1;
    height: 400px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 4px;
      /*height: 4px;*/
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
  .ant-list {
    flex: 3;
    margin-left: 10px;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 4px;
      /*height: 4px;*/
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(0, 0, 0, 0.2);
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
    }
  }
}
</style>