<template>
  <div class="question_share">
    <a-modal
      centered
      v-model="shareVisible"
      @ok="confirmShare"
      okText="确认分享"
      cancelText="取消"
      :closable="false"
    >
      <div class="share_content">
        <a-tree @select="chooseShareUser" class="user_tree" :treeData="gData"/>
        <a-list :dataSource="userData">
          <a-list-item slot="renderItem" slot-scope="item, index">
            {{item}}
            <svg-icon @onClick="deleteUser(index)" slot="actions" icon-class="delete_1"></svg-icon>
          </a-list-item>
        </a-list>
      </div>
    </a-modal>
    <a-radio-group @change="chooseType" size="large">
      <a-radio-button
        v-for="subject in subjectTypes"
        :key="subject.id"
        :value="subject.id"
      >{{ subject.subjectTypeName }}</a-radio-button>
      <!-- <a-radio-button value="b">Shanghai</a-radio-button>
      <a-radio-button value="c">Beijing</a-radio-button>
      <a-radio-button value="d">Chengdu</a-radio-button>-->
    </a-radio-group>
    <div title="分享" class="share_btn">
      <svg-icon title="分享" @onClick="shareSubject" icon-class="share"></svg-icon>
    </div>
    <a-table
      bordered
      :loading="tableLoadingVisible"
      :pagination="pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :dataSource="subjectData"
    />
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getSubjectType } from "_api/QuestionManage";
import {
  getSubjectList,
  getAllUsers,
  shareSubjectInfo
} from "_api/QuestionShare";

const columns = [
  {
    title: "题目序号",
    dataIndex: "index"
  },
  {
    title: "题目描述",
    dataIndex: "subjectDes"
  }
];

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      tableLoadingVisible: false,
      subjectTypes: [],
      shareVisible: false,
      currentTypeId: "",
      subjectData: [],
      userData: [],
      pagination: {
        pageSize: 5
      },
      userIdList: [],
      columns: columns,
      gData: [
        {
          title: "用户列表",
          key: "0-0",
          disabled: true,
          children: []
        }
      ],
      selectedRowKeys: [],
      currentPage: 1,
      pageSize: 5
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    /**
     * 删除选中的分享用户
     */
    deleteUser(index) {
      this.userData.splice(index, 1);
      this.userIdList.splice(index, 1);
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
     * 分享题目
     */
    confirmShare() {
      this.$store.dispatch("ChangeLayoutStatus", { status: true, loadText: '题目分享中...'})
      let subjectInfo = {
        ids: this.userIdList.join("-"),
        questionIds: this.selectedRowKeys.join("-")
      };
      shareSubjectInfo(subjectInfo).then(res => {
        if (res.data.data) {
          this.$store.dispatch("ChangeLayoutStatus", { status: false })
          this.shareVisible = false;
          this.$message.success("分享成功！");
        }
      });
    },
    /**
     * 打开分享模态框
     */
    shareSubject() {
      if (this.selectedRowKeys.length) {
        this.shareVisible = true;
        this.gData[0].children = [];
        getAllUsers().then(res => {
          let userList = res.data.data;
          for (let i = 0; i < userList.length; i++) {
            this.gData[0].children.push({
              title: userList[i].account,
              key: userList[i].id + "-" + userList[i].account
            });
          }
        });
      } else {
        this.$message.warning("请先选择需要分享的题目信息");
      }
    },
    /**
     * 选择题目类型
     */
    chooseType(e) {
      this.tableLoadingVisible = true;
      this.currentTypeId = e.target.value;
      this.getSubjectInfo();
      // console.log("选择题目类型：", e.target.value);
    },
    /**
     * 选择分享的题目信息
     */
    onSelectChange(selectedRowKeys) {
      console.log("选择分享的题目：", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    /**
     * 获取题目信息
     */
    getSubjectInfo() {
      this.subjectData = [];
      let subjectInfo = {
        questionType: this.currentTypeId,
        pageSize: this.pageSize,
        current: this.currentPage
      };
      getSubjectList(subjectInfo).then(res => {
        if (res.data.data) {
          let subjectInfoList = res.data.data;
          for (let i = 0; i < subjectInfoList.length; i++) {
            let questionInfo = JSON.parse(subjectInfoList[i].question);
            this.subjectData.push({
              key: subjectInfoList[i].id,
              index: i + 1,
              subjectDes: questionInfo.question,
              subjectId: subjectInfoList[i].id
            });
          }
          this.tableLoadingVisible = false
        }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    getSubjectType().then(res => {
      this.subjectTypes = res.data.data;
    });
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
.question_share {
  padding-top: 40px;
  .share_btn {
    cursor: pointer;
    font-size: 20px;
    text-align: left;
    padding: 10px;
    margin-top: 100px;
    width: 30px;
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