<template lang="pug">
.main
  //- 遊戲列表
  ul.game-list(:class="{theme2: specialTheme}")
    li.list(v-for="(item, index) in liveCasinoList" :key="item.alias" @click="openLink(item.platId, item.id)")
      img.game-img(:src="item.iconSrc" :alt="item.label" @error="imgError(item)")
      template(v-if="!specialTheme")
        .title(v-text="item.label")
        .recommend(v-text="item.recommend")
        a.btn 进入游戏
      template(v-else)
        a.btn 进入游戏
        .info
          .title(v-text="item.label")
          .recommend(v-text="item.recommend")
  //- 當全部平台關閉時顯示此內容
  #system-updating(v-if="updating")
    span 平台升级中
  //- 溫馨提示
  Modal(v-model="tips" title="温馨提示" @on-ok="openGame")
    p 为更好的进行游戏娱乐，将为您打开新的窗口
</template>

<script>
import { mapGetters } from "vuex";
import { accountApi, gameBoyApi } from "@/api";

export default {
  name: "liveCasino",
  data() {
    return {
      selectedPlatId: null, //当前平台ID
      liveCasinoList: [], //遊戲列表
      updating: false, //获取列表发生错误
      playLink: '', //遊戲連結
      tips: false, //溫馨提示彈窗開關
    };
  },
  computed: {
    ...mapGetters(["appConfig"]),
    specialTheme() {
      if (this.appConfig.themeName == 'theme2' && this.liveCasinoList.length == 1) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.appConfig.themeName == 'theme2' ? this.isTheme2 = true : this.isTheme2 = false;
      this.fetchData();
    },
    fetchData() {
      //先以 thirdPartyId 獲取對應 allGame 平台列表
      let id = this.$root.thirdPartyId;
      gameBoyApi.allGame({params:{thirdPartyId: id}}).then(data => {
        const { code, wallet } = data;
        if (code != 0) return;

        //再以 allGame 平台列表 platId 獲取對應遊戲列表
        wallet.forEach((item)=> {
          //平台維護時展示維護中狀態
          if (item.status == 2) {
            this.updating = true;
            return
          } else {
            this.updating = false;
            gameBoyApi.gameList({params:{platId: item.platId}}).then(data => {
              this.liveCasinoList.push(...data.chess);
            })
          }
        })
      })
    },
    //點擊遊戲獲取 api 資訊
    openLink (itemPlatId, id) {
      gameBoyApi.play({params:{kingId: id}}).then((data)=>{
        //遊戲維護中
        if(data.code == 3){
          this.$Modal.error({
            title: '系统错误',
            content: data.msg || '游戏维护中',
          })
          return
        }

        if(data.code == -1){  //測試帳號
          this.$Modal.warning({
            title: '发生问题',
            content: data.msg || '游戏维护中...',
          })
          return
        }else if(data.code == 99){  //開發中請期待
          this.$Modal.warning({
            title: '敬请期待',
            content: data.msg || '開發中',
          })
          return
        }

        //取得遊戲的 URL
        this.playLink = data.goURL;

        //判斷遊戲的餘額
        this.selectedPlatId = itemPlatId;
        this.getBalance();
      })
    },
    //取得餘額
    getBalance(){
      accountApi.getBalance({params: {platId: this.selectedPlatId}}).then(data => {
        let { code, msg } = data;
        if (code != 0) {
          this.$Modal.error({
            title: '系统错误',
            content: msg,
          })
          return
        }
        
        //餘額不足 1 提示警告
        if (data.balance < 1) {
          this.$Modal.confirm({
            title: '余额不足',
            content: '账户余额不足<br/>请先进行额度转换',
            closable: true,
            okText: '前往游戏',
            closable: true,
            onOk: ()=> {
              this.tips = true;
            },
            cancelText: '前往额度转换',
            onCancel: ()=> {
              this.goMoneyTrans();
            }
          })
        } else {
          this.openGame();
        }
      });
    },
    //打開遊戲 (設定時間解決 body overflow 的問題)
    openGame() {
      setTimeout(()=> {
        window.open(this.playLink);
      }, 100)
    },
    //前往額度轉換
    goMoneyTrans(){
      this.$router.push({path: '/profile/moneyTrans'});
    },
    //首页图片发生错误时显示默认图
		imgError(item) {
      if (this.specialTheme) {
        item.iconSrc = require('@/assets/themeMix/livecasino-banner.png');
      } else {
        item.iconSrc = require('@/assets/themeMix/livecasino-default.png');
      }
    },
  }
};
</script>

<style lang="scss" scoped>
/* layout */
.main {
  min-width: 1280px;
  min-height: 600px;
  margin: 33px auto;
  background: #fff;
}

/* game-list */
.game-list {
  display: flex;
  flex-wrap: wrap;
  padding: 15px 10px;
}
.list {
  display: block;
  width: 300px;
  height: 455px;
  margin: 15px 7px;
  padding: 10px 30px;
  border: 1px solid #c8c8c8;
  box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.16);
  text-align: center;
  cursor: pointer;
  transition: all .3s;
  .game-img {
    display: block;
    width: 100%;
    height: auto;
    margin-bottom: 10px;
    transition: all .3s;
  }
  .title {
    margin-bottom: 8px;
    font-size: 22px;
    color: #333;
  }
  .recommend {
    margin-bottom: 13px;
    font-size: 16px;
    color: #f55151;
  }
  .btn {
    display: inline-block;
    width: 110px;
    background: #f13131;
    border-radius: 3px;
    font-size: 14px;
    color: #FFF;
    line-height: 34px;
  }
  &:hover {
    background: linear-gradient(to bottom, #f8d5a1, #ef7d4b);
    box-shadow: none;
    .title,
    .recommend {
      color: #FFF;
    }
    .btn {
      background: #FFF;
      color: #f13131;
    }
  }
}

/* game-list (theme2) */
.game-list.theme2 {
  display: block;
  .list {
    width: 100%;
    height: 473px;
    margin: 0 auto;
  }
  .game-img {
    margin-bottom: 33px;
  }
  .btn,
  .info {
    display: inline-block;
    vertical-align: middle;
  }
  .btn {
    margin-right: 65px;
  }
}

/* system-updating */
#system-updating {
  font-size: 34px;
  text-align: center;
  &::before {
    content: "";
    display: block;
    width: 995px;
    height: 468px;
    margin: 0 auto;
    background: url('~assets/themeMix/game-webmainten.png') center top no-repeat white;
    background-size: 100% auto;
  }
}
</style>

