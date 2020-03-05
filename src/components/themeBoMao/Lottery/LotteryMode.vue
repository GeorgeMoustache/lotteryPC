<template lang="pug">
.lottery-mode
  //- 主玩法模式
  ul.main
    li(v-for="item in modeList.main" :key="item.id" :class="{active: item.id == modeSelect.main}" @click="changeMainMode(item.id)") {{item.label}}
  //- 次玩法模式 (傳統時不顯示)
  ul.sub(v-show="subModeEnabled")
    li(v-for="item in modeList.sub" :key="item.id" :class="{active: item.id == modeSelect.sub}" @click="changeSubMode(item.id)") {{item.label}}
</template>

<script>
export default {
  name: 'LotteryMode',
  props: ['playType', 'useTemplate', 'modeList', 'modeSelect'],
  data() {
    return {

    }
  },
  computed: {
    //傳統及PC蛋蛋模板不顯示次玩法模式
    subModeEnabled() {
      if (this.useTemplate == 'tplCT' || this.useTemplate == 'tplPCDD') {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    //改變主玩法
    changeMainMode(id) {
      this.modeSelect.main = id;
      this.modeList.main.forEach(item => {
        if (item.id == id) {
          this.modeList.sub = item.children;
        }
      })
      this.modeSelect.sub = this.modeList.sub[0].id;

      //依照選取玩法模式更新參數
      this.$parent.getChildrenParams();
      this.$parent.updateComponent();
      this.$parent.renderTemplate();
      
      //記錄玩法
      this.$parent.savePlayType('mode');
    },
    //改變次玩法
    changeSubMode(id) {
      this.modeSelect.sub = id;

      //依照選取玩法模式更新參數
      this.$parent.getChildrenParams();
      this.$parent.updateComponent();
      this.$parent.renderTemplate();

      //記錄玩法
      this.$parent.savePlayType('mode');
    }
  }
}
</script>