<template lang="pug">
.mode-wrap-hk6
  template(v-if="lotteryMode.length")
    a(v-for="(item, idx) in lotteryMode" :key="item.id" :class="{active: item == modeObj}" v-text="item.label" @click="changeMode(item)")
  template(v-else)
    span 加载中
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Mode_HK6',
  props: {
    alias: String
  },
  data () {
    return {
      category: this.alias,
      modeObj: {},
      subModeObj: {},
      _mode: '',
      mode: ''
    }
  },
  computed: {
    ...mapGetters([
      'requesting',
      'error',
      'lotteryMode',
      'selectMode'
    ])
  },
  created () {
    this.init()
  },
  methods: {
    ...mapMutations({
      selectModeHandler: 'selectMode'
    }),
    init () {
      this.fetchData()
    },
    fetchData () {
      this.category = this.alias
      let category = this.category
      this.$store.dispatch('lotteryMode', {
        category: category
      }).then(list => {
        let mode = ''
        mode = this.selectMode[category]
        if (mode == null) {
          mode = list[0].children[0].alias
        }
        this.modeObj = list.find(child => {
          return child.children.find(item => item.alias == mode)
        })

        this.subModeObj = this.modeObj.children.find(item => item.alias == mode) || {}
        this.mode = mode
        this._mode = mode
        this.selectModeHandler({
          category: category,
          mode: this.mode
        })
      })
    },
    changeMode (item) {

    }
  },
  watch: {
    alias: 'init'
  }
}
</script>

<style lang="scss" scoped>
.mode-wrap-hk6 {
  background: $layout-primary;
  line-height: 36px;
  padding-left: 15px;
  a {
    color: #fff;
  }
}
</style>
