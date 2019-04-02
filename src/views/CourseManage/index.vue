<template>
  <div class="course_manage">
    <div class="choose_area">
      <div class="addAcademy">
        <a-button @click="showModal" size="large" type="primary">添加课程</a-button>
      </div>请先选择您的课程：
      <tree-control @select-key="onSelect" :tree-data="treeData"></tree-control>
    </div>
    <transition
      name="fade"
      enter-active-class="slideInRight"
      leave-to-class="slideOutRight"
      mode="out-in"
    >
      <div v-if="academyId" class="function academy animated">
        <a-button @click="showModal" size="large" type="primary">修改学院名称</a-button>
        <a-button @click="showModal" size="large" type="primary">添加院系</a-button>
      </div>
      <div v-else-if="facultyId" class="function academy animated">
        <a-button @click="showModal" size="large" type="primary">修改院系名称</a-button>
        <a-button @click="showModal" size="large" type="primary">添加专业</a-button>
      </div>
      <div v-else-if="gradeSelect" class="function animated">
        <div class="choose_grade">
          <span>选择年级：</span>
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
          </a-select> -->
        </div>
        <div class="course_table">
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
                <!-- <a style="color: skyblue; margin-left: 10px" href="javascript:;">修改课程</a> -->
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
import TreeControl from "_com/TreeControl/index.vue";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: { TreeControl },
  data() {
    //这里存放数据
    return {
      academyId: '',
      facultyId: '',
      gradeSelect: '',
      treeData: [],
      addCourseInfo: {
        parentId: '',
        curriculumName: '',
        curriculumCode: '',
        initials: '',
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    showModal() {
      console.log('打开模态框！')
    },
    onSelect() {
      console.log('选择')
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
  .choose_area {
    flex: 1;
    .ant-btn {
      margin: 30px 0;
    }
  }
  .function_area {
    flex: 4;
  }
}
</style>