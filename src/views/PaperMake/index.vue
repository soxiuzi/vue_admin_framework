<template>
  <div class="paper_make">
    <div class="choose-course common">
      <span>选择试卷的课程范围：</span>
      <a-radio-group @change="chooseCourse" name="radioGroup">
        <a-radio
          v-for="course in courseInfo"
          :key="course.id"
          :value="course.id"
        >{{ course.curriculumName }}</a-radio>
      </a-radio-group>
    </div>
    <div class="common">
      <span>设置试卷名称：</span>
      <a-input v-model="examinationName" placeholder="请输入试卷名称"></a-input>
    </div>
    <div class="common">
      <span>设置题型：</span>
      <a-checkbox-group @change="chooseSubjectType">
        <a-row>
          <a-col v-for="checkbox in subjectTypeOptions" :key="checkbox.id" :span="24">
            <a-checkbox :value="checkbox.id">{{ checkbox.subjectTypeName }}</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
      <div v-if="subjectTypeValue.length" class="setCourseArea">
        <div class="type-config">
          <span>
            设置
            <strong style="color: #ce1620">{{ subjectTypeName }}</strong>总分：
          </span>
          <a-input @change="getSubjectScore" v-model="subjectScore"></a-input>
        </div>
        <div class="type-config">
          <span>
            设置
            <strong style="color: #ce1620">{{ subjectTypeName }}</strong>题目数量：
          </span>
          <a-input @change="getsubjectAmount" v-model="subjectAmount"></a-input>
        </div>
        <div class="type-config">
          <span>
            设置
            <strong style="color: #ce1620">{{ subjectTypeName }}</strong>考察的章节范围：
          </span>
          <a-tree-select
            showSearch
            style="width: 300px"
            :value="subjectFeatures"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择考察的章节范围"
            allowClear
            multiple
            @change="onChange"
          >
            <a-tree-select-node
              v-for="(course, firstIndex) in treeData"
              :key="course.id"
              :value="course.id"
              :title="course.curriculumName"
            >
              <template v-if="course.children">
                <a-tree-select-node
                  v-for="(secondTree, index) in course.children"
                  :key="secondTree.id"
                  :value="secondTree.id"
                  :title="secondTree.curriculumName"
                >
                  <a-tree-select-node
                    v-for="(thirdTree, index) in secondTree.children"
                    :key="thirdTree.id"
                    :value="thirdTree.id"
                    :title="thirdTree.curriculumName"
                  ></a-tree-select-node>
                </a-tree-select-node>
              </template>
            </a-tree-select-node>
          </a-tree-select>
        </div>
      </div>
    </div>
    <div class="common">
      <span>设置总分：</span>
      <a-input v-model="examinationScore" placeholder="请输入试卷总分"></a-input>
    </div>
    <div class="common">
      <span>设置与上次试卷生成的内容相似度：</span>
      <a-radio-group @change="setSimilarContent" name="radioGroup">
        <a-radio key="0" value="1">10%</a-radio>
        <a-radio key="1" value="2">20%</a-radio>
        <a-radio key="2" value="3">40%</a-radio>
      </a-radio-group>
    </div>
    <a-button type="primary" @click="quickMake" size="large">一键生成</a-button>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getSubjectType } from "_api/QuestionManage";

import { getCourseTree } from "_api/CourseManage";

import { autoGenerator } from "_api/PaperMake";

import { createExamination } from "_api/PaperManage";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      examinationName: "", // 试卷名称
      subjectScore: 0, // 题型分数
      subjectAmount: 0, // 题目数量
      subjectFeatures: [], // 试卷特征
      examinationScore: 0, // 试卷总分
      subjectTypeName: "", // 当前题型名称
      targetSubjectTypeId: "", // 当前题型Id
      courseInfo: [], // 课程信息
      treeData: [], // 课程树信息
      courseId: "", // 课程Id
      subjectTypeName: "", // 题型名
      subjectTypeValue: [], // 设置的题目题型
      subjectTypeOptions: [], // 题型信息
      examConfig: {} // 试卷配置
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    /**
     * 设置题型分数
     */
    getSubjectScore(e) {
      this.examConfig[this.targetSubjectTypeId].totalScore = e.target.value;
    },
    /**
     * 设置题型题数
     */
    getsubjectAmount(e) {
      this.examConfig[this.targetSubjectTypeId].subjectAmount = e.target.value;
    },
    /**
     * 设置试卷相似度
     */
    setSimilarContent(e) {
      console.log("设置相似度", e.target.value);
    },
    /**
     * 选择试卷题型
     */
    chooseSubjectType(checkValue) {
      this.subjectFeatures = [];
      this.subjectTypeValue = checkValue;
      this.targetSubjectTypeId = checkValue[checkValue.length - 1];
      this.examConfig[this.targetSubjectTypeId] = {
        totalScore: this.subjectScore,
        subjectAmount: this.subjectAmount,
        features: this.subjectFeatures
      };
      let currentCheckValue = checkValue[checkValue.length - 1];
      if (currentCheckValue) {
        for (let i = 0; i < this.subjectTypeOptions.length; i++) {
          if (currentCheckValue == this.subjectTypeOptions[i].id) {
            this.subjectTypeName = this.subjectTypeOptions[i].subjectTypeName;
          }
        }
      }
    },
    /**
     * 获取题目类型
     */
    getSubjectType() {
      getSubjectType().then(res => {
        this.subjectTypeOptions = res.data.data;
      });
    },
    /**
     * 一键生成
     */
    quickMake() {
      if (this.courseId == "") {
        this.$message.warning("请选择试卷的课程范围！");
      } else if (this.examinationName == "") {
        this.$message.warning("请填写试卷名称！");
      } else if (JSON.stringify(this.subjectFeatures) == "[]") {
        this.$message.warning("请选择试卷题型！");
      } else {
        this.$confirm({
          title: "试卷生成",
          cancelText: "取消",
          centered: true,
          content: "确定生成该试卷？",
          onOk() {
            this.$store.dispatch("ChangeLayoutStatus", {
              status: true,
              loadText: "试卷自动生成中..."
            });
            let examInfo = {
              config: "",
              examinationId: "",
              curriculumId: ""
            };
            createExamination(this.examinationName, this.courseId).then(res => {
              let examInfo = {
                examinationId: res.data.data,
                curriculumId: this.courseId,
                config: this.examConfig
              };
              autoGenerator(examInfo).then(autoRes => {
                this.$store.dispatch("ChangeLayoutStatus", { status: false });
                this.$message.success("试卷生成成功！");
              });
            });
          }
        });
      }
    },
    onChange(value) {
      this.subjectFeatures = value;
      this.examConfig[this.targetSubjectTypeId].features = value;
    },
    /**
     * 获取课程信息
     */
    getCourseInfo() {
      getCourseTree().then(res => {
        this.courseInfo = res.data.data;
      });
    },
    /**
     * 选择课程范围
     */
    chooseCourse(e) {
      let courseArea = e.target.value;
      let currentCourseInfo = this.courseInfo;
      for (let i = 0; i < currentCourseInfo.length; i++) {
        if (courseArea == currentCourseInfo[i].id) {
          this.treeData = currentCourseInfo[i].children;
        }
      }
      this.courseId = courseArea;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getSubjectType();
    this.getCourseInfo();
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
.paper_make {
  margin: 50px;
  .common {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px 0;
    text-align: left;
    span {
      flex: 1;
    }
    .ant-input {
      flex: 4;
    }
    .ant-checkbox-group {
      flex: 1;
    }
    .ant-select {
      flex: 1;
    }
    .ant-radio-group {
      flex: 4;
    }
    .setCourseArea {
      flex: 2;
      .type-config {
        display: flex;
        margin: 10px 0;
        span {
          flex: 1;
        }
        .ant-input {
          flex: 1;
        }
      }
    }
  }
}
</style>