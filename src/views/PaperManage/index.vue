<template>
  <div class="page_manage">
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
          <a-radio v-for="course in courseInfo" :key="course.id" :value="course.id">{{ course.curriculumName }}</a-radio>
        </a-radio-group>
      </div>
      <a-input placeholder="请输入试卷名称" v-model="examinationName"></a-input>
    </a-modal>
    <a-button @click="showCreateModal" size="large">
      <svg-icon icon-class="add"></svg-icon>创建试卷
    </a-button>
    <a-table :columns="columns" :dataSource="examinationData" bordered :pagination="pagination">
      <template slot="subjectType" slot-scope="text">
        <router-link
          style="color: skyblue"
          :to="{name: 'makeExamination', query: { id: text }}"
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
} from "_api/PaperManage";


import { getSubjectList } from "_api/QuestionShare.js";

import { getCourseTree } from "_api/CourseManage";

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
      courseInfo: [], // 课程信息
      examinationData: [], // 试卷信息
      columns, // 表格表头信息
      setSubjectVisible: false, // 设置课程模态框
      createExamVisible: false, // 创建试卷模态框
      pagination: {
        pageSize: 8
      },
      examinationName: "",
      courseIdForExam: "",
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    showModal() {
      this.examVisible = true;
    },
    editExam() {
      console.log("编辑试卷");
    },
    chooseSubject(value) {
      this.subjectId = value;
    },
    /**
     * 选择课程范围
     */
    chooseCourse(e) {
      this.courseIdForExam = e.target.value
    },
    /**
     * 打开创建试卷模态框
     */
    showCreateModal() {
      this.createExamVisible = true;
    },
    /**
     * 创建试卷
     */
    createExamination() {
      this.$store.dispatch("ChangeLayoutStatus", { status: true, loadText: "创建试卷中..." });
      createExamination(this.examinationName, this.courseIdForExam).then(res => {
        if (res.data.data) {
          this.createExamVisible = false;
          this.$store.dispatch("ChangeLayoutStatus", { status: false});
          this.initData();
          this.$message.success("试卷创建成功！");
        }
      });
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
      // 获取试卷列表
      getExaminatiionList().then(res => {
        this.examinationData = [];
        let resultList = res.data.data;
        for (let i = 0; i < resultList.length; i++) {
          this.examinationData.push({
            key: resultList[i].id,
            name: resultList[i].examinationName,
            subjectType: resultList[i].id,
            subject: resultList[i].id
          });
        }
        console.log("获取试卷列表：", this.examinationData);
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
</style>