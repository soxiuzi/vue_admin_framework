<template>
  <div class='tree_select'>
    <a-directory-tree
      multiple
      defaultExpandAll
      @select="onSelect"
    >
      <a-tree-node
        title="学校系"
        key="0-0"
      >
        <a-tree-node
          title="leaf 0-0"
          key="0-0-0"
          isLeaf
        />
        <a-tree-node
          title="leaf 0-1"
          key="0-0-1"
          isLeaf
        />
      </a-tree-node>
      <a-tree-node
        title="parent 1"
        key="0-1"
      >
        <a-tree-node
          title="leaf 1-0"
          key="0-1-0"
          isLeaf
        />
        <a-tree-node
          title="leaf 1-1"
          key="0-1-1"
          isLeaf
        />
      </a-tree-node>
    </a-directory-tree>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  name: 'TreeSelect',
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {};
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    onSelect(keys) {
      console.log("Trigger Select", keys);
    },
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
</style>