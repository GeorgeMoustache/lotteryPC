<template lang="pug">
table.recently-open(v-if="recentlyOpenEnabled")
  thead
    tr
      td 奖期
      td 开奖
  tbody
    tr(v-for="(item, index) in lottery.recently" :key="index")
      td(v-text="getIssue(item)")
      td
        template(v-if="/28$/.test(lottery.alias)")
          ul.PCDD(v-html="$root.format28(item.openNum)")
        template(v-else-if="/HKSIX$/.test(lottery.alias)")
          ul.HKSIX(v-html="$root.formatHK6(item.openNum)")
        template(v-else-if="/(PK10|FT)$/.test(lottery.alias)")
          ul.PK10
            li(v-for="(n, i) in item.openNum.split(',')" :key="i" v-text="n" :class="`ball-${n}`")
        template(v-else)
          span.num(v-for="(n, i) in item.openNum.split(',')" :key="i" v-text="n")
</template>

<script>
export default {
  name: 'RecentlyOpen',
  props: ['lottery'],
  computed: {
    recentlyOpenEnabled() {
      if (this.lottery.recently) {
        let recently = this.lottery.recently
        if (recently.length) {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    getIssue(item) {
      let { issue } = item;
      return /(PK10|FT)$/.test(this.category) ? (issue + '').substr(-7) : issue;
    },
  }
}
</script>