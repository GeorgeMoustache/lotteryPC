<template lang="pug">
div
  //- 平台列表
  .filter
    ul.wrap
      li(v-for="item in platformList" :key="item.platId" :class="{'active': selectedPlatId == item.platId}" @click="fetchGameList(item)")
        img(:src="require(`@/assets/themeMix/${item.linkEname}_platIcon.png`)" )
        span(v-text="item.showName")
  .main
    //- 遊戲列表
    ul.game-list
      li.list(v-for="(item, index) in cardGameList" :key="item.alias" @click="openLink(item.id)")
        img.game-img(:src="item.iconSrc" :alt="item.label" @error="imgError(item)")
        .info
          .title(v-text="item.label")
          a.btn 进入游戏
        .recommend(v-text="item.recommend")
    //- 當全部平台關閉時顯示此內容
    #system-updating(v-if="updating")
      span 平台升级中
  //- 溫馨提示
  Modal(v-model="tips" title="温馨提示" @on-ok="openGame")
    p 为更好的进行游戏娱乐，将为您打开新的窗口
</template>

<script>
import { accountApi, gameBoyApi } from "@/api";

export default {
  name: "cardGame",
  data() {
    return {
      selectedPlatId: null, //当前平台ID
      selectedPlatEname: '',  //當前選擇平台eName
      platformList: [], //平台列表
      cardGameList: [], //游戏列表
      updating: false, //获取列表发生错误
      playLink: '', //遊戲連結
      tips: false, //溫馨提示彈窗開關
    };
  },
  created() {
    this.fetchPlatform();
  },
  methods: {
    //以 thirdPartyId 獲取對應 allGame 平台列表
    fetchPlatform() {
      let id = this.$root.thirdPartyId;
      gameBoyApi.allGame({params:{thirdPartyId: id}}).then(data => {
        const { code, wallet } = data;
        if (code != 0) return;

        //過濾掉已關閉的平台，讓前端不顯示
        wallet.forEach((item)=> {
          if (item.status != 0) {
            this.platformList.push(item);
          }
        })

        //預設選取第一個平台
        this.selectedPlatId = wallet[0].platId;

        //拉取遊戲列表資料
        this.fetchGameList(wallet[0]);
      })
    },
    //以 allGame 平台列表 platId 獲取對應遊戲列表
    fetchGameList(item) {
      this.selectedPlatId = item.platId;
      this.selectedPlatEname = item.linkEname;
      this.cardGameList = [];
      
      //平台維護時展示維護中狀態
      if (item.status == 2) {
        this.updating = true;
        return
      } else {
        this.updating = false;
      }

      gameBoyApi.gameList({params:{platId: this.selectedPlatId}}).then(data => {
        const { code, msg, chess } = data;
        this.cardGameList = data.chess;
      })
    },
    //點擊遊戲獲取 api 資訊
    openLink (id) {
      gameBoyApi.play({params:{kingId: id}}).then((data)=>{
        //遊戲維護中
        if (data.code == 3) {
          this.$Modal.error({
            title: '系统错误',
            content: '游戏维护中',
          })
          return
        }

        //測試帳號
        if (data.code == -1) {  
          this.$Modal.warning({
            title: '发生问题',
            content: data.msg || '游戏维护中...',
          })
          return
        }
        
        //開發中請期待
        if (data.code == 99) {  
          this.$Modal.warning({
            title: '敬请期待',
            content: data.msg || '開發中',
          })
          return
        }

        //取得遊戲的 URL
        this.playLink = data.goURL;
        //判斷遊戲的餘額
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
      item.iconSrc = require(`@/assets/themeMix/${this.selectedPlatEname}_default.png`);
    },
  }
}
</script>

<style lang="scss" scoped>
/* layout */
.layout-wrap {
  width: 100%;
}

.main {
  width: $layout-wrap-width;
  min-width: 1280px;
  min-height: 600px;
  margin: 33px auto;
  background: #fff;
}

/* filter */
.filter {
  margin: 16px 0 33px 0;
  background: #fff;
  border-bottom: 1px solid #707070;
  .wrap {
    display: flex;
    width: $layout-wrap-width;
    margin: 0 auto;
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 150px;
      height: 54px;
      margin: 0;
      padding: 0 0 4px 0;
      border-bottom: 8px solid transparent;
      font-size: 16px;
      color: #707070;
      text-align: center;
      cursor: pointer;
      img{
        display: block;
        width: auto;
        height: 100%;
      }
      span{
        height: 21px;
        margin: 0 0 0 10px;
        display: flex;
        justify-content: center;
        align-items: end;
      }
    }
    li.active {
      border-color: #ec917a;
      color: $primary-type2;
    }
  }
}

/* game-list */
.game-list {
  display: flex;
  flex-wrap: wrap;
  .list {
    position: relative;
    display: flex;
    align-items: center;
    width: 300px;
    height: 210px;
    margin: 15px 10px;
    padding: 20px;
    border: 1px solid#c8c8c8;
    border-radius: 3px;
    box-shadow: 2px 2px 6px 0 rgba(0, 0, 0, 0.16);
    font-family: "微軟正黑體";
    cursor: pointer;
  }
  .game-img {
  	display: block;
    width: 128px;
  	height: 128px;
    margin-right: 10px;
  }
  .info {
    .title {
      margin-bottom: 16px;
      font-family: '微軟正黑體';
      font-size: 18px;
  		color: #333;
      font-weight: bold;
      text-align: center;
    }
    .btn {
      display: block;
  		width: 110px;
      background: #f13131;
      border-radius: 3px;
      font-size: 14px;
  		color: #fff;
      line-height: 34px;
  		text-align: center;
  	}
  	
  }
  .recommend {
    position: absolute;
    left: 50%;
    bottom: 12%;
    display: none;
    font-family: MicrosoftYaHei;
    font-size: 18px;
  	color: #fff;
    text-align: center;
    transform: translateX(-50%);
  }
  //list hover style
  .list:hover {
    flex-wrap: wrap;
    background-image: linear-gradient(to bottom, #f8d5a1, #ef7d4b);
  }
  .list:hover .game-img {
    margin: 0 auto 40px auto;
  }
  .list:hover .info {
    display: none;
  }
  .list:hover .recommend {
    display: block;
  }
}

//system-updating
#system-updating{
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