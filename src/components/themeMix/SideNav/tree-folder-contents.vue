<template lang="pug">
ul.tree
  li.tree-node(v-for="child in children")
    tree-folder(v-if="child.children" :folder="child")
    .tree-content(v-else @click="select(child)" :title="child.label")
      span.icon
        img(:src="child.icon")
      span.label(v-text="child.label")
</template>

<script>
import TreeFolder from './tree-folder';

export default {
  name: 'treeFolderContents',
  props: ['children'],
  components: {
    TreeFolder
  },
  methods: {
    select (child) {
      this.$router.push({path: `/lottery/${child.alias}`})
    }
  }
}
</script>
