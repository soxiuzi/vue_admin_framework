<template>
  <div class="examination-make" ref="print" id="printTest">
    <!-- 加载框 -->
    <back-up :visible="backUpVisible" :spinText="spinText"></back-up>
    <!-- 编辑题目信息 -->
    <a-modal
      okText="确定"
      cancelText="取消"
      :closable="false"
      centered
      v-model="setUpdateSubjectVisible"
      @ok="updateSubject"
    >
      <div v-if="currentSubjectInfo.questionType == 1" class="choice-edit">
        <div class="subject-title__update">
          <span>修改题目描述：</span>
          <a-input v-model="currentSubjectInfo.question"></a-input>
        </div>
        <div v-if="currentSubjectInfo.options">
          <div
            v-for="(option, index) in currentSubjectInfo.options"
            :key="index"
            class="subject-options__update"
          >
            <span>选项{{ index }}：</span>
            <a-input v-model="currentSubjectInfo.options[index]"></a-input>
          </div> 
        </div>
      </div>
      <div class="subject-title__update" v-else>
        <span>题目描述：</span>
        <a-input v-model="currentSubjectInfo.question"></a-input>
      </div>
    </a-modal>
    <!-- 设置试卷题型 -->
    <a-modal
      okText="确定"
      cancelText="取消"
      :closable="false"
      centered
      v-model="setExamTypeVisible"
      @ok="setExaminationType"
    >
      <a-radio-group @change="onChange" v-model="subjectTpyeValue">
        <a-radio
          :style="radioStyle"
          v-for="radio in subjectTypeOptions"
          :key="radio.id"
          :value="radio.id"
        >{{ radio.subjectTypeName }}</a-radio>
      </a-radio-group>
    </a-modal>
    <!-- 设置试卷题目 -->
    <a-modal
      okText="确定"
      cancelText="取消"
      :closable="false"
      centered
      v-model="setSubjectVisible"
      @ok="setSubject"
      @cancel="getDefaultValue"
    >
      <a-radio-group @change="chooseAddType" v-model="addTypeValue">
        <a-radio :style="radioStyle" :value="1">选择题库题目</a-radio>
        <a-radio :style="radioStyle" :value="2">新增题目</a-radio>
        <a-radio :style="radioStyle" :value="3">他人共享的题目</a-radio>
      </a-radio-group>
      <div v-if="addTypeValue == 1" class="choose-subject">
        <div class="modal-content">
          <span>选择题目：</span>
          <a-select v-model="selectDefaultValue" @change="chooseSubject">
            <a-select-option
              v-for="subject in subjectOptions"
              :key="subject.id"
              :value="subject.id"
            >{{ JSON.parse(subject.question).question }}</a-select-option>
          </a-select>
        </div>
        <div class="modal-content">
          <span>设置分数：</span>
          <a-input v-model="score" placeholder="请输入分数"></a-input>
        </div>
      </div>
      <div v-if="addTypeValue == 2 && subjectTypeId == 1" class="add-subject">
        <div class="subject-name subject-common">
          <span>题目描述：</span>
          <a-input v-model="subjectName" placeholder="输入题目描述"></a-input>
        </div>
        <div class="subject-score subject-common">
          <span>题目分数：</span>
          <a-input v-model="subjectScore" placeholder="设置题目分数"></a-input>
        </div>
        <div class="choose-options" v-for="(item, index) in choiceOptions" :key="index">
          <a-input v-model="item.value" placeholder="请输入选项内容"></a-input>
          <a-select v-model="item.option" placeholder="选择选项" @change="chooseOption">
            <a-select-option :key="index" value="A">A</a-select-option>
            <a-select-option :key="index" value="B">B</a-select-option>
            <a-select-option :key="index" value="C">C</a-select-option>
            <a-select-option :key="index" value="D">D</a-select-option>
          </a-select>
          <div @click="deleteOption(index)">
            <svg-icon class="delete_icon" icon-class="delete"></svg-icon>
          </div>
        </div>
        <a-button class="add_btn" @click="addOption" type="primary">添加选项</a-button>
      </div>
      <div v-if="addTypeValue == 2 && subjectTypeId != 1" class="add-subject">
        <div class="subject-name subject-common">
          <span>题目描述：</span>
          <a-input v-model="subjectName" placeholder="输入题目描述"></a-input>
        </div>
        <div class="subject-score subject-common">
          <span>题目分数：</span>
          <a-input v-model="subjectScore" placeholder="设置题目分数"></a-input>
        </div>
      </div>
      <div v-if="addTypeValue == 3" class="choose-subject">
        <div class="modal-content">
          <span>选择题目：</span>
          <a-select v-model="selectDefaultValue" @change="chooseSubject">
            <a-select-option
              v-for="subject in currentShareSubjects"
              :key="subject.id"
              :value="subject.id"
            >{{ JSON.parse(subject.question).question }}</a-select-option>
          </a-select>
        </div>
        <div class="modal-content">
          <span>设置分数：</span>
          <a-input v-model="score" placeholder="请输入分数"></a-input>
        </div>
      </div>
    </a-modal>
    <div class="func_btns">
      <router-link v-if="editStatus" style="color: #1890FF" :to="{ name: 'welcome' }">&lt; 返回题库系统</router-link>
      <br>
      <a-button v-if="editStatus" @click="showSubjectType" type="primary">添加试卷题型</a-button>
      <a-button
        v-if="editStatus"
        @click="printExam"
        class="print_exam"
        v-print="printValue"
        type="primary"
      >打印试卷</a-button>
    </div>
    <div class="exam-content" >
      <h1>{{ examinationName }}</h1>
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
                <section v-if="editStatus" title="编辑">
                  <svg-icon @onClick="showUpdateModal(subject)" class="edit" icon-class="edit"></svg-icon>
                </section>
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
                <section v-if="editStatus" title="编辑">
                  <svg-icon @onClick="showUpdateModal(subject)" class="edit" icon-class="edit"></svg-icon>
                </section>
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
                <section v-if="editStatus" title="编辑">
                  <svg-icon @onClick="showUpdateModal(subject)" class="edit" icon-class="edit"></svg-icon>
                </section>
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
                <section v-if="editStatus" title="编辑">
                  <svg-icon @onClick="showUpdateModal(subject)" class="edit" icon-class="edit"></svg-icon>
                </section>
              </div>
            </div>
          </div>
        </div>
        <a-button v-if="editStatus" type="primary" @click="showSubject(subjectType.id)">+ 添加题目</a-button>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import BackUp from "_com/BackUp";
import { getSubjectType, addSubjectInfo } from "_api/QuestionManage.js";
import { getSubjectList } from "_api/QuestionShare.js";
import {
  setExaminationType,
  getSubjectTypeByExamId,
  setExaminationSubject
} from "_api/PaperManage.js";
import {
  getSubjectListByExam,
  updateSubjectInfo,
  getCommonSubject
} from "_api/ExaminationMake.js";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    BackUp
  },
  data() {
    //这里存放数据
    return {
      examinationName: "", // 试卷名称
      editStatus: true, // 试卷编辑状态
      printValue: "", // 调用打印
      addTypeValue: "", // 添加题目的类型 0 - 题库题目 1 - 临时题目
      // backUpVisible: false, // 背景幕布显示控制器
      choiceOptions: [], // 选择题选项
      setExamTypeVisible: false, // 试卷题型模态框
      setSubjectVisible: false, // 试卷题目模态框
      setUpdateSubjectVisible: false, // 更新题目信息模态框
      currentSubjectInfo: "", // 当前编辑的题目信息
      examId: "", // 试卷Id
      subjectName: "", // 题目描述
      subjectScore: 0, // 题目分数
      subjectTypeOptions: [], // 试卷题型单选组
      subjectTypeData: [], // 试卷默认题型
      subjectData: {}, // 试卷默认题目
      subjectOptions: [], // 试卷题目单选组
      score: 0, // 题目分数
      subjectTypeId: "", // 试卷题型Id
      subjectType: "", // 题目类型
      subjectId: "", // 试卷题目Id
      subjectTpyeValue: "", // 试卷题型单选值
      selectDefaultValue: "请选择题目", // 请选择题目
      currentShareSubjects: [], // 当前题目类型他人共享的题目信息
      defaultShareSubjects: [], // 初始他人共享的题目信息
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px"
      } // 单选按钮样式
    };
  },
  //监听属性 类似于data概念
  computed: {
    backUpVisible() {
      return this.$store.getters.layoutStatus;
    },
    spinText() {
      return this.$store.getters.loadText;
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    printExam() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.editStatus = false;
      this.printValue = "#printTest";
      this.timer = setTimeout(() => {
        this.editStatus = true;
      }, 500);
    },
    /**
     * 删除一个选项
     */
    deleteOption(index) {
      let currentSubjectId = this.subjectTypeId;
      if (currentSubjectId == 1) {
        this.choiceOptions.splice(index, 1);
      } else if (currentSubjectId == 2) {
        this.judgeOptions.splice(index, 1);
      }
    },
    /**
     * 选择选择题选项
     */
    chooseOption(value, index) {
      this.choiceOptions[index.key].option = value;
    },
    /**
     * 添加选项
     */
    addOption() {
      let currentSubjectId = this.subjectTypeId;
      if (currentSubjectId == 1) {
        this.choiceOptions.push({
          value: "",
          option: ""
        });
      } else if (currentSubjectId == 2) {
        this.judgeOptions.push("");
      }
    },
    // 关闭模态框后下拉框恢复默认值
    getDefaultValue() {
      this.score = 0;
      this.subjectId = "";
      this.selectDefaultValue = "请选择题目";
      this.addTypeValue = "";
    },
    /**
     * 更新题目信息
     */
    showUpdateModal(subjectInfo) {
      this.setUpdateSubjectVisible = true;
      this.currentSubjectInfo = {
        id: subjectInfo.id,
        question: JSON.parse(subjectInfo.question).question,
        options: JSON.parse(subjectInfo.question).options,
        questionType: subjectInfo.questionType
      };
    },
    /**
     * 更新题目信息
     */
    updateSubject() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "正在更新题目信息..."
      });
      let options = [],
        currentOptions = this.currentSubjectInfo.options;
      for (let key in currentOptions) {
        options.push({
          option: key,
          value: currentOptions[key]
        });
      }
      let updateInfo = {
        options: options,
        question: this.currentSubjectInfo.question,
        subjectId: this.currentSubjectInfo.id
      };
      updateSubjectInfo(updateInfo).then(res => {
        this.setUpdateSubjectVisible = false;
        this.getSubjectListByExam();
        this.$store.dispatch("ChangeLayoutStatus", { status: false });
        this.$message.success("题目信息更新成功！");
      });
    },
    /**
     * 选择添加类型
     */
    chooseAddType(e) {
      let subjectId = {
        questionType: this.subjectTypeId
      };
      let targetType = e.target.value;
      this.subjectType = targetType - 1;
      if (targetType == 1) {
        getSubjectList(subjectId).then(res => {
          this.subjectOptions = res.data.data;
        });
      }
    },
    /**
     * 选择题目
     */
    chooseSubject(value) {
      this.subjectId = value;
    },
    /**
     * 设置题目
     */
    setSubject() {
      if (this.subjectType == 1) {
        this.$store.dispatch("ChangeLayoutStatus", {
          status: true,
          loadText: "正在添加题目..."
        });
        if (this.subjectTypeId == 1) {
          let subjectInfo = {
            subjectTypeId: this.subjectTypeId,
            question: this.subjectName,
            options: this.choiceOptions,
            subjectType: this.subjectType,
            score: this.subjectScore
          };
          addSubjectInfo(subjectInfo).then(res => {
            let subjectId = res.data.data.subjectId;
            let subjectInfo = {
              examinationId: this.examId,
              typeId: this.subjectTypeId,
              subjectId: subjectId,
              score: this.subjectScore
            };
            setExaminationSubject(subjectInfo).then(res => {
              this.setSubjectVisible = false;
              this.getSubjectListByExam();
              this.$store.dispatch("ChangeLayoutStatus", { status: false });
              this.$message.success("添加成功！");
            });
          });
        } else {
          let currentSubjectInfo = {
            subjectTypeId: this.subjectTypeId,
            question: this.subjectName,
            subjectType: this.subjectType,
            score: this.score
          };
          addSubjectInfo(currentSubjectInfo).then(res => {
            let subjectId = res.data.data.subjectId;
            let subjectInfo = {
              examinationId: this.examId,
              typeId: this.subjectTypeId,
              subjectId: subjectId,
              score: this.score
            };
            setExaminationSubject(subjectInfo).then(res => {
              this.setSubjectVisible = false;
              this.getSubjectListByExam();
              this.$store.dispatch("ChangeLayoutStatus", { status: false });
              this.$message.success("添加成功！");
            });
          });
        }
      } else {
        let subjectInfo = {
          examinationId: this.examId,
          typeId: this.subjectTypeId,
          subjectId: this.subjectId,
          score: this.score
        };
        if (this.score == 0) {
          this.$message.warning("分数不能为0！");
        } else if (this.subjectId == "") {
          this.$message.warning("请选择题目后再设置！");
        } else {
          this.$store.dispatch("ChangeLayoutStatus", {
            status: true,
            loadText: "正在添加题目..."
          });
          setExaminationSubject(subjectInfo).then(res => {
            this.setSubjectVisible = false;
            this.score = 0;
            this.subjectId = "";
            this.selectDefaultValue = "请选择题目";
            this.getSubjectListByExam();
            this.$store.dispatch("ChangeLayoutStatus", { status: false });
            this.$message.success("添加成功！");
          });
        }
      }
    },
    /**
     * 打开设置题目模态框
     */
    showSubject(id) {
      this.setSubjectVisible = true;
      this.subjectTypeId = id;
      if (JSON.stringify(this.defaultShareSubjects) !== "[]") {
        this.currentShareSubjects = this.defaultShareSubjects.filter(
          item => item.questionType == id
        );
      }
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
        this.$store.dispatch("ChangeLayoutStatus", { status: false });
        if (res.data.data) {
          this.subjectData = res.data.data;
        }
      });
    },
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
     * 设置试卷类型
     */
    setExaminationType() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "正在设置试卷题型..."
      });
      setExaminationType(this.subjectTypeId, this.examId).then(res => {
        if (res.data.data) {
          this.setExamTypeVisible = false;
          this.getExamSubjectType();
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.$message.success("设置题型成功！");
        }
      });
    },
    onChange(e) {
      this.subjectTypeId = e.target.value;
    },
    showSubjectType() {
      this.setExamTypeVisible = true;
      getSubjectType().then(res => {
        this.subjectTypeOptions = res.data.data;
      });
    },
    /**
     * 获取他人与我共享题目信息
     */
    getShareWithMeSubjects() {
      getCommonSubject().then(res => {
        if(res.data.data) {
          this.defaultShareSubjects = res.data.data;
        }        
      });
    }
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.examId = this.$route.query.id;
    this.examinationName = this.$route.query.name;
    this.getExamSubjectType();
    this.getSubjectListByExam();
    this.getShareWithMeSubjects();
    if (this.$route.query.type) {
      this.editStatus = false;
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.choiceOptions = Array.from({ length: 4 }, () => ({
      value: "",
      option: ""
    }));
  },
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
.examination-make {
  .exam-content {
    padding: 40px;
    .subject-type {
      overflow: hidden;
      h2 {
        text-align: left;
      }
      .ant-btn {
        float: left;
        margin-bottom: 20px;
        margin-left: 10px;
        background: transparent;
        border: 0;
        outline: none;
        box-shadow: none;
        color: #1890ff;
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
.add-subject {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .subject-common {
    display: flex;
    width: 100%;
    margin: 20px 0;
    span {
      flex: 1;
    }
    .ant-input {
      flex: 3;
    }
  }
}
.choose-options {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .delete_icon {
    cursor: pointer;
  }
  .ant-select {
    margin: 10px 20px;
  }
}
.modal-content {
  display: flex;
  margin-top: 20px;
  span {
    flex: 1;
  }
  .ant-select {
    flex: 3;
  }
  .ant-input {
    flex: 3;
  }
}
.subject-title__update {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    flex: 1;
  }
  .ant-input {
    flex: 3;
  }
}
.subject-options__update {
  display: flex;
  margin: 15px 0;
  span {
    flex: 1;
  }
  .ant-input {
    flex: 3;
  }
}
.func_btns {
  text-align: left;
  padding: 40px 0 0 40px;
  .ant-btn {
    margin-top: 10px;
  }
  .print_exam {
    margin-left: 20px;
    background: #ff6767;
    border: 0;
  }
}
</style>