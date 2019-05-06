<template>
  <div class="exam_show" id="examContent">
    <div class="func_btns">
      <router-link v-if="editStatus" style="color: #1890FF" :to="{ name: 'welcome' }">&lt; 返回题库系统</router-link>
      <br>
      <a-button
        v-if="editStatus"
        @click="printExam"
        class="print_exam"
        v-print="printValue"
        type="primary"
      >打印试卷</a-button>
    </div>
    <div class="exam-content">
      <div
        class="subject-type"
        v-for="(subjectType, index) in subjectTypeData"
        :key="subjectType.id"
      >
        <h2>{{ index + 1 + '、' + subjectType.subjectTypeName }}</h2>
        <!-- 选择题 -->
        <div v-if="subjectType.id == 1" class="subject-item">
          <div v-if="JSON.stringify(subjectData) !== '{}'">
            <div
              v-for="(subject, index) in subjectData[subjectType.id]"
              :key="subject.id"
              class="choose-subject"
            >
              <div class="subject-title">
                <p>{{ index + 1 + "、" + JSON.parse(subject.question).question}}</p>
              </div>
              <p
                class="subject-option"
                v-for="(option,key) in JSON.parse(subject.question).options"
                :key="key"
              >{{ key + "、" + option }}</p>
            </div>
          </div>
        </div>
        <!-- 判断题 -->
        <div v-if="subjectType.id == 2" class="subject-item">
          <div v-if="JSON.stringify(subjectData) !== '{}'">
            <div
              v-for="(subject, index) in subjectData[subjectType.id]"
              :key="subject.id"
              class="choose-subject"
            >
              <div class="subject-title">
                <p>{{ index + 1 + "、" + JSON.parse(subject.question).question}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 填空题 -->
        <div v-if="subjectType.id == 3" class="subject-item">
          <div v-if="JSON.stringify(subjectData) !== '{}'">
            <div
              v-for="(subject, index) in subjectData[subjectType.id]"
              :key="subject.id"
              class="choose-subject"
            >
              <div class="subject-title">
                <p>{{ index + 1 + "、" + JSON.parse(subject.question).question}}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 简答题 -->
        <div v-if="subjectType.id == 4" class="subject-item">
          <div v-if="JSON.stringify(subjectData) !== '{}'">
            <div
              v-for="(subject, index) in subjectData[subjectType.id]"
              :key="subject.id"
              class="choose-subject"
            >
              <div class="subject-title">
                <p>{{ index + 1 + "、" + JSON.parse(subject.question).question}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getSubjectListByExam } from "_api/ExaminationMake.js";
import { getSubjectTypeByExamId } from "_api/PaperManage";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      subjectTypeData: [], // 试卷默认题型
      subjectData: [], // 题型题目信息
      editStatus: true,
      printValue: "",
      timer: ""
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    /**
     * 获取试卷题型
     */
    getExamSubjectType() {
      getSubjectTypeByExamId(this.examId).then(res => {
        if (res.data.data) {
          this.subjectTypeData = res.data.data;
        }
      });
    },
    /**
     * 获取试卷题目列表
     */
    getSubjectListByExam() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "正在加载试卷数据..."
      });
      getSubjectListByExam(this.examId).then(res => {
        if (res.data.data) {
          this.subjectData = res.data.data;
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
        }
      });
    },
    /**
     * 打印试卷
     */
    printExam() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.editStatus = false;
      this.printValue = "#examContent";
      this.timer = setTimeout(() => {
        this.editStatus = true;
      }, 500);
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.examId = this.$route.query.id;
    this.getExamSubjectType();
    this.getSubjectListByExam();
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
.exam_show {
  .exam-content {
    padding: 40px;
    .subject-type {
      h2 {
        text-align: left;
      }
      .subject-item {
        .choose-subject {
          text-align: left;
          text-indent: 2em;
          .subject-title {
            display: flex;
            .edit {
              margin-left: 40px;
              cursor: pointer;
            }
          }
        }
        .subject-option {
          display: inline-block;
        }
      }
    }
  }
}
.func_btns {
  text-align: left;
  padding: 40px 0 0 40px;
  .ant-btn {
    margin-top: 10px;
  }
  .print_exam {
    background: #ff6767;
    border: 0;
  }
}
</style>