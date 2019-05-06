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
    <div style="justify-content: flex-start" class="common">
      <span style="flex: 0.2">设置与上次试卷生成的内容相似度：</span>
      <a-switch
        style="margin-left: 20px; margin-right: 20px;"
        @change="changeSimilarStatus"
        checkedChildren="开启"
        unCheckedChildren="关闭"
        defaultChecked
      />
      <a-select
        v-if="switchStatus"
        style="flex: 0.2"
        placeholder="请选择匹配相似度的试卷"
        @change="chooseSimilarExam"
      >
        <a-select-option
          v-for="exam in examSelectData"
          :key="exam.id"
          :value="exam.id"
        >{{ exam.examinationName }}</a-select-option>
      </a-select>
      <a-radio-group
        v-if="switchStatus"
        style="flex: 0.3; margin-left: 20px"
        @change="setSimilarContent"
        name="radioGroup"
      >
        <a-radio key="0" value="0.2">20%</a-radio>
        <a-radio key="1" value="0.5">50%</a-radio>
        <a-radio key="2" value="0.8">80%</a-radio>
        <a-radio key="3" value="customize">自定义</a-radio>
      </a-radio-group>
      <a-input-number
        v-if="customizeStatus && switchStatus"
        :defaultValue="0"
        :min="1"
        :max="99"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"
        @change="getSimilarValue"
      />
      <!-- <a-input type="number" v-model="similarValue" style="flex: 0.2" placeholder="请输入0——100的数值"></a-input>% -->
    </div>
    <a-button type="primary" @click="quickMake" size="large">一键生成</a-button>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { getSubjectType } from "_api/QuestionManage";

import { getCourseTree } from "_api/CourseManage";

import { autoGenerator, saveExamInfo } from "_api/PaperMake";

import { createExamination, getExaminatiionList } from "_api/PaperManage";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      switchStatus: true, // 相似度开启开关
      customizeStatus: false, // 自定义相似度
      similarValue: "", // 相似度
      examinationName: "", // 试卷名称
      subjectScore: 0, // 题型分数
      subjectAmount: 0, // 题目数量
      subjectFeatures: [], // 试卷特征
      examSelectData: [], // 匹配相似度试卷信息
      examId: "", // 匹配相似度的试卷Id
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
    chooseSimilarExam(value) {
      this.examId = value;
      console.log("选择匹配相似度的试卷：", value);
    },
    /**
     * 获取相似度
     */
    getSimilarValue(value) {
      this.similarValue = value / 100;
      console.log("相似度：", value / 100);
    },
    /**
     * 改变相似度启用状态
     */
    changeSimilarStatus(checked) {
      this.switchStatus = checked;
      // console.log('开启相似度状态：', checked)
    },
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
      if (e.target.value == "customize") {
        this.customizeStatus = true;
      } else {
        this.similarValue = e.target.value;
        this.customizeStatus = false; 
      }
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
      let that = this;
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
            that.$store.dispatch("ChangeLayoutStatus", {
              status: true,
              loadText: "试卷自动生成中..."
            });
            let config = {
              subjectConfigs: that.examConfig
            };
            let examInfo = {
              curriculumId: that.courseId,
              config: JSON.stringify(config), 
              correlation: that.similarValue,
              compareExaminationId: that.examId
            };
            autoGenerator(examInfo)
              .then(autoRes => {
                let examData = autoRes.data.data;
                if (examData.isSuccess) {
                  console.log('自动生成生成！')
                  let examInfo = {
                    examinationName: that.examinationName,
                    examinationData: examData.examinationData
                  };
                  saveExamInfo(examInfo).then(examRes => {
                    that.$store.dispatch("ChangeLayoutStatus", { status: false });
                    console.log("保存试卷信息结果：". examInfo.data.data)
                  }).catch(err => {
                    that.$store.dispatch("ChangeLayoutStatus", { status: false });
                  })
                }else {
                  that.$store.dispatch("ChangeLayoutStatus", { status: false });
                  that.$message.success(`${examData.message}`);
                }
              })
              .catch(err => {
                that.$store.dispatch("ChangeLayoutStatus", { status: false });
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
    },
    /**
     * 获取当前用户设置的试卷列表
     */
    getExaminatiionList() {
      getExaminatiionList().then(res => {
        this.examSelectData = res.data.data;
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getSubjectType();
    this.getCourseInfo();
    this.getExaminatiionList();
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