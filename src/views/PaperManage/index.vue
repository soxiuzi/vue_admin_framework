<template>
  <div class="page_manage">
    <!-- 分享 -->
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
    <!-- 创建试卷 -->
    <a-modal
      okText="确定"
      cancelText="取消"
      :closable="false"
      centered
      v-model="createExamVisible"
      @ok="createExamination"
    >
      <div class="choose-course">
        <span>选择试卷的课程范围：</span>
        <a-radio-group @change="chooseCourse" name="radioGroup">
          <a-radio
            v-for="course in courseInfo"
            :key="course.id"
            :value="course.id"
          >{{ course.curriculumName }}</a-radio>
        </a-radio-group>
      </div>
      <a-input placeholder="请输入试卷名称" v-model="examinationName"></a-input>
    </a-modal>
    <div class="share_btn">
      <a-button @click="showCreateModal">
        <svg-icon class="svg_class" icon-class="add"></svg-icon>创建试卷
      </a-button>
      <a-button @click="shareSubject">
        <svg-icon class="svg_class" icon-class="share"></svg-icon>分享
      </a-button>
      <!-- <svg-icon title="分享" @onClick="shareSubject" icon-class="share"></svg-icon> -->
    </div>
    <a-table
      :locale="{emptyText: '暂无数据'}"
      :loading="loadStatus"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :dataSource="examinationData"
      bordered
      :pagination="pagination"
    >
      <template slot="subjectType" slot-scope="text">
        <router-link
          style="color: skyblue"
          :to="{name: 'makeExamination', query: { id: text.id, name: text.examinationName }}"
        >编辑试卷</router-link>
      </template>
    </a-table>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {
  createExamination,
  getExaminatiionList,
  shareExam
} from "_api/PaperManage";

import { getSubjectList } from "_api/QuestionShare.js";

import { getCourseTree } from "_api/CourseManage";

import { getAllUsers } from "_api/QuestionShare";

const columns = [
  {
    title: "试卷名称",
    dataIndex: "name"
  },
  {
    title: "操作",
    dataIndex: "subjectType",
    scopedSlots: { customRender: "subjectType" }
  }
];

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      loadStatus: false,
      courseInfo: [], // 课程信息
      examinationData: [], // 试卷信息
      columns, // 表格表头信息
      createExamVisible: false, // 创建试卷模态框
      shareVisible: false, // 分享模态框
      selectedRowKeys: [], // 选择分享的试卷
      userData: [], // 初始用户数据
      userIdList: [], // 用户列表
      gData: [
        {
          title: "用户列表",
          key: "0-0",
          disabled: true,
          children: []
        }
      ], // 用户数结构
      pagination: {
        pageSize: 8
      }, // 试卷表格每页大小
      examinationName: "", // 试卷名称
      courseIdForExam: "", // 试卷课程范围
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      } // 单选按钮样式
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
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
        this.$message.warning("请先选择需要分享的试卷！");
      }
    },
    /**
     * 确认分享信息
     */
    confirmShare() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "试卷分享中..."
      });
      let subjectInfo = {
        ids: this.userIdList.join("-"),
        examinationIds: this.selectedRowKeys.join("-")
      };
      shareExam(subjectInfo).then(res => {
        if (res.data.data) {
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.shareVisible = false;
          this.$message.success("分享成功！");
        }
      });
    },
    /**
     * 选择课程范围
     */
    chooseCourse(e) {
      this.courseIdForExam = e.target.value;
    },
    /**
     * 打开创建试卷模态框
     */
    showCreateModal() {
      this.createExamVisible = true;
    },
    /**
     * 选择分享的试卷
     */
    onSelectChange(selectedRowKeys) {
      console.log("选择分享的题目：", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    /**
     * 创建试卷
     */
    createExamination() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "创建试卷中..."
      });
      createExamination(this.examinationName, this.courseIdForExam).then(
        res => {
          if (res.data.data) {
            this.createExamVisible = false;
            this.$store.dispatch("ChangeLayoutStatus", { status: false });
            this.initData();
            this.$message.success("试卷创建成功！");
          }
        }
      );
    },
    /**
     * 获取当前选择的题型Id
     */
    onChange(e) {
      this.subjectTypeId = e.target.value;
      let test = {
        questionType: e.target.value
      };
      getSubjectList(test).then(res => {
        this.subjectOptions = res.data.data;
      });
    },
    /**
     * 页面数据初始化 - 获取试卷列表
     */
    initData() {
      // 获取所有课程
      getCourseTree().then(res => {
        this.courseInfo = res.data.data;
      });
      this.loadStatus = true
      // 获取试卷列表
      getExaminatiionList().then(res => {
        this.examinationData = [];
        let resultList = res.data.data;
        for (let i = 0; i < resultList.length; i++) {
          this.examinationData.push({
            key: resultList[i].id,
            name: resultList[i].examinationName,
            subjectType: resultList[i],
            subject: resultList[i].id
          });
        }
        this.loadStatus = false
      });
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
.page_manage {
  & > .ant-btn {
    margin: 20px 0;
    font-size: 20px;
  }
}
.content {
  display: flex;
  margin: 20px 0;
  span {
    flex: 1;
    margin-right: 30px;
  }
  .ant-radio-group {
    flex: 4;
  }
  .ant-select {
    flex: 4;
  }
  .ant-input {
    flex: 4;
  }
}
.choose-course {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  .ant-radio-group {
    margin: 10px 0;
  }
}
.share_btn {
  font-size: 20px;
  text-align: left;
  margin-bottom: 20px;
  .svg_class {
    margin-right: 10px;
  }
  .ant-btn {
    &:last-child {
      margin-left: 10px;
    }
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