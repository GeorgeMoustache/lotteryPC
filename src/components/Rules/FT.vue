<template>
  <div class="help_list">
    <div class="lis">
      <h5>{{data.label}}</h5>
      <ul>
        <li v-for="(label, idx) in tabs" :key="label" @click="tabIdx = idx" :class="{'sli': tabIdx == idx}" >{{label}}</li>
      </ul>
    </div>
    <div class="help_col" :class="{'show': tabIdx == 0}">
      <h5><strong>【两面】</strong></h5>
      <p><strong>◎1～10 两面</strong>：指 单、双；大、小。<br>
        <strong>◎单、双</strong>：号码为双数叫双，如4、8 ；号码为单数叫单， 如 5、9。<br>
        <strong>◎大、小</strong>：开出之号码大于或等于6为大，小于或等于5 为小。<br>
        <strong>◎1～5龙虎</strong>:<br> 冠　军 龙/虎：“第一名”号码大于“第十名”号码视为【龙】中奖、反之小于视为【虎】中奖，其余视为不中奖。<br> 亚　军 龙/虎：“第二名”号码大于“第九名”号码视为【龙】中奖、反之小于视为【虎】中奖，其余视为不中奖。<br>        第三名
        龙/虎：“第三名”号码大于“第八名”号码视为【龙】中奖、反之小于视为【虎】中奖，其余视为不中奖。
        <br> 第四名 龙/虎：“第四名”号码大于“第七名”号码视为【龙】中奖、反之小于视为【虎】中奖，其余视为不中奖。<br> 第五名 龙/虎：“第五名”号码大于“第六名”号码视为【龙】中奖、反之小于视为【虎】中奖，其余视为不中奖。</p>


      <h5><strong>【排名1～10】</strong></h5>
      <p><strong>◎第一名～第十名 号码指定</strong>：每一个号码为一投注组合，开奖结果“投注号码”对应所投名次视为中奖，其余情形视为不中奖。</p>


      <h5><strong>【冠、亚军 组合】</strong></h5>
      <p><strong>◎亚军 龙/虎：</strong>冠亚和单双 ：“冠亚和值”为单视为投注“单”的注单视为中奖，为双视为投注“双”的注单视为中奖，其余视为不中奖。<br>
        <strong>冠亚和大小</strong>：“冠亚和值”大于11时投注“大”的注单视为中奖，小于或等于11时投注“小”的注单视为中奖，其余视为不中奖。<br>
        <strong>冠亚和指定</strong>：“冠亚和值”可能出现的结果为3～19， 投中对应“冠亚和值”数字的视为中奖，其余视为不中奖。</p>
    </div>
    <div class="help_col" :class="{'show': tabIdx == 1}">
      <h5>筹备中</h5>
    </div>
    <div class="help_col" :class="{'show': tabIdx == 2}">
      <h5><strong>开奖说明</strong></h5>
      <p>
        <br> 开奖时间：每天180期、中午13:04开到凌晨04:04（5分钟一期）
        <br> 开奖号码：开奖结果为十位。
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rules_FT',
  props: ['data'],
  data() {
    return {
      tabs: ['传统玩法', '官方玩法', '游戏说明'],
      tabIdx: 0,
    };
  },
};
</script>
