<template>
  <div class="course_manage">
    <div class="choose_major">
      请先选择您的专业：
      <a-tree @select="onSelect">
        <a-tree-node key="xueyuan1">
          <span slot="title" style="color: #1890ff">学院</span>
          <a-tree-node title="院系" key="yuanxi1">
            <a-tree-node title="专业1" key="major_1"/>
            <a-tree-node title="专业2" key="major_2"/>
            <a-tree-node title="专业3" key="major_3"/>
          </a-tree-node>
          <a-tree-node title="院系" key="yuanxi2">
            <a-tree-node title="专业" key="major_4"/>
            <a-tree-node title="专业" key="major_5"/>
          </a-tree-node>
        </a-tree-node>
        <a-tree-node key="xueyuan2">
          <span slot="title" style="color: #1890ff">学院</span>
          <a-tree-node title="院系" key="yuanxi3">
            <a-tree-node title="专业1" key="major_6"/>
            <a-tree-node title="专业2" key="major_7"/>
            <a-tree-node title="专业3" key="major_8"/>
          </a-tree-node>
          <a-tree-node title="院系" key="yuanxi4">
            <a-tree-node title="专业" key="major_9"/>
            <a-tree-node title="专业" key="major_10"/>
          </a-tree-node>
        </a-tree-node>
      </a-tree>
    </div>
    <transition
      name="fade"
      enter-active-class="slideInRight"
      leave-to-class="slideOutRight"
      mode="out-in"
    >
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
            <a-select-option value="firstClass">大一</a-select-option>
            <a-select-option value="secondClass">大二</a-select-option>
            <a-select-option value="thirdClass">大三</a-select-option>
            <a-select-option value="fourClass">大四</a-select-option>
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
import TreeSelect from "_com/TreeSelect";
import { message } from "ant-design-vue";
import { getInTheater } from '_api/test'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: { TreeSelect },
  data() {
    //这里存放数据
    return {
      test: false,
      value: "",
      major: "", // 专业
      gradeSelect: false, // 年级选择
      tableLoading: false,
      pagination: {
        total: 4,
        pageSize: 2
      },
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
      let majorValue = keys[0].split("_")[0];
      if (majorValue === "major") {
        this.major = keys[0];
        console.log(`选择的专业：${this.major}`);
      } else {
        this.major = "";
        this.gradeSelect = false;
      }
    },
    /**
     * 年级选择
     */
    handleChange(value) {
      console.log(`选择年级${value}`);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    getInTheater().then(res => {
      console.log('请求结果：', res)
    })
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