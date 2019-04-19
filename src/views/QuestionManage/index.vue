<template>
  <div class="question_manage">
    <!-- 添加填空题模态框 -->
    <a-modal
      title="编辑填空题题目信息"
      width="70%"
      v-model="fillVisible"
      @ok="editFillInfo"
      cancelText="取消"
      okText="确定"
    >
       <editor @input="getFillValue" :height="300"></editor>
    </a-modal>
    <!-- 添加判断题模态框 -->
    <a-modal
      title="编辑判断题题目信息"
      width="70%"
      v-model="judgeVisible"
      @ok="editJudgeInfo"
      cancelText="取消"
      okText="确定"
    >
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
      <editor @input="getChoiceValue" :height="200"></editor>
      <div class="options" v-for="(item, index) in choiceOptions" :key="index">
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
    </a-modal>
    <a-table bordered :dataSource="dataSource" :columns="columns">
      <template slot="operation" slot-scope="text, record">
        <a-button
          v-if="dataSource.length"
          @click="showSubjectModal(record.key)"
          type="danger"
        >编辑题目信息</a-button>
      </template>
    </a-table>
  </div>
</template>

<script>
import Editor from "_com/Edit/index";
import { getSubjectType, addSubjectInfo } from "_api/QuestionManage";
import { constants } from 'crypto';
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Editor
  },
  data() {
    //这里存放数据
    return {
      dataSource: [],
      judgeInfoDes: '',
      judgeOptions: [],
      choiceOptions: [],
      count: 2,
      subjectTypeId: "",
      choiceSubjectDescribe: "",
      choiceVisible: false,
      judgeVisible: false,
      fillVisible: false,
      fillDescribe: '',
      columns: [
        {
          title: "序号",
          dataIndex: "index"
        },
        {
          title: "题目类型",
          dataIndex: "subjectType"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
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

      // console.log('添加选项')
    },
    /**
     * 删除一个选项
     */
    deleteOption(index) {
      let currentSubjectId = this.subjectTypeId
      if(currentSubjectId == 1) {
        this.choiceOptions.splice(index, 1);
      }else if(currentSubjectId == 2) {
        this.judgeOptions.splice(index, 1)
      }
    },
    chooseOption(value, index) {
      this.choiceOptions[index.key].option = value;
    },
    getFillValue(htmlValue, textValue) {
      this.fillDescribe = textValue
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
    showSubjectModal(key) {
      this.subjectTypeId = key;
      if (key == 1) {
        this.choiceVisible = true;
      } else if (key == 2) {
        this.judgeVisible = true;
      } else if (key == 3 || key == 4) {
        this.fillVisible = true
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
      this.$store.dispatch("ChangeLayoutStatus", { status: true, loadText: "保存题目信息中..." })
      let fillInfo = {
        features: '',
        options: '',
        question: this.fillDescribe,
        subjectTypeId: this.subjectTypeId
      }
      addSubjectInfo(fillInfo).then(res => {
        if(res.data.data.isSuccess) {
          this.fillVisible = false
          this.$store.dispatch("ChangeLayoutStatus", { status: false, })
          this.$message.success("保存成功！")
          this.fillDescribe = ""
        }
      })
    },
    /**
     * 编辑判断题题目信息
     */
    editJudgeInfo() {
      this.$store.dispatch("ChangeLayoutStatus", { status: true, loadText: "保存题目信息中..." })
      let judgeInfo = {
        features: '',
        subjectTypeId: this.subjectTypeId,
        question: this.judgeInfoDes,
        options: ''
      }
      addSubjectInfo(judgeInfo).then(res => {
        if(res.data.data.isSuccess) {
          this.judgeVisible = false
          this.$store.dispatch("ChangeLayoutStatus", { status: false, })
          this.$message.success("保存成功！")
        }
      })
    },
    /**
     * 编辑选择题题目信息
     */
    editSubjectInfo() {
      this.$store.dispatch("ChangeLayoutStatus", { status: true, loadText: "保存题目信息中..." })
      let choiceInfo = {
        features: "",
        subjectTypeId: this.subjectTypeId,
        question: this.choiceSubjectDescribe,
        options: this.choiceOptions
      };
      addSubjectInfo(choiceInfo).then(res => {
        if(res.data.data.isSuccess) {
          this.choiceVisible = false
          this.$store.dispatch("ChangeLayoutStatus", { status: false, })
          this.$message.success("保存成功！")
        }
      });
    },
    // 页面数据初始化
    initData() {
      this.dataSource = [];
      getSubjectType().then(res => {
        let subjectTypeList = res.data.data;
        if (subjectTypeList && subjectTypeList.length) {
          for (let i = 0; i < subjectTypeList.length; i++) {
            this.dataSource.push({
              key: subjectTypeList[i].id,
              index: i + 1,
              subjectType: subjectTypeList[i].subjectTypeName
            });
          }
        } else {
          this.dataSource = [];
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
.question_manage {
  text-align: left;
  margin-top: 100px;
  & > .ant-btn {
    margin: 50px 0;
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
.delete_icon {
  margin-left: 30px;
  font-size: 30px;
  cursor: pointer;
}
.add_btn {
  margin-left: 50%;
}
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
</style>