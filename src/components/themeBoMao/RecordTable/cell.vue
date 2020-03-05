<template lang="pug">
td(ref="cell", :class="alignCls(column, row)")
  template(v-if="renderType == 'selection'")
    Checkbox.ivu-checkbox-gray(:value="checked", @on-change="toggleSelect", :disabled="disabled")
  template(v-else-if="renderType == 'normal'")
    span(v-text="row[column.key]")
  template(v-else-if="renderType == 'html'")
    span(v-html="row[column.key]")
  template(v-else-if="renderType == 'render'")
    Cell(
      :row="row",
      :column="column",
      :index="index",
      :render="column.render"
    )
</template>

<script>
import Cell from './expand';

export default {
  name: 'TableCell',
  props: {
    row: Object,
    column: Object,
    index: Number,
    checked: Boolean,
    disabled: Boolean
  },
  components: {
    Cell
  },
  data () {
    return {
      renderType: ''
    }
  },
  created () {
    let { type } = this.column
    let result = 'normal'
    if (type == 'html') {
      result = 'html'
    } else if (type === 'selection') {
      result = 'selection'
    } else if (this.column.render) {
      result = 'render'
    }
    this.renderType = result
  },
  methods: {
    toggleSelect () {
      this.$parent.toggleSelect(this.index)
    },
    alignCls (column, row = {}) {
      return [
        {
          [`${column.className}`]: column.className
        }
      ]
    }
  }
}
</script>

<style>

</style>
