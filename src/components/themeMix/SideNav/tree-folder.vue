<template lang="pug">
div
  .tree-content(:key="folder.label" :class="cls" @click="change" :title="folder.label")
    span(v-text="folder.label")
    Icon(:type="`${visibled ? 'arrow-up-b' : 'arrow-down-b'}`")
  tree-folder-contents(:children="folder.children" v-show="visibled")
</template>

<script>
export default {
  name: 'treeFolder',
  props: {
    'folder': Object,
    'cls': String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  beforeCreate () {
    // 基于es6的写法异步加载组件
    this.$options.components.TreeFolderContents = () => import('./tree-folder-contents')
  },
  data () {
    return {
      visibled: this.visible
    }
  },
  methods: {
    change () {
      this.visibled = !this.visibled
    }
  }
}
</script>
