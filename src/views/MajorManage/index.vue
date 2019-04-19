<template>
  <div class="course_manage">
    <a-modal
      :title="`添加${modalTitle}`"
      v-model="addVisible"
      centered
      okText="提交"
      cancelText="取消"
      @ok="addMajor"
    >
      <a-input v-model="addMajorInfo.professionalName" :placeholder="`请输入${modalTitle}名称`"></a-input>
    </a-modal>
    <a-modal
      :title="`编辑${modalTitle}名称`"
      v-model="updateVisible"
      centered
      okText="提交"
      cancelText="取消"
      @ok="updateMajor"
    >
      <a-input v-model="addMajorInfo.professionalName" :placeholder="`请输入${modalTitle}名称`"></a-input>
    </a-modal>
    <a-modal
      title="添加课程"
      v-model="addCourseVisible"
      centered
      okText="提交"
      cancelText="取消"
      @ok="addCourse"
    >
      <span>选择添加的课程：</span>
      <a-select
        showSearch
        placeholder="可输入关键字进行搜索"
        optionFilterProp="children"
        style="width: 200px"
        @select="chooseAddCourse"
        :filterOption="filterOption"
      >
        <a-select-option
          v-for="course in courseList"
          :key="course.id"
          :title="course.curriculumCode"
        >{{ course.curriculumName }}</a-select-option>
      </a-select>
    </a-modal>
    <div class="choose_major">
      <div class="addAcademy">
        <a-button @click="showModalForAdd('course')" size="large" type="primary">添加学院</a-button>
      </div>请先选择您的专业：
      <tree-control @select-key="onSelect" :tree-data="treeData"></tree-control>
    </div>
    <transition
      name="fade"
      enter-active-class="slideInRight"
      leave-to-class="slideOutRight"
      mode="out-in"
    >
      <div v-if="academyId" class="function academy animated">
        <a-button @click="showModalForUpdate" size="large" type="primary">修改学院名称</a-button>
        <a-button @click="deleteMajor" size="large" type="primary">删除学院</a-button>
        <a-button @click="showModalForAdd" size="large" type="primary">添加院系</a-button>
      </div>
      <div v-else-if="facultyId" class="function academy animated">
        <a-button @click="showModalForUpdate" size="large" type="primary">修改院系名称</a-button>
        <a-button @click="deleteMajor" size="large" type="primary">删除院系</a-button>
        <a-button @click="showModalForAdd" size="large" type="primary">添加专业</a-button>
      </div>
      <div v-else-if="gradeSelect" class="function animated">
        <div class="choose_grade">
          <span>选择年级：</span>
          <a-select
            showSearch
            placeholder="请选择年级"
            optionFilterProp="children"
            style="width: 200px"
            @change="selectGrade"
          >
            <a-select-option
              v-for="(grade, index) in selectData"
              :key="index"
              :value="grade.id"
            >{{ grade.gradeName }}</a-select-option>
          </a-select>
        </div>
        <div class="course_table">
          <a-button class="course_add" @click="showModalForUpdate">修改专业名称</a-button>
          <a-button class="course_add" @click="deleteMajor">删除专业</a-button>
          <a-button class="course_add" @click="showAddCourseModal">添加课程</a-button>
          <a-table
            @change="pageChange"
            :loading="tableLoading"
            :pagination="pagination"
            bordered
            :dataSource="dataSource"
            :columns="columns"
            :locale="{emptyText: '暂无数据'}"
          >
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                title="确认删除该课程?"
                cancelText="取消"
                okText="确定"
                @confirm="() => deleteCourse(record.key)"
              >
                <a style="color: skyblue" href="javascript:;">删除课程</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { message } from "ant-design-vue";
import TreeControl from "_com/TreeControl/index.vue";
import {
  getTreeData,
  addMajor,
  getGradeList,
  UpdateMajorInfo,
  DeleteMajor,
  getCourseList,
  getMajorCourse,
  addCourseForMajor,
  deleteMajorCourse
} from "_api/MajorManage";
import { convertEnglish, deepCopy } from "_utils/utils";
import { getTreeStructure } from "_utils/majorManage";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: { TreeControl },
  data() {
    //这里存放数据
    return {
      modalTitle: "",
      testData: [],
      addMajorInfo: {
        // 添加专业信息
        parentId: 0,
        sort: "",
        professionalName: "",
        professionalCode: ""
      },
      updateMajorInfo: {
        // 更新专业信息
        id: "",
        sort: 0,
        professionalName: "",
        professionalCode: ""
      },
      deleteCourseInfo: {
        // 删除课程信息
        professionalId: "",
        curriculumId: "",
        gradeId: ""
      },
      addCourseInfo: {
        // 添加课程信息
        professionalId: "", // 专业Id
        curriculumId: "", // 课程Id
        gradeId: "" // 年级Id
      },
      selectData: [], // 年级选择数据
      updateVisible: false,
      addVisible: false,
      addCourseVisible: false,
      test: false,
      value: "",
      saveId: "",
      gradeId: "", // 年级Id
      academySort: "", // 学院排序
      facultySort: "", // 院系排序
      majorSort: "", // 专业排序
      academyId: "", // 学院Id
      facultyId: "", // 院系Id
      major: "", // 专业
      gradeSelect: false, // 年级选择
      tableLoading: false,
      pagination: {
        pageSize: 4
      },
      courseList: [], // 课程列表
      treeData: [],
      treeExpandedKeys: [],
      dataSource: [],
      count: 2,
      columns: [
        {
          title: "序号",
          dataIndex: "index"
        },
        {
          title: "课程名称",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
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
  watch: {
    major(val) {
      val ? (this.gradeSelect = true) : (this.gradeSelect = false);
    }
  },
  //方法集合
  methods: {
    /**
     * 添加课程
     */
    addCourse() {
      this.tableLoading = true;
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "正在添加..."
      });
      addCourseForMajor(this.addCourseInfo).then(res => {
        if (res.data.data) {
          this.addCourseVisible = false;
          this.tableLoading = false;
          this.getMajorCourse();
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.$message.success("添加成功！");
        }
      });
    },
    /**
     * 删除专业课程
     */
    deleteCourse(id) {
      this.deleteCourseInfo.professionalId = this.major;
      this.deleteCourseInfo.curriculumId = id;
      this.deleteCourseInfo.gradeId = this.gradeId;
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "正在删除..."
      });
      deleteMajorCourse(this.deleteCourseInfo).then(res => {
        if (res.data.data) {
          this.getMajorCourse();
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.$message.success("删除成功！");
        }
      });
    },
    /**
     * 添加专业项
     */
    addMajor() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "正在添加..."
      });
      this.addMajorInfo.professionalCode = convertEnglish(
        this.addMajorInfo.professionalName
      );
      this.addMajorInfo.parentId = this.saveId;
      if (this.saveId === 0) {
        this.addMajorInfo.sort = this.academySort;
      } 
      addMajor(this.addMajorInfo).then(res => {
        if (res.data.data) {
          this.initData();
          this.addVisible = false;
          this.$store.dispatch("ChangeLayoutStatus", { status: false });
          this.$message.success("添加成功！");
        }
      });
    },
    /**
     * 删除专业项
     */
    deleteMajor() {
      let that = this
      this.$confirm({
        title: "删除操作",
        content: "确定删除？",
        centered: true,
        cancelText: "取消",
        onOk() {
          that.$store.dispatch("ChangeLayoutStatus", {
            status: true,
            loadText: "正在删除..."
          });
          DeleteMajor(that.addMajorInfo.parentId).then(res => {
            if (res.data.data) {
              that.initData();
              that.$store.dispatch("ChangeLayoutStatus", { status: false });
              that.$message.success("删除成功！");
              that.facultyId = ""
              that.academyId = ""
              that.gradeSelect = false
            }
          });
        }
      });
    },
    /**
     * 更新专业项
     */
    updateMajor() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "正在更新信息..."
      });
      this.updateMajorInfo.professionalCode = convertEnglish(
        this.addMajorInfo.professionalName
      );
      this.updateMajorInfo.id = this.addMajorInfo.parentId;
      this.updateMajorInfo.professionalName = this.addMajorInfo.professionalName;
      UpdateMajorInfo(this.updateMajorInfo).then(res => {
        this.initData();
        this.updateVisible = false;
        this.$store.dispatch("ChangeLayoutStatus", { status: false });
        this.$message.success("信息更新成功！");
      });
    },
    /**
     * 表格分页功能
     */
    pageChange(current) {
      console.log("当前：", current);
    },
    /**
     * 选择添加的课程
     */
    chooseAddCourse(value) {
      this.addCourseInfo.curriculumId = value;
      this.addCourseInfo.gradeId = this.gradeId;
      this.addCourseInfo.professionalId = this.major;
    },
    filterOption(input, option) {
      // console.log('option:', option)
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    /**
     * 树形选择
     */
    onSelect(keys) {
      if (keys.length) {
        let selectKey = JSON.parse(keys[0]);
        // console.log("选择的keys:", selectKey);
        if (selectKey.type === "firstDir") {
          this.addMajorInfo.parentId = selectKey.id;
          this.addMajorInfo.sort = selectKey.length;
          this.updateMajorInfo.sort = selectKey.sort;
          this.academyId = selectKey.id;
          this.saveId = selectKey.id;
          this.facultyId = "";
          this.major = "";
          this.modalTitle = "学院";
        } else if (selectKey.type === "secondDir") {
          this.addMajorInfo.parentId = selectKey.id;
          this.addMajorInfo.sort = selectKey.length;
          this.updateMajorInfo.sort = selectKey.sort;
          this.facultyId = selectKey.id;
          this.saveId = selectKey.id;
          this.academyId = "";
          this.major = "";
          this.modalTitle = "院系";
        } else if (selectKey.type === "thirdDir") {
          this.addMajorInfo.parentId = selectKey.id;
          this.addMajorInfo.sort = selectKey.length;
          this.updateMajorInfo.sort = selectKey.sort;
          this.major = selectKey.id;
          this.saveId = selectKey.id;
          this.academyId = "";
          this.facultyId = "";
          this.modalTitle = "专业";
        }
      } else {
        this.addMajorInfo.parentId = "";
        this.addMajorInfo.sort = "";
        this.updateMajorInfo.sort = "";
        this.academyId = "";
        this.saveId = 0;
        this.facultyId = "";
        this.major = "";
        this.modalTitle = "";
      }
    },
    /**
     * 年级选择
     */
    selectGrade(value) {
      this.gradeId = value;
      this.getMajorCourse();
    },
    /**
     * 打开添加对话框
     */
    showModalForAdd(type = "other") {
      if (type === "course") {
        this.saveId = 0;
      } else {
        console.log("添加其他");
      }
      this.addVisible = true;
    },
    /**
     * 打开修改对话框
     */
    showModalForUpdate() {
      this.updateVisible = true;
    },
    /**
     * 打开添加课程对话框
     */
    showAddCourseModal() {
      this.addCourseVisible = true;
    },
    /**
     * 获取专业课程
     */
    getMajorCourse() {
      this.dataSource = [];
      getMajorCourse(this.major, this.gradeId).then(res => {
        let courseList = res.data.data;
        if (courseList && courseList.length) {
          for (let i = 0; i < courseList.length; i++) {
            this.dataSource.push({
              name: courseList[i].curriculumName,
              index: i + 1,
              key: courseList[i].id
            });
          }
        } else {
          this.dataSource = [];
        }
        console.log("获取课程列表：", res.data.data);
      });
    },
    /**
     * 页面初始化数据
     */
    initData() {
      // 获取年级列表
      getGradeList().then(res => {
        this.selectData = res.data.data;
      });
      // 获取学院树形结构
      getTreeData().then(res => {
        const treeData = res.data.data;
        this.academySort = treeData.length + 1;
        this.addMajorInfo.sort = treeData.length + 1;
        this.treeData = getTreeStructure(treeData);
        // console.log('树形结构：', this.treeData)
      });
      // 获取课程列表
      getCourseList().then(res => {
        this.courseList = res.data.data;
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
.course_manage {
  display: flex;
  background: #fff;
  min-height: calc(93vh - 180px);
  .choose_major {
    border-right: 2px solid #ccc;
    box-sizing: border-box;
    padding-top: 100px;
    flex: 1;
    .addAcademy {
      margin-bottom: 70px;
    }
  }
  .academy {
    display: flex;
    justify-content: center;
    padding-top: 200px !important;
    // align-items: center;
  }
  .function {
    flex: 4;
    box-sizing: border-box;
    padding: 100px 20px 0;
    .ant-btn {
      margin-left: 50px;
    }
    .course_table {
      overflow: hidden;
      .course_add {
        float: right;
        margin: 20px;
      }
      .ant-table-wrapper {
        margin-top: 52px;
      }
    }
  }
}
</style>