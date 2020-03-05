<template lang="pug">
.current-open
  .label
    | 第
    span(v-text="lottery.openIssue")
    | 期
    span(v-show="!isOpened") &nbsp;&nbsp;正在开奖
  ul.lottery-balls(v-if="lottery.openNum" v-html="$root.formatOpenNum(lottery)")
</template>

<script>
export default {
  name: 'CurrentOpen',
  props: ['lottery'],
  data() {
    return {
      tid: null,
      isOpened: false,
      category: ''
    }
  },
  created() {
    this.init();
    this.$bus.$on('triggerLoopNum', this.loopNum);
    this.$bus.$on('changeOpenStatus', (value)=> {
      this.isOpened = value;
    });
  },
  beforeDestroy() {
    this.$bus.$off('triggerLoopNum');
    this.$bus.$off('changeOpenStatus');
  },
  methods: {
    init() {
      this.category = this.lottery.alias;
      if (this.lottery.openNum == '') {
        this.isOpened = false
        this.loopNum()
      } else {
        this.isOpened = true
      }
    },
    loopNum () {
      let that = this
      clearTimeout(this.tid)
      start()

      function start () {
        that.tid = setTimeout(() => {
          if (that.isOpened) return clearTimeout(that.tid)
          that.lottery.openNum = that.randomNum();
          start()
        }, 200)
      }
    },
    randomNum () {
      let category = this.category;
      let ary = [];
      if (/SSC$/.test(category)) {
        for (let i = 0; i < 5; i++) {
          ary.push(rand())
        }
      } else if (/(PK10|FT)$/.test(category)) {
        for (let i = 0; i < 10; i++) {
          ary.push(padLeftZero(rand(10, 1)))
        }
      } else if (/11X5$/.test(category)) {
        for (let i = 0; i < 5; i++) {
          ary.push(padLeftZero(rand(11)))
        }
      } else if (/[^P]K3$/.test(category)) {
        for (let i = 0; i < 3; i++) {
          ary.push(rand(6, 1))
        }
      } else if (/28$/.test(category)) {
        for (let i = 0; i < 3; i++) {
          ary.push(rand())
        }
      } else if (/HKSIX$/.test(category)) {
        for (let i = 0; i < 7; i++) {
          ary.push(padLeftZero(rand(49, 1)))
        }
      }

      return ary.join(',')

      function padLeftZero(str) {
        return ('0' + str).substr(-2)
      }
      function rand(max = 9, min = 0) {
        let {floor, random} = Math
        return floor(random() * (max - min + 1)) + min
      }
    }
  },
  watch: {
    //lottery資料父傳子時會有 delay，需要 watch 變化以正確 init
    'lottery.alias': 'init'
  }
}
</script>