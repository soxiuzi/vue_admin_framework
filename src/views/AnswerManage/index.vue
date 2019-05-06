<template>
  <div class="answer_manage">
    <a-modal
      v-model="editorVisible"
      :closable="false"
      centered
      okText="确定"
      cancelText="取消"
      @ok="confirmEdit"
    >
      <editor :value="defaultValue" @input="getEditValue"></editor>
    </a-modal>
    <a-radio-group @change="chooseSubjectType" buttonStyle="solid">
      <a-radio-button
        v-for="radio in subjectTypeOptions"
        :key="radio.id"
        :value="radio.id"
      >{{ radio.subjectTypeName }}</a-radio-button>
    </a-radio-group>
    <a-table
      :loading="tableLoadVisible"
      :columns="columns"
      :dataSource="subjectData"
      :pagination="pagination"
      bordered
      :locale="{emptyText: '暂无数据'}"
    >
      <template slot="corperation" slot-scope="text">
        <a-button @click="showEditorModal(text)" type="primary" size="small">编辑答案</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import { getSubjectType } from "_api/QuestionManage";
import { getSubjectList } from "_api/QuestionShare";
import { editAnswer, getAnswer } from "_api/AnswerManage";
import Editor from "_com/Edit";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
const columns = [
  {
    title: "题目序号",
    dataIndex: "index"
  },
  {
    title: "题目描述",
    dataIndex: "name"
  },
  {
    title: "操作",
    dataIndex: "corperation",
    scopedSlots: { customRender: "corperation" }
  }
];
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Editor
  },
  data() {
    //这里存放数据
    return {
      tableLoadVisible: false, // 表格加载状态
      columns, // 表格表头
      subjectTypeOptions: [], // 题目类型选项
      subjectData: [], // 题目信息
      editorVisible: false, // 编辑模态框
      subjectId: "", // 题目Id
      editValue: "", // 答案值
      defaultValue: "", // 默认答案值
      pagination: { 
        pageSize: 8
      }, // 表格一页显示数
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    /**
     * 页面数据初始化
     */
    initData() {
      getSubjectType().then(res => {
        this.subjectTypeOptions = res.data.data;
      });
    },
    /**
     * 选择题目类型
     */
    chooseSubjectType(e) {
      this.tableLoadVisible = true;
      let subjectInfo = {
        questionType: e.target.value
      };
      this.subjectData = [];
      getSubjectList(subjectInfo).then(res => {
        if (res.data.data) {
          let subjectData = res.data.data;
          for (let i = 0; i < subjectData.length; i++) {
            this.subjectData.push({
              key: subjectData[i].id,
              index: i + 1,
              name: JSON.parse(subjectData[i].question).question,
              corperation: subjectData[i].id
            });
          }
          this.tableLoadVisible = false
        }
      });
    },
    /**
     * 编辑答案
     */
    showEditorModal(index) {
      this.subjectId = index;
      this.editorVisible = true;
      this.defaultValue = "";
      getAnswer(index).then(res => {
        let answer = res.data.data;
        if (answer) {
          if (index == answer.subjectId) {
            this.defaultValue = answer.answerValue;
          } else {
            this.defaultValue = "";
          }
        } else {
          this.defaultValue = "";
        }
      });
    },
    /**
     * 获取编辑内容
     */
    getEditValue(htmlValue, textValue) {
      this.editValue = textValue;
    },
    /**
     * 更新答案内容
     */
    confirmEdit() {
      this.$store.dispatch("ChangeLayoutStatus", { status: true, loadText: "正在保存答案..." })
      let editInfo = {
        subjectId: this.subjectId,
        answerValue: this.editValue
      };
      editAnswer(editInfo).then(res => {
        if (res.data.data) {
          this.editorVisible = false;
          this.$store.dispatch("ChangeLayoutStatus", { status: false })
          this.$message.success("答案保存成功！")
        }
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
.answer_manage {
  .ant-table-wrapper {
    margin-top: 40px;
  }
}
</style>