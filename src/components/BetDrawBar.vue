<template lang="pug">
#betdraw-bar(:class="{ 'active': showDraw }" v-if="betDrawBarEnabled")
  .back(v-if="appConfig.themeName != 'theme5' && appConfig.themeName != 'theme6'")
    a(@click="showDraw = false")
      Icon(type="chevron-left")
      | 收回
  table
    thead
      tr( v-if="/[^P]K3/.test(category)" )
        th 期号
        th 奖号
        th 和值
        th 形态
      tr(v-else)
        th 期号
        th 奖号
    tbody
      tr(v-for="(item, idx) in list" v-bind:key="idx" v-if="/[^P]K3/.test(category)")
        td(v-text="item.issue")
        td
          b.text-error(v-text="item.openNum")
        td(v-text="item.sum")
        td(v-html="item.dxds")
      tr(v-else)
        td(v-text="item.issue")
        td
          b.text-error(v-text="item.openNum")
</template>

<script>
import { WS } from '@/store/mutation-types';
import { lotteryApi } from 'api';
import { mapGetters } from 'vuex';

export default {
  name: 'BetDrawBar',
  props: ['category'],
  data () {
    return {
      list: [],
      showDraw: false,
      betDrawBarEnabled: false,
    }
  },
  computed: {
    ...mapGetters({
      websocketMessage: WS.LOTTERY_INFO,
      appConfig: 'appConfig',
    })
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      //配置開關，預設關閉
      const hasBetDrawBar = this.appConfig.hasBetDrawBar? this.appConfig.hasBetDrawBar:'0';
      if (hasBetDrawBar !== '1') return;
      this.betDrawBarEnabled = true;

      const { category } = this;
      let params = {
        params: {
          category,
          limit: 20
        }
      }
      lotteryApi.trend(params).then(data => {
        if (data.code != 0) return
        let list = data.list.splice(0, 20)
        this.list = list.map(item => {
          if(/[^P]K3/.test(category)){      //K3
            let sum = item.openNum.split(',').reduce((pre, n) => pre += +n, 0)
            item.sum = sum
            let dx = sum < 11 ? '小' : '大'
            let ds = sum%2 ? '单' : '双'
            let cls1 = sum < 11 ? 'bg-blue' : 'bg-yellow'
            let cls2 = sum%2 ? 'bg-blue' : 'bg-yellow'
            item.dxds = `<span class="ball ${cls1}">${dx}</span>|<span class="ball ${cls2}">${ds}</span>`
          }
          else if(/HKSIX/.test(category)){  //六合彩
            let arrOpenNum = item.openNum.split(',');
            const plus = arrOpenNum[arrOpenNum.length-1];
            item.openNum = arrOpenNum.splice(0, 6) + " + " + plus;
          }
          else if(/28/.test(category)){     //蛋蛋
            let sum = item.openNum.split(',').reduce((pre, n) => pre += +n, 0)
            item.openNum = item.openNum.replace(/,/g, ' + ') + " = " + sum;
          }
          return item
        })
      })
    }

  },
  watch: {
    'category': 'init',
    websocketMessage ({open_lottery, open_code_list, open_issue}) {
      if (this.category != open_lottery) return
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
#betdraw-bar {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  background: #fff;
  overflow-y: auto;
  transition: .2s transform ease;
  transform: translateX(-100%);
  visibility: hidden;
  z-index: 101;
  &.active {
    visibility: visible;
    transform: translateX(0);
  }
  .back {
    padding: 10px;
    a {
      font-size: 12px;
      color: #495060;
      i {
        margin-right: 10px;
      }
    }
  }
  th {
    border-bottom: 1px solid #ddd;
    line-height: 30px;
    font-weight: normal;
    background: #f2f4f7;
    text-align: center;
  }
  td {
    border-bottom: 1px dashed #ebebeb;
    border-right: 1px dashed #ebebeb;
    line-height: 24px;
    padding: 0 5px;
    text-align: center;
  }
  .toggle-btn {
    position: absolute;
    top: 6%;
    right: -30px;
    width: 30px;
    margin-top: -32px;
    padding: 5px 0;
    border-radius: 0 5px 5px 0;
    background: #999;
    text-align: center;
    color: #fff;
    cursor: pointer;
  }
}
</style>
