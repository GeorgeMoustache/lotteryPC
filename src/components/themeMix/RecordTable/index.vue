<template lang="pug">
.record-table.table-stripe
  table
    thead
      tr
        template(v-for="(column, index) in columns")
          td(:class="headTdCls(index)" :key="index")
            template(v-if="column.type === 'selection'")
              Checkbox.ivu-checkbox-gray(:value="isSelectAll", :disabled="!data.length", @on-change="selectAll")
            template(v-else)
              span(v-text="column.title")
    tbody(v-if="rebuildData.length")
      tr(v-for="(row, index) in rebuildData" :key="index")
        template(v-for="(column, idx) in cloneColumns")
          cell(:class="bodyTdCls(idx)" :row="row", :column="column", :index="index", :checked="rowChecked(row._index)" :disabled="rowDisabled(row._index)")
    tbody(v-else)
      tr
        td.null-tip(:colspan="columns.length") 暂无内容
  Spin(fix v-if="loading")
    Icon(type="load-c" size=18 class="spin-icon-load")
    div 加载中
</template>

<script>
import cell from './cell';
import { deepCopy, getRandomStr, getAllColumns } from './assist';

let rowKey = 1
let columnKey = 1

export default {
  name: 'RecordTable',
  components: {
    cell
  },
  props: {
    columns: Array,
    data: Array,
    loading: Boolean
  },
  data () {
    const colsWithId = this.makeColumnsId(this.columns)
    return {
      objData: this.makeObjData(),
      rebuildData: [],
      cloneColumns: this.makeColumns(colsWithId)
    }
  },
  computed: {
    isSelectAll () {
      let data = this.rebuildData
      let length = data.length
      if (!length) return false
      if (!data.find(item => !item._disabled)) return false
      let state = true
      let {objData} = this
      for (let i = 0; i < length; i++) {
        let obj = objData[data[i]._index]
        if (obj && !obj._isChecked && !obj._disabled) {
          state = false
          break;
        }
      }
      return state
    },
    columnsLen() {
      return this.columns.length;
    }
  },
  created () {
    this.rebuildData = this.makeDataWithSortAndFilter()
  },
  methods: {
    makeObjData () {
      let data = {}
      this.data.forEach((row, index) => {
        const newRow = deepCopy(row)

        if (newRow._disabled) {
          newRow._disabled = newRow._disabled
        } else {
          newRow._disabled = false
        }

        if (newRow._checked) {
            newRow._isChecked = newRow._checked;
        } else {
            newRow._isChecked = false;
        }
        data[index] = newRow
      })
      return data
    },
    makeColumnsId (columns) {
      return columns.map(item => {
        if ('children' in item) item.children = this.makeColumnsId(item.children)
        item.__id = getRandomStr(6)
        return item
      })
    },
    makeColumns (cols) {
      let columns = deepCopy(getAllColumns(cols))
      return columns.map((column, index) => {
        column._index = index
        column._columnKey = columnKey++
        column._filterChecked = []
        return column
      })
    },
    makeDataWithSortAndFilter () {
      let data = this.makeDataWithSort()
      this.cloneColumns.forEach(col => data = this.filterData(data, col))
      return data
    },
    makeDataWithSort () {
      let data = this.makeData()
      return data
    },
    makeData () {
      let data = deepCopy(this.data)
      data.forEach((row, index) => {
        row._index = index
        row._rowKey = rowKey++
      })
      return data
    },
    filterData (data, column) {
      return data.filter(row => {
        let checkeds = column._filterChecked
        let length = checkeds.length
        let status = !length
        for (let i = 0; i < length; i++) {
          status = column.filterMethod(checkeds[i], row)
          if (status) break;
        }
        return status;
      })
    },
    rowChecked (_index) {
      // ? timer
      let obj = this.objData[_index]
      return obj && obj._isChecked
    },
    rowDisabled (_index) {
      let obj = this.objData[_index]
      return obj && obj._disabled
    },
    toggleSelect (_index) {
      let data = {}
      let {objData} = this

      for (let i in objData) {
        if (parseInt(i) === _index) {
          data = objData[i]
          break;
        }
      }
      const status = !data._isChecked

      objData[_index]._isChecked = status;

      const selection = this.getSelection()
      this.$emit('on-selection-change', selection)
    },
    getSelection () {
      let selectionIndexs = []
      for (let i in this.objData) {
        if (this.objData[i]._isChecked) selectionIndexs.push(parseInt(i))
      }
      return JSON.parse(JSON.stringify(this.data.filter((data, index) => selectionIndexs.indexOf(index) > - 1)))
    },
    selectAll (status) {
      let {objData} = this
      for (const data of this.rebuildData) {
        if (objData[data._index]._disabled) {
          continue;
        } else {
          objData[data._index]._isChecked = status
        }
      }
      const selection = this.getSelection()
      this.$emit('on-selection-change', selection)
    },
    // 头部样式
    headTdCls(index) {
      return {
        'td-first': index == 0,
        'td-last': index == this.columnsLen - 1,
      }
    },
    bodyTdCls(index) {
      return {
        'td-first': index == 0,
        'td-last': index == this.columnsLen - 1,
      }
    }
  },
  watch: {
    data: {
      handler () {
        const oldDataLen = this.rebuildData.length
        this.objData = this.makeObjData()
        this.rebuildData = this.makeDataWithSortAndFilter()
      },
      deep: true
    },
    columns: {
      handler () {
        const colsWithId = this.makeColumnsId(this.columns)
        this.cloneColumns = this.makeColumns(colsWithId)
        this.rebuildData = this.makeDataWithSortAndFilter()
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.record-table {
  position: relative;
  table {
    border-collapse: collapse;
    border-spacing: 0;
    visibility: visible !important;
    font-size: 12px;
  }
  &.table-stripe tbody tr:nth-child(2n) {
    background-color: #f8f8f9;
  }
  th,
  td {
    padding: 10px 0;
    border-bottom: 1px dashed #d6d6d6;
    color: #707070;
    line-height: 1;
  }
  td.td-first {
    padding-left: 10px;
  }
  td.td-last {
    padding-right: 10px;
  }
  th {
    background: #f8f8f9;
    text-align: left;
    font-weight: normal;
  }
  td {
    transition: background-color 0.2s ease-in-out;
  }
  tr:hover td {
    background-color: #ebf7ff;
  }
  tr:last-child td {
    border:none;
  }
}
</style>
