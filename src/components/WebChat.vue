<template lang="pug">
#chatroom(v-if="chatRoomEnabled" @dragenter="uploadEnabled" @drop="uploadDisabled")
  //- 聊天室名稱 + 關注切換功能
  .room-head
    .title {{roomName}}
    ul.option
      li
        a.filter(@click="filterEnabled = !filterEnabled") 篩選
        .sub-menu(v-if="filterEnabled")
          a.all(@click="changeFilter('all')" :class="{'active': filter == 'all'}") 全部讯息
          a.redpack(@click="changeFilter('redpack')" :class="{'active': filter == 'redpack'}") 只看紅包
          a.msg(@click="changeFilter('msg')" :class="{'active': filter == 'msg'}") 不看紅包
          a.follow(@click="changeFilter('follow')" :class="{'active': filter == 'follow'}") 只看关注
      li
        a.readme(@click="readmeEnabled = !readmeEnabled") 聊天室說明
      li
        Icon.close(type="android-close" v-if="appConfig.themeName == 'theme5' || appConfig.themeName == 'theme6'" @click="$parent.webChatEnabled = false") 聊天室說明
  //- 過濾器 mask
  transition(name="fade")
    #filter-mask(v-if="filterEnabled" @click="filterEnabled = false")
  //- 聊天室訊息內容
  ul.history(ref="chatBox" :class="{'active': openEmoji}" @scroll="scroll")
    li.list.view-log
      a.more(@click="getHistory" v-if="allowFetch") 查看更多信息
      p.time
        span {{historyTime}}
    li.list(v-for="(item, index) in chatList" :key="index" v-show="filter == 'all' || (filter == 'redpack' && item.type == 'red_packet') || (filter == 'redpack' && item.type == 'flaunt_red_packet') || (filter == 'redpack' && item.type == 'single_bomb') || (filter == 'redpack' && item.type == 'multi_bomb') || (filter == 'redpack' && item.type == 'receive_packet') || (filter == 'msg' && item.type != 'red_packet' && item.type != 'flaunt_red_packet' && item.type != 'single_bomb' && item.type != 'multi_bomb' && item.type != 'receive_packet') || (filter == 'follow' && item.attention == 1)|| (filter == 'follow' && item.self)")
      .floating(v-if="item.type !=='receive_packet' && item.type !=='attention_online'")
        template
          //- 用戶等級
          .user-level(v-if="item.type !== 'plan_share'" :class="`user-level${item.rank}`" @click="openUserInfo(item.userid, item.id, item.self)")
            i {{item.rank}}
            span {{appConfig.webChat.ranks[item.rank - 1]}}
          //- 用戶標籤
          i.user-label(v-if="!(!item.label || item.type == 'plan_share')" :class="`user-label${item.label}`" @click="openUserInfo(item.userid, item.id, item.self)") {{appConfig.webChat.labels[item.label]}}
          //- 計劃專員標籤
          i.user-label.user-label2(v-if="item.type == 'plan_share'") 计划专员
          //- 用戶暱稱
          i.user-nickname(v-if="item.type !== 'plan_share'" @click="openUserInfo(item.userid, item.id, item.self)") {{item.nickname}}
          //- @用戶
          i.eite(v-if="item.type =='eite_user'") {{item.content.eiteUser}}
        //- @用户的訊息樣式
        p.message(v-if="item.type =='eite_user' && item.content.eiteMsg != ''")
          i(v-html="item.content.eiteMsg")
        //- 一般文字、表情的訊息樣式
        p.message(v-else-if="item.type =='message'")
          i(v-html="item.content")
      //- 关注的人上线提醒
      .notice-reminding(v-if="item.type =='attention_online'")
        | 您关注的
        i {{item.content}} 
        | 加入聊天室
      //- 图片
      .picture(v-if="item.type =='picture'")
        img(:src="item.content" @click="previewImage(item.content)")
      //- 战绩分享
      .share-panel.combat(v-if="item.type =='combat_share'")
        span.flag 今天战绩
        dl
          dt 盈亏 ￥{{item.content.profitAndLoss}}元
          dd
            .info
              p.issue 投注 ￥{{item.content.totalBetsAmount}}元
              p 中奖 ￥{{item.content.totalBonus}}元
      //- 注单分享
      .share-panel.order(v-if="item.type =='order_share'")
        span.flag 分享注单
        dl
          dt {{item.content.name}}
          dd
            .info
              p.issue {{item.content.issue}}期
              p {{item.content.modeName}}
                i(v-for="ele in item.content.list" :key="ele.id") {{ele.value}}
                | ￥{{item.content.betAmount}}
            a.btn(@click.stop="openFollowBet(item)") 跟投
      //- 计划分享
      .share-panel.plan(v-if="item.type =='plan_share'")
        span.flag 精准计划推荐 
        dl
          dt {{item.content.name}}
          dd
            .info
              p.issue {{item.content.issue}}
              p {{item.content.modeName}}
                template(v-for="ele in item.content.list") {{ele.value}}
            a(@click.stop="openFollowBet(item)") 跟投
      //- 普通红包
      dl.redpack-group.red-packet(v-if="item.type =='red_packet'" :class="[{'disabled': item.content.status != 0}, {'lock': !userInfo.allowGradRed}]" @click="getRedpack(item)")
        dt
          .money 恭喜发财
          .info {{item.content.title}}
          .status(v-if="item.content.status != 0" v-text="item.content.status == 1 ? '已领完' : '已失效'")
        dd
          .packs 普通紅包
          .time
            Icon(type="ios-clock-outline")
            | {{item.content.expiredTime}} 秒
      //- 炫耀红包
      dl.redpack-group.flaunt-red-packet(v-if="item.type =='flaunt_red_packet'" :class="[{'disabled': item.content.status != 0}, {'lock': !userInfo.allowGradRed}]" @click="getRedpack(item)")
        dt
          .money 恭喜发财
          .info {{item.content.betType}} 中奖{{item.content.betAmount}}元
          .status(v-if="item.content.status != 0" v-text="item.content.status == 1 ? '已领完' : '已失效'")
        dd
          .packs 炫耀紅包
          .time
            Icon(type="ios-clock-outline")
            | {{item.content.expiredTime}} 秒
      //- 單雷紅包
      dl.redpack-group.single-bomb(v-if="item.type =='single_bomb'" :class="[{'disabled': item.content.status != 0}, {'lock': !userInfo.allowGradRed}]" @click="bombPreview(item)")
        dt
          .money 金额:{{item.content.money}}
          .bomb 雷点: {{item.content.bomb}}
          .status(v-if="item.content.status != 0" v-text="item.content.status == 1 ? '已领完' : '已失效'")
        dd
          .packs {{item.content.number}}包 
          .time
            Icon(type="ios-clock-outline")
            | {{item.content.expiredTime}} 秒
      //- 多雷紅包
      dl.redpack-group.multi-bomb(v-if="item.type =='multi_bomb'" :class="[{'disabled': item.content.status != 0}, {'lock': !userInfo.allowGradRed}]" @click="bombPreview(item)")
        dt
          .money 金额:{{item.content.money}}
          .bomb 雷点: {{item.content.bomb}}
          .status(v-if="item.content.status != 0" v-text="item.content.status == 1 ? '已领完' : '已失效'")
        dd
          .packs {{item.content.number}}包 
          .time
            Icon(type="ios-clock-outline")
            | {{item.content.expiredTime}} 秒
      //- 领取红包
      .receive-red(v-if="item.type =='receive_packet'" @click="lookRedpack(item.content.id, item.content.type)")
        //- 一般 + 炫耀紅包種類
        template(v-if="(item.content.type == 'red_packet' || item.content.type == 'flaunt_red_packet')")
          //- 自己領自己
          template(v-if="item.content.grabType == 0")
            | 您领取了自己的红包，获得
            span.money {{item.content.grabMoney}}
            | 元
          //- 自己領別人
          template(v-if="item.content.grabType == 1")
            | 您领取了
            span.name {{item.content.from}}
            | 的红包，获得
            span.money {{item.content.grabMoney}}
            | 元
          //- 別人領自己
          template(v-if="item.content.grabType == 2")
            span.name {{item.content.to}} 
            | 领取了您的红包，获得
            span.money {{item.content.grabMoney}}
            | 元
        //- 單雷紅包種類
        template(v-if="item.content.type == 'single_bomb'")
          //- 自己領別人
          template(v-if="item.content.grabType == 1")
            | 您领取了
            span.name {{item.content.from}}
            | 的红包，获得
            span.money {{item.content.grabMoney}}
            | 元
          //- 別人領自己
          template(v-if="item.content.grabType == 2")
            span.name {{item.content.to}}
            | 领取了您的红包，获得
            span.money {{item.content.grabMoney}}
            | 元
          //- 有中雷附加訊息
          template(v-if="(item.content.grabType == 1 && item.content.hitPoint && item.content.hitPoint != '') || (item.content.grabType == 2 && item.content.hitPoint && item.content.hitPoint != '')")
            |，中雷点[{{item.content.hitPoint}}]，赔付
            span.money {{item.content.loseMoney}}
            | 元
        //- 多雷紅包種類
        template(v-if="item.content.type == 'multi_bomb'")
          //- 未結算
          template(v-if="!item.content.gameOver")
            //- 自己領別人
            template(v-if="item.content.grabType == 1")
              | 您领取了
              span.name {{item.content.from}}
              | 的多雷红包，雷点[{{item.content.hitPoint}}]，获得
              span.money {{item.content.grabMoney}}
              | 元
              //- 預中雷附加訊息
              template(v-if="item.content.candidate")
                |，
                span.money 预中雷 
            //- 別人領自己
            template(v-if="item.content.grabType == 2")
              span.name {{item.content.to}}
              | 领取了您的多雷红包，雷点[{{item.content.hitPoint}}]，获得
              span.money {{item.content.grabMoney}}
              | 元
              //- 預中雷附加訊息
              template(v-if="item.content.candidate")
                |，
                span.money 预中雷 
          //- 已結算
          template(v-else)
            //- 自己領別人
            template(v-if="item.content.grabType == 1 && item.content.loseMoney != 0")
              | 您领取了
              span.name {{item.content.from}}
              | 的多雷红包，雷点[{{item.content.hitPoint}}]，
              span.money 中雷
              | 赔付
              span.money {{item.content.loseMoney}}
              | 元
            //- 別人領自己
            template(v-if="item.content.grabType == 2")
              //- 無中雷
              template(v-if="item.content.bombPeople == 0") 您的多雷红包，雷点[{{item.content.hitPoint}}]，无人中雷
              //- 有中雷
              template(v-else)
                | 您的多雷红包，雷点[{{item.content.hitPoint}}]，
                span.money {{item.content.bombPeople}}
                | 人
                span.money 中雷
                | ，共赔付
                span.money {{item.content.totalLoseMoney}}
                | 元
  //- 置底按鈕
  transition(name="fade")
    a.click-to-bottom(v-if="clickToBottomEnabled" :class="{'active': openEmoji}" @click="clickToBottom")
      span.noread(v-if="noRead > 0") {{noRead}}
  //- 聊天室輸入框功能區
  .chatbox
    //- 表情貼圖
    .emoji(:class="{'active': openEmoji}")
      Carousel(v-model="emojiSwipe.value" :autoplay="emojiSwipe.autoplay" :arrow="emojiSwipe.arrow" :dots="emojiSwipe.dots")
        Carousel-item(v-for="(child, index) in emojiData" :key="index")
          ul.emoji-items
            li(v-for="item in child" :key="item.id")
              img(@click="selectEmoji(item)" :src="item.url" :title="item.title")
    //- 聊天室功能
    .control
      .main
        //- 開啟發紅包
        a.redpack(@click="openRedpack" :class="{'lock': !allowSendMsg}")
        //- 開啟上傳圖片
        template(v-if="allowSendMsg")
          input(type="file" id="uploadImg" @change="uploadImg")
          label.upload(for="uploadImg")
        label.upload.lock(v-else @click="blockUpload()")
        //- 開啟表情符號清單
        a.open-emoji(@click="openEmojiList" :class="{'lock': !allowSendMsg}")
      //- 清除聊天訊息
      a.clear(@click="clearChatList")
    //- 發送訊息區塊
    .send
      textarea.txt(ref="chatInput" v-model="sendMsg" placeholder="Shift+Enter换行，Enter 发送" @keydown.enter.exact.prevent="sendMessage" @keydown.enter.shift.exact.prevent="msgNewline")
      button.submit(@click="sendMessage" :class="{'lock': !sendEnabled}") 發送
  //- 彈窗訊息共用區塊
  transition(name="fade")
    #mask-layer(v-if="openMaskBox" @click="closeAllWindow")
  transition(name="fade")
    perfect-scrollbar#maskbox(v-if="openMaskBox")
      //- 圖片預覽
      .preview(v-if="openPreview")
        a.close(@click="closePreview")
        img(:src="previewSrc")
        a.download(:href="previewSrc" download="image")
      //- 用户詳細資料
      .user-detail(v-if="openUserDetail")
        img.avatar(:src="userDetail.avatar")
        .nickname {{userDetail.nickName}}
        .rank
          span.user-level
            i {{userDetail.rank}}
            | {{appConfig.webChat.ranks[userDetail.rank - 1]}}
          span.user-label(v-if="userDetail.label != null" :class="`user-label${userDetail.label}`") {{appConfig.webChat.labels[userDetail.label]}}
        .attention
          span 关注 {{userDetail.iCare}}
          span 粉丝 {{userDetail.myFans}}
        .like 他喜欢的彩种：
          img(v-for="(ele, index) in userDetail.likeBets" :key="index" :src="ele.imgPath")
        .operation
          a(v-if="!userDetail.self" @click="changeFollow(userDetail.uid, userDetail.attention)" v-text="userDetail.attention ? '取消关注' : '+ 关注'")
          a(@click="tagUser(userDetail)") @用戶
          template(v-if="userInfo.isRoomManager")
            a(@click="openBanned(userDetail.uid)") 禁言该用户
            a(@click="deleteMessage") 删除讯息
        a.close(@click="closeUserInfo")
      //- 禁言用戶選單
      .banned(v-if="openBannedMenu")
        .title 禁言该用户
          a.close.grey(@click="closeBanned")
        a(@click="selectBanned(1)") 10分钟
        a(@click="selectBanned(2)") 1小时
        a(@click="selectBanned(3)") 24小时
        a(@click="selectBanned(4)") 永久禁言
      //- 搶普通红包
      .grab-red.ordinary(v-if="getRedpackType === 'red_packet'")
        template(v-if="this.gradMoney == 0 || this.gradMoney == ''")
          img.snatch(src="@/assets/webchat/not-snatch.png")
          em 未抢到
        template(v-else)
          h1 {{this.gradIntegerMoney}}
            i {{this.gradDecimalMoney}}
            | 元
          em 普通红包
        p(@click="lookRedpack(reqData.redid)") 去看看其他人的手气&gt;&gt;
        a.close(@click="closeGetRedpack")
      //- 搶炫耀红包
      .grab-red.show-off(v-if="getRedpackType === 'flaunt_red_packet'")
        template(v-if="this.gradMoney == 0 || this.gradMoney == ''")
          img.snatch(src="@/assets/webchat/not-snatch.png")
          em 未抢到
        template(v-else)
          h1 {{this.gradIntegerMoney}}
            i {{this.gradDecimalMoney}}
            | 元
          em 炫耀红包
        p(@click="lookRedpack(reqData.redid)") 去看看其他人的手气&gt;&gt;
        a.close(@click="closeGetRedpack")
      //- 掃雷紅包預覽
      .bomb-preview(v-if="bombPreivewEnabled")
        .bg
          //- 一般狀態
          .normal(v-if="previewStatus == 0")
            .username {{bombInfo.username}}
            .bomb-type 发送了一个{{bombInfo.type}}红包
            .money {{bombInfo.money}}
            .bomb 雷点：
              span {{bombInfo.bomb}}
            .title {{bombInfo.title}}
            a.open-bomb(@click="openBomb(reqData.redid)") 开
          //- 其他狀態
          .other(v-if="previewStatus != 0")
            template(v-if="previewStatus == 1")
              .title 手慢了，红包领完了
              img(src="@/assets/webchat/bomb-red-over.png")
            template(v-if="previewStatus == 2")
              .title 手慢了，红包失效了
              img(src="@/assets/webchat/bomb-red-expired.png")
            a.more(@click="lookRedpack(reqData.redid)") 查看红包详情&gt;&gt;
        a.close-preview(@click="closeGetRedpack") 關閉掃雷紅包預覽
      //- 紅包詳情
      transition(name="slide-fade")
        perfect-scrollbar.redpack-detail(v-if="openLookRedpack")
          .red-head
            | 红包详情
            a.cancel(@click="closeLookRedpack") 取消
          //- 一般紅包 + 炫耀紅包
          .normal(v-if="getRedpackType != 'single_bomb' && getRedpackType != 'multi_bomb'")
            img.avatar(:src="redpackDetail.headImg")
            .name {{redpackDetail.hostName}}的红包
            //- 搶到紅包
            .result(v-if="redpackDetail.gradMoney")
              i 抢到
              label
                em {{redpackDetail.gradMoney}}
                | 元
              p 已存入钱包
            //- 沒搶到紅包
            .result(v-else)
              //- 已失效
              template(v-if="redpackInvalid")
                i 抱歉
                p.snatch 红包已失效
              //- 已搶完
              template(v-else-if="redpackDetail.balance == 0")
                i 很遗憾
                p.snatch 红包已抢完
              //- 未领取
              template(v-else)
                i 未领取
                p.snatch 还剩{{redpackDetail.total - redpackDetail.gradCount}}个红包
            .red-item
              .total
                label.left 领取{{redpackDetail.receiveMoney}}/{{redpackDetail.money}}元
                label.right 领取{{redpackDetail.gradCount}}/{{redpackDetail.total}}个
              ul.list
                li(v-for="item in redpackDetail.gradList" :key="item.id")
                  .item-left
                    img(:src="item.headImg")
                    .item-left-info
                      span {{item.nickName}}
                      i {{item.time}}
                  .item-right {{item.gradMoney}}元
          //- 掃雷紅包
          .bomb-pack(v-else)
            img.avatar(:src="bombDetail.headImg")
            .content
              .name {{bombDetail.hostName}}的红包
              .total-money {{bombDetail.totalMoney}} 元
              .title {{bombDetail.title}}
              .info
                .packs {{bombDetail.totalPacks}}个紅包
                .bomb 雷点：{{bombDetail.bomb}}
              .total-packs 领取{{bombDetail.packs}}/{{bombDetail.totalPacks}}个
              ul.list
                li(v-for="(item, index) in bombDetail.gradList" :key="index")
                  .item-left
                    img(:src="item.headImg")
                    .nickname(:class="{'self': item.self}") {{item.username}}
                    .date {{item.date}}
                  .item-right
                    .grad-money {{item.gradMoney}}元
                    .bomb-status(v-if="item.bombStatus != 0")
                      .text.bingo(v-if="item.bombStatus == 1") 中雷
                      .text(v-if="item.bombStatus == 2") 预中雷
      //- 我要跟投弹窗
      transition(name="fade")
        .follow-bet(v-if="isOpenFollowBet")
          .title 我要跟投
            a.close.grey(@click="closeFollowBet")
          .user-name
            i(v-if="followBetList.type == 'plan_share'") 计划专员
            i(v-else) {{followBetList.nickName}}
            | 分享的注单方案
          .bet-info
            span.info-left {{followBetList.lotteryName}}
            span.info-left {{followBetList.modeName}}
            span.info-right {{followBetList.issue}}期
          .bet-input
            em {{followBetList.list[0].value}}
            input(type="number" v-model.trim="followBetMoney" placeholder="请输入金额")
          button(@click="followBet") 确定
  //- 發紅包
  transition(name="slide-fade")
    perfect-scrollbar.send-redpack(v-if="openSendRedpack")
      .title 
        Icon.back(type="chevron-left" @click="closeSendRedpack")
        | 发红包
      .tabs
        RadioGroup(v-model="redpackType" type="button" @on-change="$store.dispatch('accountInfo');")
          Radio(:label="1") 普通红包
          Radio(:label="2" v-if="singleBombPack.number != ''") 单雷红包
          Radio(:label="3" v-if="multiBombPack.number != ''") 多雷红包
      //- 普通
      template(v-if="redpackType == 1")
        ul.wrap
          li
            span 我的余额
            .wealth {{info.wealth}}
            Icon.refresh(type="ios-loop-strong" @click="$store.dispatch('accountInfo')")
          li
            span 发包金额
            input(type="number" v-model="redpack.money" @blur="redpackMoney" :placeholder="`请输入${redpack.minMoney} ~ ${redpack.maxMoney} 的金额`")
          li
            span 红包个数     
            input(type="number" v-model="redpack.number" @blur="redpackSum" :placeholder="`请输入 ${redpack.minNumber} ~ ${redpack.maxNumber} 的个数`")
          li
            span 祝福语 
            input(type="text" v-model="redpack.msg" placeholder="祝福语最多10个字" maxlength="10")
        Button.send(:loading="redpackSending" @click="sendRedpack" :disabled="redpackSending")
          span(v-if="!redpackSending") 塞钱进红包
          span(v-else) 发送中
      //- 單雷
      template(v-if="redpackType == 2")
        ul.wrap
          li
            span 我的余额
            .wealth {{info.wealth}}
            Icon.refresh(type="ios-loop-strong" @click="$store.dispatch('accountInfo')")
          li.option
            span 
              | 选择包数：
              em {{singleBombPack.number}} 包
            RadioGroup(v-model="singleBombPack.number" type="button" @on-change="changeSingleBombNumber($event)")
              Radio(v-for="(item, index) in singleBombPack.packConfig" :key="index" :label="item.packs")
          li.ratio
            span 赔率：{{singleBombPack.ratio}}
          li.option
            span 
              | 选择雷点：
              em {{singleBombPack.bomb}}
            RadioGroup(v-model="singleBombPack.bomb" type="button")
              Radio(v-for="(item, index) in bombList" :key="index" :label="item") {{item}}
            a.random(@click="randomSingleBomb()") 随机
          li
            span 发包金额
            input(type="number" v-model="singleBombPack.money" @blur="redpackMoney" :placeholder="`请输入${singleBombPack.minMoney} ~ ${singleBombPack.maxMoney} 的金额`")
          li
            span 祝福语 
            input(type="text" v-model="singleBombPack.msg" placeholder="祝福语最多10个字" maxlength="10")
        Button.send(:loading="redpackSending" @click="sendRedpack" :disabled="redpackSending")
          span(v-if="!redpackSending") 塞钱进红包
          span(v-else) 发送中
      //- 多雷
      template(v-if="redpackType == 3")
        ul.wrap
          li
            span 我的余额
            .wealth {{info.wealth}}
            Icon.refresh(type="ios-loop-strong" @click="$store.dispatch('accountInfo')")
          li.option
            span 
              | 选择包数：
              em {{multiBombPack.number}} 包
            RadioGroup(v-model="multiBombPack.number" type="button")
              Radio(v-for="(item, index) in multiBombPack.packConfig" :key="index" :label="item.packs")
          li.ratio
            span 赔率：
            em 双雷{{multiBombPack.bombConfig[0].odds}}，三雷{{multiBombPack.bombConfig[1].odds}}，四雷{{multiBombPack.bombConfig[2].odds}}，五雷{{multiBombPack.bombConfig[3].odds}}
          li.option
            span 
              | 选择雷点：
              em {{multiBombPack.bomb | multiBombFormat}}
              | 雷点数量限制2-5
            Checkbox-group(v-model="multiBombPack.bomb" type="button")
              Checkbox(v-for="(item, index) in bombList" :key="index" :label="item") {{item}}
            a.random(@click="randomMultiBomb()") 随机
          li
            span 发包金额
            input(type="number" v-model="multiBombPack.money" @blur="redpackMoney" :placeholder="`请输入${multiBombPack.minMoney} ~ ${multiBombPack.maxMoney} 的金额`")
          li
            span 祝福语 
            input(type="text" v-model="multiBombPack.msg" placeholder="祝福语最多10个字" maxlength="10")
        Button.send(:loading="redpackSending" @click="sendRedpack" :disabled="redpackSending")
          span(v-if="!redpackSending") 塞钱进红包
          span(v-else) 发送中
  //- 拖曳圖片上傳
  Upload(v-show="allowUpload" type="drag" :format="['jpg','jpeg','png','gif']" :max-size="1024" :data="uploadData" action="/webchat/api/image/upload"
        :on-success="uploadSuccess" 
        :on-error="uploadError" 
        :on-format-error="uploadFormatError"
        :on-exceeded-size="uploadSizeError"
        )
    .upload-outer(@dragleave="uploadDisabled")
      .upload-inner
        Icon(type="ios-cloud-upload" size="52" style="color: #3399ff")
        p 将文件拖拽到这里上传
  //- 聊天室說明
  .readme-window(v-if="readmeEnabled")
    .title
      | {{roomName}}
      a.close(@click="readmeEnabled = false")
    ul.wrap
      li(v-if="readme.singleBombPacks.length")
        span 单雷可发包
        | {{readme.singleBombPacks}}
      li(v-if="readme.multiBombPacks.length")
        span 多雷可发包
        | {{readme.multiBombPacks}}
      li.content(v-if="readme.redPackDesc.length")
        span 紅包游戏规则
        perfect-scrollbar.desc(v-html="readme.redPackDesc")
  //- 領取掃雷紅包餘額不足的失敗提示
  transition(name="fade")
    .get-bomb-fail(v-if="getBombFailed")
      Icon(type="ios-close-outline")
      | 余额不足 领取失败
</template>

<script>
import { WS, ACCOUNT } from '@/store/mutation-types';
import { mapGetters, mapMutations } from 'vuex';
import { lotteryApi, chatApi } from '@/api';
import { createWebSocketChat } from 'utils/wsChatRoom';
import emojiData from 'utils/emoji';
const xss = require('xss'); // xss攻击

export default {
  name: 'WebChat',
  inject: ['ivNotice'],
  emojiData: [emojiData],
  data() {
    return {
      chatRoomEnabled: false, //是否可訪問聊天室
      roomId: '',
      roomName: '',
      userRoomAccess: true, //使用者是否有訪問聊天室的權限
      userInfo: {}, //使用者資訊

      //過濾器開關
      filterEnabled: false,
      filter: 'all',

      //聊天室說明開關
      readmeEnabled: false,
      readme: {
        singleBombPacks: '',
        multiBombPacks: '',
        redPackDesc: '',
      },

      //用戶資訊
      openUserDetail: false,
      userDetail: {},

      //權限參數
      reqData: {
        userid: '', // 用户id
        redid: '', // 红包id
      },
      chatList: [], //聊天室訊息列表
      firstFetch: true, //是否為第一次拉取資料
      allowFetch: false, //是否允許點擊更多歷史資料
      historyTime: new Date().Format('yyyy-MM-dd HH:mm:ss'), //歷史記錄時間
      openBannedMenu: false, //開啟禁言選單
      bannedUid: '', //被禁言的用戶id
      messageId: '', //該筆訊息的id，給刪除訊息功能用

      //拉取歷史訊息參數
      pager: {
        page: 1,
        rows: 50,
      },

      //發送訊息內容
      sendMsg: '',
      sendMsgType: 'message',
      allowSendMsg: true, //是否有發言權
      sendEnabled: false, //發送訊息按鈕開關
      receiveData: '', // 接收的聊天数据

      //websocket 參數
      wsuri: '',
      wid: '', //WS連結ID
      wsCreated: false, //WS是否已建立完成
      openMaskBox: false, //彈窗開關

      //emoji
      emojiSwipe: {
        value: 0,
        autoplay: false,
        dots: 'inside',
        arrow: 'always',
      },
      openEmoji: false, //emoji列表開關

      //預覽圖片
      openPreview: false, //開關
      previewSrc: '', //圖片路徑

      //拖曳上傳圖片
      allowUpload: false,
      uploadData: {
        userid: '',
        roomId: this.roomId,
      },

      //發紅包參數
      openSendRedpack: false,
      redpackType: 1,

      redpack: {
        number: null, //紅包個數
        money: null, //红包金额
        msg: '', //留言
        defaultMsg: '',
        userid: '', //用户ID
        type: 1, //红包类型(1:普通红包，2:炫耀红包，3:單雷紅包，4:多雷紅包)
        betType: '', //彩种
        betAmount: '', //中奖金额
        minMoney: Number, //紅包最少金額
        maxMoney: Number, //紅包最多金額
        minNumber: 1, //紅包最少個數
        maxNumber: Number, //紅包最多個數
        ratio: 1, //對應掃雷紅包需要回傳預設賠率參數
      },

      singleBombPack: {
        userid: '', //用户ID
        type: 3, //红包类型(1:普通红包，2:炫耀红包，3:單雷紅包，4:多雷紅包)
        money: null, //红包金额
        minMoney: Number, //紅包最少金額
        maxMoney: Number, //紅包最多金額
        packConfig: [], //紅包數量與賠率
        number: '',
        ratio: Number,
        bomb: '',
        defaultMsg: '',
        msg: '',
      },

      multiBombPack: {
        userid: '', //用户ID
        type: 4, //红包类型(1:普通红包，2:炫耀红包，3:單雷紅包，4:多雷紅包)
        money: null, //红包金额
        minMoney: Number, //紅包最少金額
        maxMoney: Number, //紅包最多金額
        bombConfig: [], //雷點數量與賠率
        number: '',
        ratio: Number,
        bomb: [],
        defaultMsg: '',
        msg: '',
      },

      bombList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], //雷點列表
      redpackSending: false,

      //搶紅包參數
      getRedpackType: '',
      gradMoney: null, //抢到金额
      gradIntegerMoney: null, //抢到金额整数部分
      gradDecimalMoney: null, //抢到金额小数部分

      //紅包詳情
      openLookRedpack: false,
      redpackDetail: {},
      redpackInvalid: false,

      //掃雷紅包參數
      bombPreivewEnabled: false,
      previewStatus: 0,
      bombInfo: {},
      bombDetail: {},

      //紅包 cache
      redpackCache: [],

      //領取掃雷紅包餘額不足的失敗提示
      getBombFailed: false,

      //跟投參數
      isOpenFollowBet: false, //開啟跟投
      followBetLock: false, //鎖定跟投
      followBetList: {}, //跟投清單
      followBetMoney: '', //跟投金額

      clickToBottomEnabled: false, //置底按鈕開關
      noRead: 0, //未讀訊息數量
    };
  },
  created() {
    this.identity();
    //聊天室有拖曳傳圖的功能，所以禁用整個頁面的拖曳行為
    window.ondragstart = () => {
      return false;
    };
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      chatMsg: WS.CHAT_MESSAGE,
      info: ACCOUNT.ACCOUNTINFO,
    }),
    //產生 emoji 列表
    emojiData() {
      let list = [[], [], []];
      [...emojiData].forEach(([title, url], index) => {
        let idx = index < 21 ? 0 : index >= 21 && index < 40 ? 1 : 2;
        list[idx].push({ id: index + 1, title, url });
      });
      return list;
    },
  },
  filters: {
    //格式化多雷雷點為一般字串
    multiBombFormat(item) {
      return item.toString()
    }
  },
  methods: {
    //驗證用戶身份權限
    identity() {
      chatApi.identityCheck().then(res => {
        let data = res.data;

        //判斷是否可訪問聊天室，聊天室關閉或使用者無訪問權限皆阻檔
        this.userRoomAccess = data.permission.userRoomAccess;
        this.$parent.userRoomAccess = data.permission.userRoomAccess;

        if (this.appConfig.hasChat == 0 || !this.userRoomAccess) {
          this.chatRoomEnabled = false;
          return;
        } else {
          this.chatRoomEnabled = true;
        }

        //因應多聊天室功能，需取得房間ID及房間名稱
        this.roomId = data.roomId;
        this.roomName = data.roomName;

        //取得用戶基本權限
        let { isRoomManager, allowTalk, allowGradRed, isCommissioner } = data.permission;
        this.userInfo.isRoomManager = isRoomManager;
        this.userInfo.allowTalk = allowTalk;
        this.userInfo.allowGradRed = allowGradRed;
        this.$parent.isCommissioner = isCommissioner;

        if (!this.userInfo.isRoomManager) {
          if (this.userInfo.allowTalk) {
            this.$parent.allowSendMsg = true;
            this.allowSendMsg = true;
          } else {
            this.$parent.allowSendMsg = false;
            this.allowSendMsg = false;
          }
        } else {
          this.$parent.allowSendMsg = true;
          this.allowSendMsg = true;
        }

        //取得用戶基本資料
        this.reqData.userid = data.user.uid;
        this.userInfo.nickName = data.user.nickname;
        this.userInfo.level = data.user.levelId;
        this.userInfo.label = data.user.label;

        //取得聊天室說明
        if (data.chatDescConfig) {
          let desc = data.chatDescConfig;
          if (desc.singleBombPacks) this.readme.singleBombPacks = desc.singleBombPacks;
          if (desc.multiBombPacks) this.readme.multiBombPacks = desc.multiBombPacks;
          if (desc.redPackDesc) this.readme.redPackDesc = desc.redPackDesc;
        }

        //取得發紅包相關參數
        let redpackConfig = data.redPacketConfig;
        let { maxmoney, minmoney, numble, content, expiredTime } = redpackConfig;
        this.redpack.maxMoney = maxmoney;
        this.redpack.minMoney = minmoney;
        this.redpack.maxNumber = numble;
        this.redpack.defaultMsg = content;
        this.redpack.expiredTime = expiredTime;

        //取得單雷紅包參數
        let singleBombConfig = data.singleBombConfig;
        if (singleBombConfig) {
          let { maxmoney, minmoney, packConfig, content } = singleBombConfig;
          this.singleBombPack.minMoney = minmoney;
          this.singleBombPack.maxMoney = maxmoney;
          this.singleBombPack.packConfig = packConfig;
          this.singleBombPack.number = packConfig[0].packs;
          this.singleBombPack.ratio = packConfig[0].odds;
          this.singleBombPack.defaultMsg = content;
        }

        //取得多雷紅包參數
        let multiBombConfig = data.multiBombConfig;
        if (multiBombConfig) {
          let { maxmoney, minmoney, packs, bombConfig, content } = multiBombConfig;
          this.multiBombPack.minMoney = minmoney;
          this.multiBombPack.maxMoney = maxmoney;
          this.multiBombPack.bombConfig = bombConfig;
          this.multiBombPack.number = packs;
          this.multiBombPack.defaultMsg = content;
        }

        //取得拖曳上傳圖片要送的 userid
        this.uploadData.userid = data.user.uid;
        this.uploadData.roomId = data.roomId;

        //取得history (延遲一下在拉取，讓DB有反應時間)
        setTimeout(() => {
          this.getHistory();
        }, 300);

        //建立 webSocket
        this.wid = data.wid; //websocket id
        this.getWebSocketUrl();
      });
    },
    //取得歷史記錄
    getHistory() {
      const form = new FormData(); 
      form.append('page', this.pager.page);
      form.append('rows', this.pager.rows);
      form.append('roomId', this.roomId);

      chatApi.history(form).then(rs => {
        let { code, data } = rs;
        if (code != 0) return;

        let { historyList, pager } = data;
        //如果 historyList 沒東西就不要 render
        if (historyList.length == 0) return;

        let { pages } = pager;

        //如果不是第一次拉取歷史記錄 && 已經是最後一頁了就 return 不給拉
        if (!this.firstFetch && this.pager.page > pages) return;
        if (this.firstFetch) this.chatList = [];

        //過濾 history api 內容並寫到 chatList 中
        historyList.forEach(item => {
          let type = item.type;
          if (type == 'message') {
            item.content = this.genContent(item.content);
          } else if (type == 'eite_user') {
            item.content.eiteMsg = this.genContent(item.content.eiteMsg);
          }
          
          this.chatList.unshift(item);

          //紅包倒數功能
          if (type == 'red_packet' || type == 'flaunt_red_packet' || type == 'single_bomb' || type == 'multi_bomb') {
            if (item.content.expiredTime > 0) {
              let time = setInterval(() => {
                item.content.expiredTime -= 1;
                if (item.content.expiredTime == 0) {
                  item.content.status = 2;
                  clearTimeout(time);
                }
              }, 1000);
            }
          }
        });

        let lastMessage = historyList[historyList.length - 1].time;
        this.historyTime = new Date(lastMessage).Format('yyyy-MM-dd HH:mm:ss'); //每次拉取 history 都去更新時間

        //如果是第一次拉取資料就自動捲到最底
        if (this.firstFetch) {
          this.scrollToBottom();
        }

        //關閉第一次拉取的開關
        this.firstFetch = false;

        //判斷歷史記錄未拉完就繼續拉!!!
        if (this.pager.page < pages) {
          this.allowFetch = true;
          this.pager.page++;
        } else {
          this.allowFetch = false;
        }
      });
    },
    //建立WS
    getWebSocketUrl() {
      let { port, origin } = location;
      let host = origin.replace(/^http(s)?/, (match, p1) => {
        return p1 ? 'wss' : 'ws';
      });
      host = host.replace(/(:\d+)/, (match, p1) => {
        return p1 ? ':8058' : '';
      });
      if (__DEV__) host = 'ws://192.168.6.97:8080';
      this.wsuri = `${host}/webchat/chatServer/${this.roomId}/${this.wid}`;
      createWebSocketChat(this.wsuri);
      this.wsCreated = true;
    },
    //WS收數據
    websocketonmessage(stringMsg) {
      const data = JSON.parse(stringMsg);
      const msg = data.msg;
      this.receiveData = data.message;
      const { type, self, attention, id } = data.message;
      const that = this;

      function redpackCountDown() {
        that.chatList.push(that.receiveData);
        that.chatList.forEach(item => {
          if (item.id == id) {
            if (item.content.expiredTime > 0) {
              let time = setInterval(() => {
                item.content.expiredTime -= 1;
                if (item.content.expiredTime == 0) {
                  item.content.status = 2;
                  clearTimeout(time);
                }
              }, 1000);
            }
          }
        });
      }

      // 判断渲染类型
      switch (type) {
        case 'message': //文字、表情
          if (!self) {
            this.receiveData.content = this.genContent(this.receiveData.content);
            this.chatList.push(this.receiveData);
            this.autoClearMsg();
          }
          break;
        case 'receive_packet': //領取紅包狀態
          this.chatList.push(this.receiveData);
          this.autoClearMsg();
          break;
        case 'eite_user': //@用户
          if (!self) {
            this.receiveData.content.eiteMsg = this.genContent(this.receiveData.content.eiteMsg);
            this.chatList.push(this.receiveData);
            this.autoClearMsg();
          }
          break;
        case 'retract': //删除用户訊息
          let mid = this.receiveData.content.mid;
          this.chatList = this.chatList.filter(e => {
            if (mid.indexOf(e.id) == -1) {
              return e;
            }
          });
          break;
        case 'remote_login': //异地登录
          this.$Modal.info({
            title: '系统提示',
            content: '您的账号已在其他地方登录<br>请重新登录',
            onOk: () => {
              createWebSocketChat(null);
              this.$router.push({ path: '/login' });
            },
          });
          break;
        case 'red_packet': //單雷紅包
          redpackCountDown()
          break;
        case 'flaunt_red_packet': //炫耀紅包
          redpackCountDown()
          break;
        case 'single_bomb': //單雷紅包
          redpackCountDown()
          break;
        case 'multi_bomb': //多雷紅包
          redpackCountDown()
          break;
        case 'system': //系統狀態推送
          this.$Modal.info({
            title: '系统提示',
            content: msg,
          });

          //初始化各項參數
          this.readmeEnabled = false;
          this.filterEnabled = false;
          this.redpackTab = ['普通红包'];
          this.openSendRedpack = false;
          this.openEmoji = false;
          this.sendMsg = '';
          this.closeAllWindow();
          this.firstFetch = true;
          this.identity();
          break;
        default:
          this.chatList.push(this.receiveData);
          this.autoClearMsg();
      }

      //未讀訊息數量
      this.noReadCount();

      //如果置底按鈕沒開啟，訊息進來就捲動至聊天記錄最底
      if (!this.clickToBottomEnabled) {
        this.scrollToBottom();
      }
    },
    //未讀訊息數量計算
    noReadCount() {
      this.clickToBottomEnabled ? (this.noRead += 1) : (this.noRead = 0);
    },
    //處理訊息數量達 300 筆時自動清除資料剩 50 筆
    autoClearMsg() {
      if (this.chatList.length >= 300) {
        this.chatList.splice(0, 250);
        this.allowFetch = true;
        this.pager.page = 2;
      }
    },
    //處理純訊息
    genContent(content) {
      return this.convertEmoji(content);
    },
    //處理emoji
    convertEmoji(content) {
      return content.reduce((html, str) => {
        let url = emojiData.get(str);
        html += url ? `<img src="${url}" class="emoji-img">` : str;
        return html;
      }, '');
    },
    //捲動至聊天記錄最底
    scrollToBottom() {
      this.$nextTick(() => {
        let chatBox = this.$refs.chatBox;
        setTimeout(() => {
          //因為一直報不知名的 scrollHeight 錯誤又不影響功能就先 try catch 起來
          try {
            chatBox.scrollTop = chatBox.scrollHeight;
          } catch (e) {}
        }, 300);
      });
    },
    //清屏功能
    clearChatList() {
      this.chatList = [];
      this.allowFetch = true;
      this.firstFetch = true;
      this.pager.page = 1;
    },
    //送出訊息
    sendMessage() {
      //權限不足不能送出
      if (!this.allowSendMsg) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      //取得 userId
      const uid = this.reqData.userid;

      //沒有輸入訊息不能送出
      if (this.sendMsg == '') return this.ivNotice('error', '发送讯息的内容为空白所以无法送出');

      //訊息長度超過 200 字元不能送出
      let source = this.sendMsg;
      if (source.length > 400) return this.ivNotice('error', '发送讯息内容上限为 400 字元，您已超过限制');

      let html = xss(source, {
        whiteList: [], // 白名单为空，表示过滤所有标签
        stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
        stripIgnoreTagBody: ['script'], // script标签较特殊，需要过滤标签中间的内容
      });
      this.sendMsg = html.split(/(\[[^[\]]+\])/); // 正则字符串转数组
      this.sendMsg = this.sendMsg.filter(n => n);

      //@用戶類型附帶ID
      if (this.sendMsgType == 'eite_user') {
        let msg = this.sendMsg.toString();
        let spaceIndex = msg.indexOf(' ');
        let eiteUser = msg.substring(0, spaceIndex);
        let eiteMsg = msg.replace(eiteUser + ' ', '').split(',');
        this.sendMsg = {};
        this.sendMsg.eiteUser = eiteUser;
        this.sendMsg.eiteMsg = eiteMsg;
        this.sendMsg.eiteUserId = this.customerInfo;
      }

      // 开始发送请求
      const agentData = JSON.stringify({
        message: {
          content: this.sendMsg,
          from: uid, // 自己
          to: '', //接收人,如果没有则置空,如果有多个接收人则用,分隔 ，发给谁
          type: this.sendMsgType,
        },
      });

      //阻擋有Emoji的聊天訊息
      let chatInfo = '';
      if (this.sendMsgType == 'eite_user') {
        chatInfo = JSON.parse(agentData).message.content.eiteMsg.toString();
      } else {
        chatInfo = JSON.parse(agentData).message.content.toString();
      }

      if (chatInfo.match(/\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g) != null)
        return this.ivNotice('error', '不支援内置手机贴图，请修正后重新送出!');

      //發送訊息請求
      const form = new FormData();
      form.append('message', agentData);
      form.append('roomId', this.roomId);
      form.append('uid', this.reqData.userid);

      chatApi.sendMessage(form).then(res => {
        let { code, msg } = res;
        // 0:成功;-1:系统错误,1:会话失效;3:会话连接已断开;102:用户不存在;
        // 104:当前用户级别禁止发言;112:用户没有进入聊天室权限;113:当前用户被禁言;
        // 201:消息为空;202:消息格式错误;203:消息类型错误;204:发送消息太频繁;
        // 208:发送内容包含敏感词条403:当前系统禁止发言;404:当前时间段系统禁止发言;
        if (code != 0)  {
          this.ivNotice('error', msg);
          this.$refs.chatInput.focus();
          return
        }
      
        let data = res.data;
        this.receiveData = {
          id: data.id,
          content: this.sendMsg,
          self: true,
          from: uid, //自己
          to: '', //接收人,如果没有则置空,如果有多个接收人则用,分隔 ，发给谁
          time: new Date().getTime(),
          type: this.sendMsgType,
          userid: uid,
          nickname: this.userInfo.nickName,
          label: this.userInfo.label,
          rank: this.userInfo.level,
        };

        if (this.sendMsgType == 'message') {
          this.receiveData.content = this.genContent(this.receiveData.content);
        } else {
          this.receiveData.content.eiteMsg = this.genContent(this.receiveData.content.eiteMsg);
        }
        this.chatList.push(this.receiveData);
        this.autoClearMsg();

        //關閉表情符號
        this.openEmoji = false;

        //捲動至聊天記錄最底
        this.scrollToBottom();

        //發送訊息完成，初始化
        this.sendMsg = ''; // 清空输入框
        this.sendMsgType = 'message'; // 初始化消息类型
      });
    },
    //輸入框 shift + enter 換行
    msgNewline() {
      this.sendMsg = `${this.sendMsg}\n`;
    },
    //無發言權阻檔點選瀏覽上傳圖片
    blockUpload() {
      this.ivNotice('error', '抱歉所在用户组无此操作权限');
    },
    //瀏覽上傳圖片
    uploadImg() {
      if (!this.allowSendMsg) return this.ivNotice('error', '抱歉所在用户组无此操作权限');
      let ele = event.target;
      let file = ele.files[0];
      const { type, size } = file;

      //驗證上傳格式
      if (!/^image\/(jpg|jpeg|png|gif)$/i.test(type)) return this.ivNotice('warning', '档案格式不符合，只能上传副档名为 jpg、png、gif 类型的图档');

      //驗證檔案大小
      const MAXSIZE = 1024 * 1024;
      if (size > MAXSIZE) return this.ivNotice('warning', `请选择${MAXSIZE / (1024 * 1024)}M以内的图片！`);

      //發送圖片
      let form = new FormData();
      form.append('file', file, file.name || `${+new Date()}.jpg`); // 如果是blob格式加隨機名稱
      form.append('userid', this.reqData.userid);
      form.append('roomId', this.roomId);
      chatApi.upload(form).then(res => {
        let { code, msg } = res;
        if (res.code != 0) return this.ivNotice('warning', msg);
      });
    },
    //拖曳上傳圖片 (drag)
    uploadEnabled() {
      if (!this.openMaskBox) {
        this.allowUpload = true;
      }
    },
    //拖曳上傳圖片 (drop)
    uploadDisabled() {
      this.allowUpload = false;
    },
    //拖曳上傳圖片 (成功)
    uploadSuccess(res) {
      let { code, msg } = res;
      if (code != 0) return this.ivNotice('error', msg);
      this.ivNotice('success', '您已成功上传了图片');
    },
    //拖曳上傳圖片 (失败)
    uploadError() {
      this.ivNotice('error', '上传图片失败');
    },
    //拖曳上傳圖片 (格式不合)
    uploadFormatError() {
      this.ivNotice('error', '档案格式不符合，只能上传副档名为 jpg、png、gif 类型的图档');
    },
    //拖曳上傳圖片 (檔案大小不合)
    uploadSizeError(file) {
      this.ivNotice('error', '文件太大，不能超过 1M。');
    },
    tagUser(item) {
      this.$refs.chatInput.focus();
      this.sendMsg = '@' + item.nickname + ' ';
      this.sendMsgType = 'eite_user';

      //如果是使用檢視用戶資料方式 @用戶 需要關閉用戶視窗
      this.openMaskBox = false;
      this.openUserDetail = false;
    },
    //開啟使用者資料選單
    openUserInfo(id, msgId, self) {
      this.messageId = msgId;
      let params = `${this.roomId}/${id}`;

      chatApi.userInfo(params).then(res => {
        const { code, data } = res;
        if (code != 0) return;

        //取得用戶詳細資料
        this.userDetail.uid = data.uid;
        this.userDetail.avatar = data.headImg;
        this.userDetail.nickname = data.nickName;
        this.userDetail.rank = data.rank;
        this.userDetail.label = data.label;
        this.userDetail.iCare = data.iCare;
        this.userDetail.myFans = data.myFans;
        this.userDetail.likeBets = data.likeBets;
        this.userDetail.attention = data.attention;
        this.userDetail.self = self;
        this.openMaskBox = true;
        this.openUserDetail = true;
      });
    },
    //關閉使用者資料選單
    closeUserInfo() {
      this.openMaskBox = false;
      this.openUserDetail = false;
      this.userDetail = {};
    },
    //關注使用者
    changeFollow(uid, state) {
      //改變 history 的關注使用者狀態
      let list = this.chatList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].userid == uid) {
          if (list[i].attention == 0) {
            list[i].attention = 1;
          } else {
            list[i].attention = 0;
          }
        }
      }

      //依目前關注狀態選擇要打哪個 api
      const fun = state ? chatApi.cancelFollow(uid) : chatApi.follow(uid);
      const tip = state ? '取消关注成功' : '关注成功';

      fun.then(res => {
        if (res.code != 0) return this.ivNotice('info', res.msg);

        chatApi.watchList().then(data => {
          if (data.data == null) {
            this.ivNotice('info', '您尚未有关注的用户');
          } else {
            this.ivNotice('success', tip);
          }

          this.closeUserInfo();
        });
      });
    },
    //開啟禁言選單
    openBanned(uid) {
      if (this.reqData.userid == uid) {
        this.ivNotice('error', '管理员不能禁言自己');
        this.closeUserInfo();
        return;
      } else {
        this.openUserDetail = false;
        this.bannedUid = uid;
        this.openBannedMenu = true;
      }
    },
    //禁言
    selectBanned(type) {
      const form = new FormData();
      form.append('type', type);
      let path = `${this.roomId}/${this.bannedUid}`;
      chatApi.banned(path, form).then(res => {
        this.ivNotice('info', res.msg);
        this.openMaskBox = false;
        this.openBannedMenu = false;
        this.userDetail = {};
        this.bannedUid = '';
      });
    },
    //關閉禁言選單
    closeBanned() {
      this.openMaskBox = false;
      this.openBannedMenu = false;
      this.userDetail = {};
      this.bannedUid = '';
    },
    //刪除訊息
    deleteMessage() {
      chatApi.deleteMessage(this.messageId, { roomId: this.roomId }).then(data => {
        const { code, msg } = data;
        if (code == 0) {
          this.ivNotice('success', '删除成功');
        } else {
          this.ivNotice('error', msg);
        }

        this.closeUserInfo();
      });
    },
    //開啟發紅包視窗
    openRedpack() {
      //阻擋測試會員
      if (this.info.type == 3) return this.ivNotice('error', '已达本日发红包上限');

      //權限不足不能送出
      if (!this.allowSendMsg) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      this.$store.dispatch('accountInfo');
      this.openSendRedpack = true;
    },
    //變更單雷紅包數量
    changeSingleBombNumber($event) {
      let number = $event;
      let bombPack = this.singleBombPack;
      bombPack.packConfig.forEach(item => {
        if (item.packs == number) {
          bombPack.ratio = item.odds;
        }
      });
    },
    //隨機單雷雷點
    randomSingleBomb() {
      let random = Math.floor(Math.random() * 10);
      this.singleBombPack.bomb = random;
    },
    //隨機多雷雷點
    randomMultiBomb() {
      let bomb = this.multiBombPack.bomb;
      bomb.splice(0);

      for (let i = 0; i <= 2; i++) {
        let random = Math.floor(Math.random() * 10);
        let hasBomb = bomb.includes(random);
        if (hasBomb) {
          i -= 1;
          continue;
        } else {
          bomb.push(random)
        }
      }      
    },
    //红包金额验证
    redpackMoney() {
      let money, maxMoney, minMoney;
      
      //普通紅包
      if (this.redpackType == 1) {
        money = this.redpack.money;
        maxMoney = this.redpack.maxMoney;
        minMoney = this.redpack.minMoney;
      } 

      if (this.redpackType == 2) {
        money = this.singleBombPack.money;
        maxMoney = this.singleBombPack.maxMoney;
        minMoney = this.singleBombPack.minMoney;
      }

      if (this.redpackType == 3) {
        money = this.multiBombPack.money;
        maxMoney = this.multiBombPack.maxMoney;
        minMoney = this.multiBombPack.minMoney;
      }

      if (!/^\d+$/.test(money) || money > maxMoney || money < minMoney) {
        this.ivNotice('error', `请输入${minMoney}~${maxMoney}的金额`);
        this.redpackType == 1 ? (this.redpack.money = null) : (this.singleBombPack.money = null);
      }
    },
    //红包个数校验
    redpackSum() {
      let number, maxNumber, minNumber;
      if (this.redpackType == 1) {
        number = this.redpack.number;
        maxNumber = this.redpack.maxNumber;
        minNumber = this.redpack.minNumber;
      } else {
        number = this.singleBombPack.number;
        maxNumber = this.singleBombPack.maxNumber;
        minNumber = this.singleBombPack.minNumber;
      }

      if (!/^\d+$/.test(number) || number > maxNumber || number < minNumber) {
        this.ivNotice('error', `请输入${minNumber}~${maxNumber}的个数`);
        this.redpackType == 1 ? (this.redpack.number = null) : (this.singleBombPack.number = null);
      }
    },
    //發送紅包
    sendRedpack() {
      //權限不足不能送出
      if (!this.allowSendMsg) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      //普通紅包發送阻擋
      if (this.redpackType == 1) {
        //金額輸入錯誤
        if (this.redpack.money == '' || this.redpack.money == null) return this.ivNotice('error', '请输入红包金额');

        //輸入金額超過餘額
        if (parseInt(this.redpack.money) > parseInt(this.info.wealth)) return this.ivNotice('error', '红包金额大于您的帐户余额');

        //數量輸入錯誤
        if (this.redpack.number == '' || this.redpack.number == null) return this.ivNotice('error', '请输入红包个数');
      } 
      
      //單雷紅包發送阻擋
      if (this.redpackType == 2) {
        //雷點不得為空
        if (this.singleBombPack.bomb === '') return this.ivNotice('error', '请选择雷点');

        //金額輸入錯誤
        if (this.singleBombPack.money == '' || this.singleBombPack.money == null) return this.ivNotice('error', '请输入红包金额');

        //輸入金額超過餘額
        if (parseInt(this.redpack.money) > parseInt(this.info.wealth)) return this.ivNotice('error', '红包金额大于您的帐户余额');
      }

      //多雷紅包發送阻擋
      if (this.redpackType == 3) {
        //雷點不得為空
        if (this.multiBombPack.bomb.length == 0) return this.ivNotice('error', '请选择雷点');

        //雷點數量錯誤
        if (this.multiBombPack.bomb.length < 2 || this.multiBombPack.bomb.length > 5) return this.ivNotice('error', '雷点数量限制2-5');

        //金額輸入錯誤
        if (this.multiBombPack.money == '' || this.multiBombPack.money == null) return this.ivNotice('error', '请输入红包金额');

        //輸入金額超過餘額
        if (parseInt(this.redpack.money) > parseInt(this.info.wealth)) return this.ivNotice('error', '红包金额大于您的帐户余额');
      }

      //發紅包請求
      this.redpackSending = true;
      let form = new FormData();
      form.append('roomId', this.roomId);
      form.append('uid', this.reqData.userid);

      //普通紅包發送參數
      if (this.redpackType == 1) {
        form.append('type', this.redpack.type);
        form.append('title', this.redpack.msg != '' ? this.redpack.msg : this.redpack.defaultMsg);
        form.append('money', this.redpack.money);
        form.append('number', this.redpack.number);
        form.append('betType', this.redpack.betType);
        form.append('betAmount', this.redpack.betAmount);
        form.append('odds', this.redpack.ratio);
      }

      //單雷紅包發送參數
      if (this.redpackType == 2) {
        form.append('type', this.singleBombPack.type);
        form.append('title', this.singleBombPack.msg != '' ? this.singleBombPack.msg : this.singleBombPack.defaultMsg);
        form.append('money', this.singleBombPack.money);
        form.append('number', this.singleBombPack.number);
        form.append('odds', this.singleBombPack.ratio);
        form.append('bomb', this.singleBombPack.bomb);
      }

      //多雷紅包發送參數
      if (this.redpackType == 3) {
        form.append('type', this.multiBombPack.type);
        form.append('title', this.multiBombPack.msg != '' ? this.multiBombPack.msg : this.multiBombPack.defaultMsg);
        form.append('money', this.multiBombPack.money);
        form.append('number', this.multiBombPack.number);

        //轉換雷點為字串
        form.append('bomb', this.multiBombPack.bomb.join(','));
        
        //依點數量選擇賠率
        let bomb = this.multiBombPack.bomb;
        switch (bomb.length) {
          case 2: {
            bomb.ratio = this.multiBombPack.bombConfig[0].odds;
            break;
          }
          case 3: {
            bomb.ratio = this.multiBombPack.bombConfig[1].odds;
            break;
          }
          case 4: {
            bomb.ratio = this.multiBombPack.bombConfig[2].odds;
            break;
          }
          case 5: {
            bomb.ratio = this.multiBombPack.bombConfig[3].odds;
            break;
          }
        }
        form.append('odds', bomb.ratio);
      }

      chatApi.sendRedpack(form).then(res => {
        //發完初始化數值
        this.redpackSending = false;
        this.openSendRedpack = false;
        this.redpackType = 1;
        //普通紅包重置
        this.redpack.msg = '';
        this.redpack.money = '';
        this.redpack.number = '';
        this.redpack.betType = '';
        this.redpack.betAmount = '';
        //單雷紅包重置
        this.singleBombPack.msg = '';
        this.singleBombPack.money = '';
        this.singleBombPack.number = this.singleBombPack.packConfig[0].packs;
        this.singleBombPack.ratio = this.singleBombPack.packConfig[0].odds;
        this.singleBombPack.bomb = '';
        //多雷紅包重置
        this.multiBombPack.msg = '';
        this.multiBombPack.money = '';
        this.multiBombPack.ratio = '';
        this.multiBombPack.bomb = [];
        const { code, msg } = res;
        if (code != 0) return this.ivNotice('error', msg);
      });
    },
    //關閉發紅包
    closeSendRedpack() {
      this.openSendRedpack = false;
      this.redpackType = 1;

      //普通紅包重置
      this.redpack.number = null;
      this.redpack.money = null;
      this.redpack.msg = '';

      //單雷紅包重置
      this.singleBombPack.money = null;
      this.singleBombPack.number = this.singleBombPack.packConfig[0].packs;
      this.singleBombPack.ratio = this.singleBombPack.packConfig[0].odds;
      this.singleBombPack.bomb = '';
      this.singleBombPack.msg = '';

      //多雷紅包重置
      this.multiBombPack.msg = '';
      this.multiBombPack.money = '';
      this.multiBombPack.ratio = '';
      this.multiBombPack.bomb = [];
    },
    //搶紅包
    getRedpack(item) {
      //判斷是否有領紅包的權利
      if (!this.userInfo.allowGradRed) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      this.reqData.redid = item.content.id;

      // 抢红包请求
      const { redid } = this.reqData;
      const cache = this.redpackCache[redid];

      if (cache) {
        const { gradMoney, gradIntegerMoney, gradDecimalMoney } = cache.list;
        this.gradMoney = gradMoney; // 抢到金额
        this.gradIntegerMoney = gradIntegerMoney; // 整数部分金额
        this.gradDecimalMoney = gradDecimalMoney; // 小数部分金额
        this.openMaskBox = true;
        this.getRedpackType = item.type;
      } else {
        let params = {};
        params.uid = this.reqData.userid;
        params.roomId = this.roomId;

        chatApi.getRedpack(this.reqData.redid, params).then(res => {
          const { code, msg } = res;
          if (code != 0) {
            if (code == 322) {
              this.openMaskBox = true;
              this.redpackInvalid = true;
              this.lookRedpack(this.reqData.redid);
            } else {
              this.ivNotice('error', msg);
            }
          } else {
            // 赋值
            let money = res.data.gradMoney.toFixed(2); // 转成字符串（拆分）
            let index = money.indexOf('.'); // 小数点位置
            let moneySub = res.data.gradMoney; // 抢到金额
            let integerMoney = money.slice(0, index); // 整数部分金额
            let decimalMoney = money.slice(index); // 小数部分金额

            // 渲染使用
            this.gradMoney = moneySub; // 抢到金额
            this.gradIntegerMoney = money.slice(0, index); // 整数部分金额
            this.gradDecimalMoney = money.slice(index); // 小数部分金额

            // 缓存储存
            const gradItem = {};
            gradItem.gradMoney = moneySub; // 抢到金额
            gradItem.gradIntegerMoney = integerMoney; // 整数部分金额
            gradItem.gradDecimalMoney = decimalMoney; // 小数部分金额

            // 添加缓存
            let { redid } = this.reqData;
            this.redpackCache[redid] = {
              list: gradItem,
              redid,
            };

            this.openMaskBox = true;
            this.getRedpackType = item.type;
          }
        });
      }
    },
    //關閉搶紅包
    closeGetRedpack() {
      this.openMaskBox = false;
      this.bombPreivewEnabled = false;
      this.getRedpackType = '';
      this.gradMoney = 0;
      this.gradIntegerMoney = 0;
      this.gradDecimalMoney = 0;
    },
    //掃雷紅包預覽
    bombPreview(item) {
      //判斷是否有領紅包的權利
      if (!this.userInfo.allowGradRed) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      this.openMaskBox = true;
      this.getRedpackType = item.type;
      this.previewStatus = item.content.status;

      //取得紅包ID及判斷 cache 狀態
      this.reqData.redid = item.content.id;
      let { redid } = this.reqData;
      let cache = this.redpackCache[redid];

      if (cache || item.self) {
        this.lookRedpack(redid);
      } else {
        this.bombPreivewEnabled = true;
      }

      //只有掃雷紅包還未過期或領完才繼續取參數
      if (this.previewStatus != 0) return;
      this.bombInfo = {};
      this.bombInfo.username = item.nickname;
      if (item.type == 'single_bomb') {
        this.bombInfo.type = '单雷';
      } else {
        this.bombInfo.type = '多雷';
      }
      this.bombInfo.money = item.content.money;
      this.bombInfo.bomb = item.content.bomb;
      this.bombInfo.title = item.content.title;
      this.bombInfo.self = item.self;
    },
    //開啟掃雷紅包
    openBomb(id) {
      if (this.bombInfo.self) {
        this.lookRedpack(id);
      } else {
        let params = {};
        params.uid = this.reqData.userid;
        params.roomId = this.roomId;

        chatApi.getRedpack(id, params).then(res => {
          const { code, msg } = res;
          //根據回應 code 判斷狀態 (311:領完 314:過期 310:餘額不足)
          if (code != 0) {
            this.ivNotice('error', msg);
            if (code == 310) {
              this.lookRedpack(id);
              this.getBombFailed = true;
              setTimeout(() => {
                this.getBombFailed = false;
              }, 2000);
            } else if (code == 311) {
              this.chatList.forEach(item => {
                if (item.content.id == id) {
                  item.content.status = 1;
                  item.content.remainPacks = 0;
                }
              });
            }
          }
          // 添加缓存
          let { redid } = this.reqData;
          this.redpackCache[redid] = redid;

          this.lookRedpack(redid);
        });
      }
    },
    //紅包詳情
    lookRedpack(id, redType) {
      chatApi.viewRedpack(id, { roomId: this.roomId }).then(res => {
        const { code, data, msg } = res;
        if (code != 0) return this.ivNotice('error', msg);
        this.openLookRedpack = true;

        if (redType) {
          this.openMaskBox = true;
          this.getRedpackType = redType;
        }

        if (this.getRedpackType != 'single_bomb' && this.getRedpackType != 'multi_bomb') {
          this.redpackDetail.headImg = data.headImg;
          this.redpackDetail.hostName = data.hostName;
          this.redpackDetail.gradMoney = data.gradMoney;
          this.redpackDetail.balance = data.balance;
          this.redpackDetail.total = data.total;
          this.redpackDetail.gradCount = data.gradCount;
          this.redpackDetail.money = data.money;
          this.redpackDetail.gradList = data.gradList;
          let money = data.money - data.balance;
          this.redpackDetail.receiveMoney = money.toFixed(2);
        } else {
          this.bombDetail.title = data.title;
          this.bombDetail.headImg = data.headImg;
          this.bombDetail.hostName = data.hostName;
          this.bombDetail.totalMoney = data.totalMoney;
          this.bombDetail.totalPacks = data.totalPacks;
          this.bombDetail.packs = data.packs;
          this.bombDetail.bomb = data.bomb;
          this.bombDetail.gradList = data.gradList;

          //當紅包已領完時改變歷史記錄中該筆資料的狀態
          if (this.bombDetail.totalPacks == this.bombDetail.packs) {
            this.chatList.forEach(item => {
              if (item.content.id == id) {
                item.content.status = 1;
              }
            });
          }
        }
      });
    },
    //關閉紅包詳情
    closeLookRedpack() {
      this.openMaskBox = false;
      this.redpackInvalid = false;
      this.openLookRedpack = false;
      this.bombPreivewEnabled = false;
      this.getRedpackType = '';
      this.redpackDetail = {};
      this.bombDetail = {};
    },
    //預覽圖片
    previewImage(src) {
      this.openMaskBox = true;
      this.openPreview = true;
      this.previewSrc = src;
    },
    //關閉預覽圖片
    closePreview() {
      this.openMaskBox = false;
      this.openPreview = false;
      this.previewSrc = '';
    },
    //開啟跟投
    openFollowBet(item) {
      //防止重複點擊跟投
      if (this.followBetLock) return this.ivNotice('warning', '系统处理中，请勿重复操作!');

      this.followBetLock = true;

      lotteryApi.issue({ params: { category: item.content.category } }).then(data => {
        this.followBetLock = false;
        let { code, msg } = data;

        if (code != 0) return this.ivNotice('error', msg);

        //過期無法跟投
        if (data.issue > item.content.issue) return this.ivNotice('info', '当前期已截止，无法跟投!');

        //組合跟投設定
        let betList = this.followBetList;
        betList.type = item.type;
        if (item.type == 'order_share') {
          betList.shareId = item.content.shareId;
        } else {
          betList.planId = item.content.planId;
        }
        betList.nickName = item.nickname;
        betList.lotteryName = item.content.name;
        betList.modeName = item.content.modeName;
        betList.issue = item.content.issue;
        betList.list = [
          {
            value: item.content.list[0].value,
            money: '',
          },
        ];

        //開啟跟投視窗
        this.openMaskBox = true;
        this.isOpenFollowBet = true;
      });
    },
    //送出跟投
    followBet() {
      //取得需要送出的參數
      let betList = this.followBetList;
      betList.list[0].money = Number(this.followBetMoney);
      let params = {};
      params.list = betList.list;
      if (betList.type == 'plan_share') {
        params.type = 1;
        params.planId = betList.planId;
      } else {
        params.type = 2;
        params.shareId = betList.shareId;
      }

      if (this.followBetMoney == '') {
        this.ivNotice('error', '请输入金额');
      } else {
        chatApi.followBet(params).then(data => {
          let { code, msg } = data;
          if (code != 0) {
            this.ivNotice('error', msg);
          } else {
            this.ivNotice('success', '跟投成功');
          }

          this.closeFollowBet();
        });
      }
    },
    //關閉跟投視窗
    closeFollowBet() {
      this.followBetMoney = '';
      this.followBetList = {};
      this.openMaskBox = false;
      this.isOpenFollowBet = false;
    },
    //開啟 emoji 列表
    openEmojiList() {
      //權限不足不能送出
      if (!this.allowSendMsg) return this.ivNotice('error', '抱歉所在用户组无此操作权限');

      this.openEmoji = !this.openEmoji;

      //如果置底按鈕沒開啟，開關列表就捲動至聊天記錄最底
      if (!this.clickToBottomEnabled) this.scrollToBottom();
    },
    //選擇 emoji
    selectEmoji(item) {
      this.sendMsg += item.title;
    },
    //關閉所有聊天室彈窗
    closeAllWindow() {
      this.closeUserInfo(); //使用者資料選單
      this.closeBanned(); //禁言選單
      this.closeGetRedpack(); //搶紅包
      this.closeLookRedpack(); //紅包詳情
      this.closePreview(); //預覽圖片
      this.closeFollowBet(); //跟投視窗
    },
    //訊息列表捲動事件
    scroll() {
      this.$nextTick(() => {
        let chatBox = this.$refs.chatBox;
        let { scrollHeight, clientHeight, scrollTop } = chatBox;
        let scrollDistance = scrollHeight - clientHeight - scrollTop; //距离
        this.clickToBottomEnabled = scrollDistance > 100; //滚动距离超过100，滚屏关闭
        //捲到最底清空未讀數字
        if (scrollDistance == 0) {
          this.noRead = 0;
        }
      });
    },
    //手動置底
    clickToBottom() {
      this.scrollToBottom();
    },
    //聊天室過濾器變更顯示類型
    changeFilter(type) {
      this.filter = type;
      this.filterEnabled = false;
      this.scrollToBottom();
    },
  },
  watch: {
    // 监听输入框内容
    sendMsg() {
      if (!this.allowSendMsg) {
        this.sendEnabled = false;
      } else {
        if (this.sendMsg != '') {
          this.sendEnabled = true; //啟用發送按鈕
        } else {
          this.sendEnabled = false; //停用發送按鈕
        }
      }
    },
    chatMsg(data) {
      this.websocketonmessage(data);
    },
  },
};
</script>