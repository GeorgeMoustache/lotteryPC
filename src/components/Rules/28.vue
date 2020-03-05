<template lang="pug">
  <div class="help_list">
    <div class="lis">
      <h5>{{data.label}}</h5>
      <ul>
        <li v-for="(label, idx) in tabs" :key="label" @click="tabIdx = idx" :class="{'sli': tabIdx == idx}" >{{label}}</li>
      </ul>
    </div>
    <div class="help_col" :class="{'show': tabIdx == 0}">
      <h5><strong>【混合玩法规则】</strong></h5>
      <p><strong>◎大小玩法</strong><br> 数字14-27为大 ；<br> 数字0-13为小；
        <br> 当期开奖号码和值，符合投注组合，即中奖
      </p>
      <p><strong>◎单双玩法</strong><br> 数字1，3，5，~27为单 ；<br> 数字0，2，4，~26为双；
        <br> 当期开奖号码和值，符合投注组合，即中奖
      </p>
      <p><strong>◎组合玩法</strong><br> 从大双,小单,大单,小双中至少选一注，当期开奖号码和值，符合投注组合，即中奖。另和值当开13时投注小单为保本，和值开14时投注大双为保本。
      </p>
      <p><strong>◎极值玩法 </strong><br> 数字0，1，2，3，4为极小 ；<br> 数字23，24，25，26，27为极大；
        <br> 当期开奖号码和值，符合投注组合，即中奖
      </p>
      <p><strong>◎波色玩法</strong><br> 绿波1，4，7，10，16，19，22，25；
        <br> 蓝波2，5，8，11，17，20，23，26；
        <br> 红波3，6，9，12，15，18，21，24；
        <br> 当期开奖号码和值，符合投注组合，即中奖
      </p>
      <p><strong>◎豹子玩法</strong><br> 当期开奖号码三个数字相同即中奖
      </p>
      <h5><strong>【和值玩法规则】</strong></h5>
      <p><strong>◎和值玩法</strong><br> 从0-27中选取一个以上的数字，投注号码与开奖号码和值相同，即中奖
      </p>
      <h5><strong>【特码包三玩法规则】</strong></h5>
      <p><strong>◎特码包三玩法</strong><br> 从0-27中任选3个号码组成1注，任意一个选号与开奖号码和值相同，即中奖
      </p>
    </div>
    <div class="help_col" :class="{'show': tabIdx == 1}">
      <h5><strong>总则</strong></h5>
      <p>
        template(v-if="/BJ28/.test(data.alias)")
          | 开奖时间：每天179期，09:05-23:55（5分钟一期）
        template(v-else-if="/XY28/.test(data.alias)")
          | 开奖时间：每天420期，09:00-次日06:00（3分钟一期）
        template(v-else-if="/JND28/.test(data.alias)")
          | 开奖时间：每三分半钟开一期，每天维护时间为：晚上20:00点到21:30点，周一可能会有延迟
        template(v-else-if="/YF28/.test(data.alias)")
          | 开奖时间：每天1051期，08:30-次日02:00（1分钟一期）
        <br> 开奖号码：开奖结果为3个号码
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rules_28',
  props: ['data'],
  data() {
    return {
      tabs: ['传统玩法', '开奖规则'],
      tabIdx: 0,
    };
  },
};
</script>
