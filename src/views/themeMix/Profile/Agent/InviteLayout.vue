<template lang="pug">
.agent-wrap
  .invite-layout
    Tabs(v-model="tabIndex" :animated="false" @on-click="clickTab")
      TabPane(v-for="(item, idx) in tabs" :key="idx" :label="item.label")
    router-view
</template>

<script>
export default {
  name: 'InviteLayout',
  data () {
    return {
      tabIndex: ~this.$route.path.indexOf('manageInvite') ? 0 : 1,
      tabs: [{
        path: '/profile/agent/manageInvite',
        label: '下级开户'
      },{
        path: '/profile/agent/manageIcode',
        label: '邀请码管理'
      }]
    }
  },
  methods: {
    clickTab (name) {
      this.$router.push(this.tabs[name].path)
    }
  },
  watch: {
    '$route' (to, from) {
      let {path} = to
      this.tabIndex = ~path.indexOf('manageInvite') ? 0 : 1
    }
  }
}
</script>

<style>

</style>
