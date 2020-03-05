<template lang="pug">
.home-view
  .fn-clear.mb10
    banner.fn-right
  .fn-clear.mb20
    .sub-main
      quick-bet.fn-left
      notice-and-help.fn-right
  .fn-clear.mb20
    prize-rank.fn-left
    .hot-lottery.fn-left
      h3.box-hd
        i.icon-sprite.icon-hot
        | 热门彩种
      lottery-card
    draw-notice.fn-right
  //- 彈窗公告
  Announcement
  //- 快速聯絡我們
  QuickContact
</template>

<script>
import Banner from 'components/themeMix/Banner';
import QuickBet from 'components/themeMix/QuickBet';
import NoticeAndHelp from 'components/themeMix/NoticeAndHelp';
import PrizeRank from 'components/themeMix/PrizeRank';
import LotteryCard from 'components/themeMix/LotteryCard';
import DrawNotice from 'components/themeMix/DrawNotice';
import Announcement from 'components/themeMix/Announcement';
import QuickContact from '@/components/QuickContact';

export default {
  name: "Index",
  components: {
    Banner,
    QuickBet,
    NoticeAndHelp,
    PrizeRank,
    LotteryCard,
    DrawNotice,
    Announcement,
    QuickContact
  }
};
</script>

<style lang="scss" scoped>
.home-view {
  width: 1280px;
  margin-top: 10px;
  padding-left: 240px;
  .banner {
    width: 100%;
  }
}

.sub-main {
  overflow: hidden;
  .quick_bet {
    width: 800px;
  }
}

.prize-rank {
  margin-left: -240px;
}

.hot-lottery {
  overflow: hidden;
  width: 800px;
  height: $layout-home-rank-height;
  border: 1px solid #ddd;
  background: #fff;
}

.lottery-list {
  overflow:hidden;
}
</style>
