<template lang="pug">
.lottery_play_wrap(:class="{'ct-model': ctStyle}")
  .left-games
    lottery-info(:lottery="info", @finish="onFinish")
    transition(name="fade")
      router-view(:isFinish="isFinish", :showLotteryInfo="false")
</template>

<script>
import LotteryInfo from 'components/themeMix/LotteryInfo';
import { mapGetters, mapMutations } from 'vuex';

// TODO: optimize
const route_pattern = /(?:\/lottery\/)?(\w+)/;

// 两面盘玩法
export default {
  name: 'LotteryTplBothLayout',
  components: {
    LotteryInfo,
  },
  data() {
    return {
      info: this.lotteryInfo || {},
      isFinish: false,
      ctStyle: false,
      playType: '',
    };
  },
  computed: {
    ...mapGetters(['lotteryInfo', 'appConfig']),
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations(['getEndTime']),
    init() {
      // 是否为传统玩法
      this.ctStyle = !/\/1$/.test(this.$route.path);

      window.scrollTo(0, 0);
      const path_match = this.$route.path.match(route_pattern);
      this.category = path_match ? path_match[1] : '';
      this.fetchInfo();

      //決定玩法
      this.loadPlayType(this.category);
    },
    fetchInfo() {
      this.$store.dispatch('lotteryInfo', { category: this.category }).then(data => {
        this.getEndTime(data);
        this.info = data;
      });
    },
    onFinish() {
      this.isFinish = true;
    },
    //決定玩法
    loadPlayType(toCategory){
      //191004 kyle 新增預設玩法 start
      var defaultPlayType = "";
      switch(this.appConfig.defaultPlayType){
        case 'GF':
          defaultPlayType = '/1';
          break;
        case 'CT':
          defaultPlayType = '';
          break;
        default:
          console.error('warning: not currect defaultPlayType Setting!!');
      }
      //191004 kyle 新增預設玩法 end

      //載入有紀錄的playType start
      var playType = defaultPlayType;
      if(localStorage.lastModeMap){
        var lastModeMap = new Map(JSON.parse(localStorage.lastModeMap));
        if(lastModeMap.get(toCategory)){
          var lastModeDt = new Map(lastModeMap.get(toCategory));
          playType = lastModeDt.get('playType') == null? '':lastModeDt.get('playType');
        }
      }

      //供下層使用
      this.playType = playType;

    },
    savePlayType(category , type){
      //儲存最後的playType  start
      var lastModeMap = new Map();
      var lastModeDt = new Map();
      if(localStorage.lastModeMap){
        lastModeMap = new Map(JSON.parse(localStorage.lastModeMap));
      }
      if(lastModeMap.get(category)){
        lastModeDt = new Map(lastModeMap.get(category));
      }
      lastModeDt.set('playType', type);  //傳統或官方，官方playType = '/1'
      lastModeMap.set(category, lastModeDt);
      localStorage.setItem('lastModeMap' , JSON.stringify(Array.from(lastModeMap.entries())));
      //儲存最後的playType  End
    }
  },
  watch: {
    $route(to, from) {
      const path_match = to.path.match(route_pattern);
      const category = path_match ? path_match[1] : '';
      this.ctStyle = !/\/1$/.test(this.$route.path);
      if (category !== this.category) this.init();
    },
  },
};
</script>
