<template>
  <div class="question_manage">
    <!-- 编辑题目信息 -->
    <a-modal
      okText="确定"
      cancelText="取消"
      :closable="false"
      centered
      v-model="setUpdateSubjectVisible"
      @ok="updateSubject"
    >
      <div class="choice_chapter">
        <span>选择题目所属的章节范围：</span>
        <div class="chapter_area">
          <a-checkbox
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :checked="checkAll"
          >全选</a-checkbox>
          <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange">
            <span style="color: red" slot="label" slot-scope="{value}">{{value}}</span>
          </a-checkbox-group>
        </div>
      </div>
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
    <!-- 添加填空题模态框 -->
    <a-modal
      title="编辑填空题题目信息"
      width="70%"
      v-model="fillVisible"
      @ok="editFillInfo"
      cancelText="取消"
      okText="确定"
    >
      <div class="choice_chapter">
        <span>选择题目所属的章节范围：</span>
        <div class="chapter_area">
          <a-checkbox
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :checked="checkAll"
          >全选</a-checkbox>
          <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange">
            <span style="color: red" slot="label" slot-scope="{value}">{{value}}</span>
          </a-checkbox-group>
        </div>
      </div>
      <editor @input="getFillValue" :height="300"></editor>
    </a-modal>
    <!-- 添加判断题模态框 -->
    <a-modal
      title="编辑判断题题目信息"
      width="70%"
      :centered="true"
      v-model="judgeVisible"
      @ok="editJudgeInfo"
      cancelText="取消"
      okText="确定"
    >
      <div class="choice_chapter">
        <span>选择题目所属的章节范围：</span>
        <div class="chapter_area">
          <a-checkbox
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :checked="checkAll"
          >全选</a-checkbox>
          <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange">
            <span style="color: red" slot="label" slot-scope="{value}">{{value}}</span>
          </a-checkbox-group>
        </div>
      </div>
      <div class="judge_item">
        <a-input v-model="judgeInfoDes" placeholder="输入判断题题目"></a-input>
      </div>
    </a-modal>
    <!-- 添加选择题模态框 -->
    <a-modal
      title="编辑选择题题目信息"
      width="70%"
      v-model="choiceVisible"
      @ok="editSubjectInfo"
      cancelText="取消"
      okText="确定"
    >
      <div class="choice_chapter">
        <span>选择题目所属的章节范围：</span>
        <div class="chapter_area">
          <a-checkbox
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :checked="checkAll"
          >全选</a-checkbox>
          <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange">
            <span style="color: red" slot="label" slot-scope="{value}">{{value}}</span>
          </a-checkbox-group>
        </div>
      </div>
      <editor @input="getChoiceValue" :height="200"></editor>
      <div class="options" v-for="(item, index) in choiceOptions" :key="index">
        <a-input v-model="item.value" placeholder="请输入选项内容"></a-input>
        <a-select v-model="item.option" placeholder="选择选项" @change="chooseOption">
          <a-select-option :key="index" value="A">A</a-select-option>
          <a-select-option :key="index" value="B">B</a-select-option>
          <a-select-option :key="index" value="C">C</a-select-option>
          <a-select-option :key="index" value="D">D</a-select-option>
          <a-select-option :key="index" value="E">E</a-select-option>
          <a-select-option :key="index" value="F">F</a-select-option>
          <a-select-option :key="index" value="G">G</a-select-option>
          <a-select-option :key="index" value="H">H</a-select-option>
          <a-select-option :key="index" value="I">I</a-select-option>
        </a-select>
        <div @click="deleteOption(index)">
          <svg-icon class="delete_icon" icon-class="delete"></svg-icon>
        </div>
      </div>
      <a-button v-if="optionStatus" class="add_btn" @click="addOption" type="primary">添加选项</a-button>
    </a-modal>
    <div class="select_course">
      <span>选择题目所属课程：</span>
      <a-select placeholder="请选择课程" style="width: 120px" @change="chooseCourse">
        <a-select-option
          v-for="course in courseInfo"
          :key="course.id"
          :value="course.id"
        >{{ course.curriculumName }}</a-select-option>
      </a-select>
    </div>
    <a-radio-group v-if="courseId" @change="chooseSubjectType">
      <a-radio-button
        v-for="(radio, index) in subjectTypeRadioGroup"
        :value="radio.value"
        :key="index"
      >{{ radio.name }}</a-radio-button>
    </a-radio-group>
    <div class="addBtn">
      <a-button @click="showSubjectModal">
        <svg-icon icon-class="add"></svg-icon>添加题目
      </a-button>
      <div style="text-align: left; display: flex" v-if="courseId" class="question">
        <a-button @click="downloadTemplate">
          <a-icon type="upload"/>下载题目模板
        </a-button>
        <!-- <a style="color: skyblue" href="http://www.baidu.com">下载题目模板</a> -->
        <a-upload :showUploadList="false" :action="actionUrl" @change="addSubjectByExcel">
          <a-button>
            <a-icon type="upload"/>批量上传题目
          </a-button>
        </a-upload>
      </div>
    </div>
    <a-table
      :loading="{ spinning: loadStatus, tip: '数据加载中...' }"
      bordered
      :pagination="pagination"
      :dataSource="dataSource"
      :columns="columns"
      :locale="{emptyText: '暂无数据'}"
    >
      <template slot="operation" slot-scope="text">
        <a-button v-if="dataSource.length" @click="showEditVisible(text)" type="danger">修改题目信息</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import Editor from "_com/Edit/index";
import { getCourseTree } from "_api/CourseManage";
import { getSubjectType, addSubjectInfo } from "_api/QuestionManage";
import { getSubjectList } from "_api/QuestionShare";
import { updateSubjectInfo } from "_api/ExaminationMake";
import { filter } from "minimatch";
import { constants } from "crypto";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
const plainOptions = [];
let defaultCheckedList = [];

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Editor
  },
  data() {
    //这里存放数据
    return {
      optionStatus: true, // 添加选项按钮
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      plainOptions,
      actionUrl: "", // 批量上传题目地址
      courseId: "", // 课程Id
      currentSubjectInfo: {}, // 当前题目信息
      courseInfo: [], // 课程信息
      chapterInfo: [], // 课程的章节信息
      chapterId: [], // 章节Id
      setUpdateSubjectVisible: false,
      loadStatus: false, // 表格加载状态
      dataSource: [], // 题目类型表格数据
      judgeInfoDes: "", // 判断题描述
      judgeOptions: [], // 判断题数据
      choiceOptions: [], // 选择题数据
      subjectTypeId: "", // 题目类型Id
      subjectTypeRadioGroup: [], // 题目类型单选按钮组
      choiceSubjectDescribe: "", // 选择题题目描述
      choiceVisible: false, // 选择题模态框
      judgeVisible: false, // 判断题模态框
      fillVisible: false, // 填空题及简答题模态框
      fillDescribe: "", // 填空题及简答题描述
      pagination: {
        pageSize: 5
      },
      columns: [
        {
          title: "序号",
          dataIndex: "index"
        },
        {
          title: "题目范围",
          dataIndex: "area"
        },
        {
          title: "题目描述",
          dataIndex: "subjectDes"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ] // 题目类型表格表头
    };
  },
  //监听属性 类似于data概念
  computed: {
    userId() {
      return this.$store.getters.userId;
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    /**
     * 下载题目模板
     */
    downloadTemplate() {
      window.open('http://172.16.213.31:8001/')
    },
    /**
     * 批量添加题目（导入excel）
     */
    addSubjectByExcel(info) {
      if (this.courseId) {
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          this.$message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      }
    },
    onChange(checkedList) {
      this.checkAll = checkedList.length === this.plainOptions.length;
    },
    /**
     * 选择章节
     */
    chooseChapter(e) {
      this.chapterId.splice(0, 1, e.target.value);
      console.log("选择章节", this.chapterId);
    },
    onCheckAllChange(e) {
      if (e.target.checked) {
        this.plainOptions.forEach((item, index) =>
          this.checkedList.splice(index, 1, item.value)
        );
      } else {
        this.checkedList = [];
      }
      Object.assign(this, {
        indeterminate: false,
        checkAll: e.target.checked
      });
    },
    /**
     * 下拉选择课程
     */
    chooseCourse(value) {
      this.courseId = value;
      this.actionUrl = `http://192.168.1.112:8082/subject/uploadSubjects?userId=${
        this.userId
      }&curriculumId=${value}`;
      this.plainOptions = [];
      let chapterInfo = this.courseInfo.filter(item => item.id == value)[0]
        .children;
      for (let i = 0; i < chapterInfo.length; i++) {
        this.plainOptions.push({
          label: chapterInfo[i].curriculumName,
          value: chapterInfo[i].id
        });
      }
      if (this.subjectTypeId) {
        let subjectInfo = {
          questionType: this.subjectTypeId
        };
        this.getSubjectInfo(subjectInfo);
      }
    },
    /**
     * 显示更新信息模态框
     */
    showEditVisible(subjectInfo) {
      this.checkedList = JSON.parse(subjectInfo.typeGroup);
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
        features: this.checkedList,
        options: options,
        question: this.currentSubjectInfo.question,
        subjectId: this.currentSubjectInfo.id
      };
      let subjectInfo = {
        questionType: this.subjectTypeId
      };
      updateSubjectInfo(updateInfo).then(res => {
        this.setUpdateSubjectVisible = false;
        this.getSubjectInfo(subjectInfo);
        this.$store.dispatch("ChangeLayoutStatus", { status: false });
        this.$message.success("题目信息更新成功！");
      });
    },
    /**
     * 添加选项
     */
    addOption() {
      let currentSubjectId = this.subjectTypeId;
      if (currentSubjectId == 1) {
        if (this.choiceOptions.length == 9) {
          this.optionStatus = false;
          console.log("添加时当前长度：", this.choiceOptions.length);
        }
        this.choiceOptions.push({
          value: "",
          option: ""
        });
      } else if (currentSubjectId == 2) {
        this.judgeOptions.push("");
      }
    },
    /**
     * 获取题目信息
     */
    getSubjectInfo(subjectInfo) {
      this.dataSource = [];
      this.loadStatus = true;
      getSubjectList(subjectInfo).then(res => {
        let subjectData = res.data.data;
        if (subjectData && subjectData.length) {
          let filterData = subjectData.filter(
            item => item.curriculumId == this.courseId
          );
          for (let i = 0; i < filterData.length; i++) {
            let subjectArea = [];
            if (filterData[i].typeGroup) {
              let defaultArea = JSON.parse(filterData[i].typeGroup);

              defaultArea.map(item => {
                for (let i = 0; i < this.plainOptions.length; i++) {
                  if (item == this.plainOptions[i].value) {
                    subjectArea.push(this.plainOptions[i].label);
                  }
                }
              });
            } else {
              subjectArea = [];
            }

            this.dataSource.push({
              key: filterData[i].id,
              index: i + 1,
              subjectDes: JSON.parse(filterData[i].question).question,
              operation: filterData[i],
              area: subjectArea.join(",")
            });
          }
        }
        this.loadStatus = false;
      });
    },
    /**
     * 选择题目类型
     */
    chooseSubjectType(e) {
      this.subjectTypeId = e.target.value;
      let subjectInfo = {
        questionType: e.target.value
      };
      this.getSubjectInfo(subjectInfo);
    },
    /**
     * 删除一个选项
     */
    deleteOption(index) {
      let currentSubjectId = this.subjectTypeId;
      if (currentSubjectId == 1) {
        this.optionStatus = true;
        this.choiceOptions.splice(index, 1);
      } else if (currentSubjectId == 2) {
        this.judgeOptions.splice(index, 1);
      }
    },
    chooseOption(value, index) {
      this.choiceOptions[index.key].option = value;
    },
    getFillValue(htmlValue, textValue) {
      this.fillDescribe = textValue;
    },
    /**
     * 获取选择题题目描述
     */
    getChoiceValue(htmlValue, textValue) {
      this.choiceSubjectDescribe = textValue;
    },
    /**
     * 添加题目类型
     */
    addSubjectType() {
      console.log("添加题目类型");
    },
    showSubjectModal() {
      console.log("当前题目类型：", this.subjectTypeId);
      let typeId = this.subjectTypeId;
      if (typeId == 1) {
        this.choiceVisible = true;
      } else if (typeId == 2) {
        this.judgeVisible = true;
      } else if (typeId == 3 || typeId == 4) {
        this.fillVisible = true;
      } else {
        this.$message.warning("请先选择题目类型！");
      }
    },
    /**
     * 更新题目类型
     */
    updateSubjectType(key) {
      console.log("修改元素的key：", key);
    },
    /**
     * 删除题目类型
     */
    deleteSubjectType() {
      console.log("删除当前题目类型");
    },
    /**
     * 添加填空题或简答题信息
     */
    editFillInfo() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "保存题目信息中..."
      });
      let fillInfo = {
        features: this.checkedList,
        options: "",
        question: this.fillDescribe,
        subjectTypeId: this.subjectTypeId,
        curriculumId: this.courseId
      };
      let subjectInfo = {
        questionType: this.subjectTypeId
      };
      addSubjectInfo(fillInfo).then(res => {
        if (res.data.data.isSuccess) {
          this.fillVisible = false;
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.$message.success("保存成功！");
          this.fillDescribe = "";
          this.getSubjectInfo(subjectInfo);
        }
      });
    },
    /**
     * 编辑判断题题目信息
     */
    editJudgeInfo() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "保存题目信息中..."
      });
      let judgeInfo = {
        features: this.checkedList,
        subjectTypeId: this.subjectTypeId,
        question: this.judgeInfoDes,
        options: "",
        curriculumId: this.courseId
      };
      let subjectInfo = {
        questionType: this.subjectTypeId
      };
      addSubjectInfo(judgeInfo).then(res => {
        if (res.data.data.isSuccess) {
          this.judgeVisible = false;
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.$message.success("保存成功！");
          this.getSubjectInfo(subjectInfo);
        }
      });
    },
    /**
     * 编辑选择题题目信息
     */
    editSubjectInfo() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "保存题目信息中..."
      });
      let choiceInfo = {
        features: this.checkedList,
        subjectTypeId: this.subjectTypeId,
        question: this.choiceSubjectDescribe,
        options: this.choiceOptions,
        curriculumId: this.courseId
      };
      let subjectInfo = {
        questionType: this.subjectTypeId
      };
      addSubjectInfo(choiceInfo).then(res => {
        if (res.data.data.isSuccess) {
          this.choiceVisible = false;
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.$message.success("保存成功！");
          this.getSubjectInfo(subjectInfo);
        }
      });
    },
    // 页面数据初始化
    initData() {
      getSubjectType().then(res => {
        let subjectTypeList = res.data.data;
        if (subjectTypeList && subjectTypeList.length) {
          for (let i = 0; i < subjectTypeList.length; i++) {
            this.subjectTypeRadioGroup.push({
              value: subjectTypeList[i].id,
              name: subjectTypeList[i].subjectTypeName
            });
          }
        }
      });
      getCourseTree().then(res => {
        if (res.data.data) {
          this.courseInfo = res.data.data;
        }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.initData();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.choiceOptions = Array.from({ length: 4 }, () => ({
      value: "",
      option: ""
    }));
    this.judgeOptions = Array.from({ length: 10 });
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
// 组件样式
.question_manage {
  margin-top: 50px;
  .select_course {
    span {
      margin-right: 20px;
    }
  }
  .ant-radio-group {
    margin-bottom: 30px;
    margin-top: 20px;
  }
  .ant-btn {
    display: block;
    margin-bottom: 5px;
  }
  .ant-table {
    .ant-btn {
      margin-left: 30px;
      background: transparent;
      border: 0;
      box-shadow: none;
      &:first-child {
        color: #1890ff;
      }
      &:last-child {
        &:hover {
          color: #f5222d;
        }
      }
    }
  }
}
// 选择题模态框选项
.options {
  display: flex;
  margin: 30px 0;
  .ant-input {
    flex: 4;
    margin-right: 20px;
  }
  .ant-select {
    flex: 1;
  }
}
// 删除选项图标
.delete_icon {
  margin-left: 30px;
  font-size: 30px;
  cursor: pointer;
}
// 添加选项图标
.add_btn {
  margin-left: 50%;
}
// 判断题模态框输入框
.judge_item {
  display: flex;
  margin: 30px 0;
  align-items: center;
  span {
    font-size: 18px;
  }
  .ant-input {
    margin-left: 10px;
  }
}
// 选择题模态框章节范围
.choice_chapter {
  display: flex;
  margin-bottom: 30px;
  span {
    flex: 1;
  }
  .chapter_area {
    flex: 3;
    .ant-checkbox-group {
      display: inline;
    }
  }
}
</style>