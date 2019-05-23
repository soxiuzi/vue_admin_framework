<template>
  <div class="course_manage">
    <div ref="utils" class="utils" :style="{ top: utilsTop, left: utilsLeft }" v-if="firstStatus">
      <a-button @click="showUpdateModal" size="small" type="primary">
        <svg-icon icon-class="edit_major"></svg-icon>编辑
      </a-button>
      <a-button @click="deleteCourse" size="small" type="primary">
        <svg-icon icon-class="delete_major"></svg-icon>删除
      </a-button>
      <a-button @click="showAddModal" size="small" type="primary">
        <svg-icon icon-class="add_major"></svg-icon>添加
      </a-button>
    </div>

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
        <span @click="showAddModal('course')">+课程</span>
        <!-- <a-button @click="showAddModal('course')" size="large" type="primary">添加课程</a-button> -->
      </div>请先选择您的课程：
      <tree-control @rightClick="rightClick" @select-key="onSelect" :tree-data="treeData"></tree-control>
    </div>
    <div class="seat" :style="{flex: (courseId || sectionId || unitValue) ? 0 : 4}"></div>
    <transition
      name="fade"
      enter-active-class="slideInRight"
      leave-to-class="slideOutRight"
      mode="out-in"
    >
      <div v-if="courseId" class="function academy animated">
        <!-- <a-button @click="showUpdateModal" size="large" type="primary">修改课程名称</a-button>
        <a-button @click="deleteCourse" size="large" type="primary">删除课程</a-button>
        <a-button @click="showAddModal" size="large" type="primary">添加章节</a-button>-->
      </div>
      <div v-else-if="sectionId" class="function academy animated">
        <!-- <a-button @click="showUpdateModal" size="large" type="primary">修改章节名称</a-button>
        <a-button @click="deleteCourse" size="large" type="primary">删除章节</a-button>
        <a-button @click="showAddModal" size="large" type="primary">添加单元</a-button>-->
      </div>
      <div v-else-if="unitValue" class="function animated">
        <div class="course_edit">
          <span>名称编辑：</span>
          <a-button class="course_add" size="small"  @click="showUpdateModal"><svg-icon icon-class="edit_major"></svg-icon>编辑</a-button>
          <a-button class="course_add" size="small" @click="deleteCourse"><svg-icon icon-class="delete_major"></svg-icon>删除</a-button>
        </div>
        <div class="choose_grade">
          <!-- <a-button @click="showUpdateModal" size="large" type="primary">修改单元名称</a-button>
          <a-button @click="deleteCourse" size="large" type="primary">删除单元</a-button> -->
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
      addVisible: false, // 添加模态框
      updateVisible: false, // 更新模态框
      modalTitle: "课程", // 添加类型
      courseId: "", // 课程Id
      sectionId: "", // 章节Id
      unitValue: "", // 单元值
      gradeSelect: "", // 年级选择
      treeData: [], // 树结构数据
      addCourseInfo: {
        parentId: 0,
        curriculumName: "",
        curriculumCode: "",
        initials: ""
      }, // 添加课程信息
      updateInfo: {
        id: "",
        curriculumName: "",
        curriculumCode: "",
        initials: ""
      } // 更新课程信息
    };
  },
  //监听属性 类似于data概念
  computed: {
    firstStatus() {
      return this.$store.getters.firstStatus;
    }
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    rightClick(e) {
      let that = this;
      that.utilsTop = e.event.clientY - 5 + "px";
      that.utilsLeft = e.event.clientX - 165 + "px";

      let selectKey = JSON.parse(e.node.eventKey);
      if (selectKey.type === "firstDir") {
        this.$store.dispatch("ChangeFirstStatus", true);
        this.addCourseInfo.parentId = selectKey.id;
        this.courseId = selectKey.id;
        this.sectionId = "";
        this.unitValue = "";
        this.modalTitle = "章节";
      } else if (selectKey.type === "secondDir") {
        this.$store.dispatch("ChangeFirstStatus", true);
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
      } else {
        this.addCourseInfo.parentId = 0;
        this.courseId = "";
        this.sectionId = "";
        this.modalTitle = "课程";
        this.unitValue = "";
      }
    },
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
      this.$store.dispatch("ChangeLayoutStatus", {
        status: true,
        loadText: "更新名称..."
      });
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
            this.$store.dispatch("ChangeLayoutStatus", { status: false });
            this.$message.success("更新成功！");
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
              that.unitValue = ""
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
  .utils {
    position: absolute;
    z-index: 9999;
    padding: 15px;
    display: flex;
    flex-direction: column;
    background: url("../.../../../assets/majorManage/kuang.png");
    background-size: 100% 100%;
    .ant-btn {
      font-size: 13px;
      margin-top: 5px;
      margin-left: 5px;
      &:first-child {
        background: #1890ff;
      }
      &:nth-of-type(2) {
        background: #f9645d;
        box-shadow: none;
        outline: none;
        border: none;
      }
      &:nth-of-type(3) {
        background: #4fd083;
        box-shadow: none;
        outline: none;
        border: none;
      }
    }
  }
  .choose_area {
    flex: 1;
    padding-top: 30px;
    box-sizing: border-box;
    border-right: 2px solid #ccc;
    .ant-btn {
      margin: 30px 0;
    }
    .addAcademy {
      text-align: left;
      margin-left: 103px;
      font-size: 18px;
      margin-bottom: 20px;
      span {
        color: #1890ff;
        cursor: pointer;
      }
    }
  }
  .function {
    display: flex;
    flex: 4;
    // justify-content: center;
    padding: 100px 20px 0 !important;
    text-align: left;
    .course_edit {
      margin: 15px 0;
      .ant-btn {
        color: #ffffff;
        &:nth-of-type(1) {
          background: #1890FF;
          margin-left: 0;
        }
        &:nth-of-type(2) {
          background: #F9645D;
        }
      }
    }
    .ant-btn {
      &:nth-of-type(1), &:nth-of-type(2) {
        margin-left: 20px;
      }
    }
  }
}
</style>