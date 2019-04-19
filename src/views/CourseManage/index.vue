<template>
  <div class="course_manage">
    <a-modal
      :title="`添加${modalTitle}`"
      v-model="addVisible"
      centered
      okText="提交"
      cancelText="取消"
      @ok="addCourse"
    >
      <a-input v-model="addCourseInfo.curriculumName" :placeholder="`请输入${modalTitle}名称`"></a-input>
    </a-modal>
    <a-modal
      :title="`编辑${modalTitle}名称`"
      v-model="updateVisible"
      centered
      okText="提交"
      cancelText="取消"
      @ok="updateCourse"
    >
      <a-input v-model="updateInfo.curriculumName" :placeholder="`请输入${modalTitle}名称`"></a-input>
    </a-modal>
    <div class="choose_area">
      <div class="addAcademy">
        <a-button @click="showAddModal('course')" size="large" type="primary">添加课程</a-button>
      </div>请先选择您的课程：
      <tree-control @select-key="onSelect" :tree-data="treeData"></tree-control>
    </div>
    <transition
      name="fade"
      enter-active-class="slideInRight"
      leave-to-class="slideOutRight"
      mode="out-in"
    >
      <div v-if="courseId" class="function academy animated">
        <a-button @click="showUpdateModal" size="large" type="primary">修改课程名称</a-button>
        <a-button @click="deleteCourse" size="large" type="primary">删除课程</a-button>
        <a-button @click="showAddModal" size="large" type="primary">添加章节</a-button>
      </div>
      <div v-else-if="sectionId" class="function academy animated">
        <a-button @click="showUpdateModal" size="large" type="primary">修改章节名称</a-button>
        <a-button @click="deleteCourse" size="large" type="primary">删除章节</a-button>
        <a-button @click="showAddModal" size="large" type="primary">添加单元</a-button>
      </div>
      <div v-else-if="unitValue" class="function animated">
        <div class="choose_grade">
          <a-button @click="showUpdateModal" size="large" type="primary">修改单元名称</a-button>
          <a-button @click="deleteCourse" size="large" type="primary">删除单元</a-button>
          <!-- <a-button @click="showAddModal" size="large" type="primary">添加单元</a-button> -->
          <!-- <span>选择年级：</span> -->
          <!-- <a-select
            showSearch
            placeholder="请选择年级"
            optionFilterProp="children"
            style="width: 200px"
            @change="handleChange"
          >
            <a-select-option
              v-for="(grade, index) in selectData"
              :key="index"
              :value="grade.id"
            >{{ grade.gradeName }}</a-select-option>
          </a-select>-->
        </div>
        <!-- <div class="course_table">
          <a-button class="course_add" @click="handleAdd">添加课程</a-button>
          <a-table
            @change="pageChange"
            :loading="tableLoading"
            :pagination="pagination"
            bordered
            :dataSource="dataSource"
            :columns="columns"
          >
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                title="Sure to delete?"
                @confirm="() => onDelete(record.key)"
              >
                <a style="color: skyblue" href="javascript:;">修改课程</a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>-->
      </div>
    </transition>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import TreeControl from "_com/TreeControl/index.vue";
import {
  addCourse,
  updateCourse,
  deleteCourse,
  getCourseTree
} from "_api/CourseManage";
import { convertEnglish, getInitialByCourseName } from "_utils/utils";
import { getTreeStructure } from "_utils/courseManage";
import { constants } from "crypto";
import { truncate } from "fs";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { TreeControl },
  data() {
    //这里存放数据
    return {
      addVisible: false,
      updateVisible: false,
      modalTitle: "课程",
      courseId: "",
      sectionId: "",
      unitValue: "",
      gradeSelect: "",
      treeData: [],
      addCourseInfo: {
        parentId: 0,
        curriculumName: "",
        curriculumCode: "",
        initials: ""
      },
      updateInfo: {
        id: "",
        curriculumName: "",
        curriculumCode: "",
        initials: ""
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    // 打开添加对话框
    showAddModal(type = "other") {
      // console.log('添加类型',type)
      if (type == "course") {
        this.courseId = 0;
        this.modalTitle = "课程";
      }
      this.addVisible = true;
    },
    /**
     * 打开编辑对话框
     */
    showUpdateModal() {
      this.updateVisible = true;
    },
    // 添加课程
    addCourse() {
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: `正在添加${this.modalTitle}`
      });
      this.addCourseInfo.curriculumCode = convertEnglish(
        this.addCourseInfo.curriculumName
      );
      if (this.modalTitle === "课程") {
        this.addCourseInfo.initials = this.addCourseInfo.curriculumCode
          .slice(0, 1)
          .toUpperCase();
      } else {
        this.addCourseInfo.initials = "";
      }
      if (this.courseId === 0) {
        this.addCourseInfo.parentId = 0;
      } else {
        this.addCourseInfo.parentId =
          this.courseId || this.sectionId || this.unitValue;
      }
      if (this.addCourseInfo.curriculumName) {
        addCourse(this.addCourseInfo).then(res => {
          if (res.data.data) {
            this.addVisible = false;
            this.addCourseInfo.curriculumName = "";
            this.initData();
            this.$store.dispatch("ChangeLayoutStatus", { status: false });
            this.$message.success("添加成功！");
          }
        });
      } else {
        this.$message.warning("请填写名称后再添加！");
      }
    },
    /**
     * 更新课程名称
     */
    updateCourse() {
      this.$store.dispatch("ChangeLayoutStatus", { status: true, loadText: "更新名称..." })
      this.updateInfo.id = this.addCourseInfo.parentId;
      this.updateInfo.curriculumCode = convertEnglish(
        this.updateInfo.curriculumName
      );
      if (this.courseId) {
        this.updateInfo.initials = this.updateInfo.curriculumCode
          .slice(0, 1)
          .toUpperCase();
      } else {
        this.updateInfo.initials = "";
      }
      if (this.updateInfo.curriculumName) {
        updateCourse(this.updateInfo).then(updateRes => {
          if (updateRes.data.data) {
            this.initData();
            this.updateVisible = false;
            this.$store.dispatch("ChangeLayoutStatus", { status: false })
            this.$message.success("更新成功！")
          }
        });
      } else {
        this.$message.warning("请填写名称后再添加！");
      }
    },
    /**
     * 删除课程
     */
    deleteCourse() {
      let that = this;
      this.$confirm({
        title: `删除操作`,
        content: `确认删除？`,
        cancelText: "取消",
        centered: true,
        onOk() {
          that.$store.dispatch("ChangeLayoutStatus", {
            status: true,
            loadText: `正在删除`
          });
          deleteCourse(that.addCourseInfo.parentId).then(delRes => {
            if (delRes.data.data) {
              that.initData();
              that.$store.dispatch("ChangeLayoutStatus", { status: false });
              that.$message.success("删除成功！");
            }
          });
        }
      });
    },
    // 页面数据初始化
    initData() {
      getCourseTree().then(res => {
        let courseTree = res.data.data;
        this.treeData = getTreeStructure(courseTree);
      });
    },
    onSelect(keys) {
      if (keys.length) {
        let selectKey = JSON.parse(keys[0]);
        if (selectKey.type === "firstDir") {
          this.addCourseInfo.parentId = selectKey.id;
          this.courseId = selectKey.id;
          this.sectionId = "";
          this.unitValue = "";
          this.modalTitle = "章节";
        } else if (selectKey.type === "secondDir") {
          this.addCourseInfo.parentId = selectKey.id;
          this.sectionId = selectKey.id;
          this.courseId = "";
          this.unitValue = "";
          this.modalTitle = "单元";
        } else if (selectKey.type === "thirdDir") {
          this.addCourseInfo.parentId = selectKey.id;
          this.courseId = "";
          this.sectionId = "";
          this.unitValue = selectKey.id;
          this.modalTitle = "";
        }
      } else {
        this.addCourseInfo.parentId = 0;
        this.courseId = "";
        this.sectionId = "";
        this.modalTitle = "课程";
        this.unitValue = "";
      }
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
  .choose_area {
    flex: 1;
    padding-top: 100px;
    box-sizing: border-box;
    border-right: 2px solid #ccc;
    .ant-btn {
      margin: 30px 0;
    }
  }
  .function {
    display: flex;
    flex: 4;
    justify-content: center;
    padding-top: 200px !important;
    .ant-btn {
      margin-left: 30px;
    }
  }
}
</style>