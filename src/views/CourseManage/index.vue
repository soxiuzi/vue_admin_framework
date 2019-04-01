<template>
  <div class="course_manage">
    <a-modal title="添加课程" v-model="visible" centered okText="提交" cancelText="取消" @ok="addMajor">
      <a-input v-model="addMajorInfo.parentId" placeholder="请输入专业父级ID"></a-input>
      <a-input v-model="addMajorInfo.sort" placeholder="请输入排列顺序"></a-input>
      <a-input v-model="addMajorInfo.professionalName" placeholder="请输入专业名称"></a-input>
      <a-input v-model="addMajorInfo.professionalCode" placeholder="请输入专业码"></a-input>
    </a-modal>
    <div class="choose_major">
      请先选择您的专业：
      <tree-control @select-key="onSelect" :tree-data="treeData"></tree-control>
    </div>
    <transition
      name="fade"
      enter-active-class="slideInRight"
      leave-to-class="slideOutRight"
      mode="out-in"
    >
      <div v-if="academyId" class="function academy animated">
        <a-button @click="addMajor('academy')" size="large" type="primary">添加学院</a-button>
      </div>
      <div v-if="facultyId" class="function academy animated">
        <a-button @click="addMajor('faculty')" size="large" type="primary">添加院系</a-button>
      </div>
      <div v-if="gradeSelect" class="function animated">
        <div class="choose_grade">
          <span>选择年级：</span>
          <a-select
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
          </a-select>
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
import { message } from "ant-design-vue";
import TreeControl from "_com/TreeControl/index.vue";
import { getTreeData, addMajor, getGradeList } from "_api/CourseManage/index";

const treeData = [
  {
    title: "学院1",
    key: JSON.stringify({
      type: "xueyuan",
      value: "xueyuan1"
    }),
    slots: {
      icon: "dir"
    },
    children: [
      {
        title: "院系1",
        key: JSON.stringify({
          type: "yuanxi",
          value: "yuanxi1"
        }),
        slots: {
          icon: "dir"
        },
        children: [
          {
            title: "专业1",
            key: JSON.stringify({ type: "major", value: "major1" })
          },
          {
            title: "专业2",
            key: JSON.stringify({ type: "major", value: "major2" })
          }
        ]
      },
      {
        title: "院系2",
        key: "yuanxi2",
        children: [{ key: "专业3" }]
      }
    ]
  }
];

export default {
  //import引入的组件需要注入到对象中才能使用
  components: { TreeControl },
  data() {
    //这里存放数据
    return {
      testData: "",
      addMajorInfo: {
        parentId: "",
        sort: "",
        professionalName: "",
        professionalCode: ""
      },
      selectData: [], // 年级选择数据
      visible: false,
      test: false,
      value: "",
      academyId: "", // 学院Id
      facultyId: "", // 院系Id
      major: "", // 专业
      gradeSelect: false, // 年级选择
      tableLoading: false,
      pagination: {
        total: 4,
        pageSize: 2
      },
      treeData: treeData,
      treeExpandedKeys: [],
      dataSource: [
        {
          key: "0",
          name: "Edward King 0",
          courseInfo: "课程信息介绍",
          index: "index"
        },
        {
          key: "1",
          name: "Edward King 1",
          courseInfo: "课程信息介绍",
          index: "index"
        },
        {
          key: "2",
          name: "Edward King 1",
          courseInfo: "课程信息介绍",
          index: "index"
        }
      ],
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
          title: "课程信息",
          dataIndex: "courseInfo"
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
    addMajor(type) {
      if (type === "academy") {
        this.addMajorInfo.parentId = 0;
      } else if (type === "faculty") {
        this.addMajorInfo.parentId = this.facultyId;
      }
      console.log("查看父级Id：", this.addMajorInfo);
      // addMajor(this.addMajorInfo).then(res => {
      //   if (res.data.data) {
      //     this.visible = false;
      //   }
      // });
    },
    /**
     * 添加课程
     */
    handleAdd() {
      if (!this.major) {
        message.warning("请先选择您的专业！");
      } else {
        console.log("添加课程");
      }
    },
    /**
     * 表格分页功能
     */
    pageChange(current) {
      console.log("当前：", current);
    },
    /**
     * 树形选择
     */
    onSelect(keys) {
      if (keys.length) {
        let selectKey = JSON.parse(keys[0]);
        if (selectKey.type === "xueyuan") {
          this.academyId = selectKey.value;
          this.facultyId = "";
          this.major = "";
        } else if (selectKey.type === "yuanxi") {
          this.facultyId = selectKey.value;
          this.academyId = "";
          this.major = "";
        } else if (selectKey.type === "major") {
          this.major = selectKey.value;
          this.academyId = "";
          this.facultyId = "";
        }
        console.log("当前选择类型：", selectKey.type);
      } else {
        this.academyId = "";
        this.facultyId = "";
        this.major = "";
      }
    },
    /**
     * 年级选择
     */
    handleChange(value) {
      console.log(`选择年级：${value}`);
    },
    /**
     * 打开对话框
     */
    showModal() {
      this.visible = true;
    },
    /**
     * 页面初始化数据
     */
    initData() {
      // 获取年级列表
      getGradeList().then(res => {
        this.selectData = res.data.data;
        // console.log('年级列表：', res.data.data)
      });
      // 获取学院树形结构
      getTreeData().then(res => {
        console.log("获取树形结构：", res);
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
    padding-top: 150px;
    flex: 1;
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