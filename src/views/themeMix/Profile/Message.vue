<template lang="pug">
.profile_message
  Tabs(v-model="tabIndex" :animated="false")
    TabPane(v-for="(item, index) in ['个人消息', '系统消息']" :label="item" :key="index")
      message-list(:fetch="tabIndex == index" :type="1-index")
</template>

<script>
import MessageList from 'components/themeMix/Profile/MessageList';

export default {
  name: 'ProfileMessage',
  components: {
    MessageList
  },
  data () {
    return {
      tabIndex: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.profile_message {
  padding: 20px 0;
  background: #fff;
  &-main {
    padding-bottom: 200px;
  }
  &-body {
    padding: 20px 0;
  }
}
</style>
