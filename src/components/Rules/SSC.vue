<template lang="pug">
  <div class="help_list">
    <div class="lis">
      <h5>{{data.label}}</h5>
      <ul>
        <li v-for="(label, idx) in tabs" :key="label" @click="tabIdx = idx" :class="{'sli': tabIdx == idx}" >{{label}}</li>
      </ul>
    </div>
    <div class="help_col" :class="{'show': tabIdx == 0}">
      <h5><strong>【双面玩法】</strong></h5>
      <p><strong>◎双面&gt;&gt;大小玩法说明</strong><br> 开奖结果万位、千位、百位、十位或个位数字为5、6、7、8、9时为“大”，若为0、1、2、3、4时为“小”，当投注位数大小与开奖结果的位数大小相符时，即为中奖。
        <br> ※举例：投注者购买百位小，当期开奖结果如为20352（3为小），则视为中奖。
      </p>
      <p><strong>◎双面&gt;&gt;单双玩法说明</strong><br> 开奖结果万位、千位、百位、十位或个位数字为1、3、5、7、9时为“单”，若为0、2、4、6、8时为“双”，当投注位数单双与开奖结果的位数单双相符时，即为中奖。
        <br> ※举例：投注者购买百位单，当期开奖结果如为20130（1为单），则视为中奖。
      </p>
      <p><strong>◎双面&gt;&gt;质合玩法说明</strong><br> 开奖结果万位、千位、百位、十位或个位数字为1、2、3、5、7时为“质数”，若为0、4、6、8、9时为“合数”，当投注位数质合与开奖结果的位数质合相符时，即为中奖。
        <br> ※举例：投注者购买个位质，当期开奖结果如为20957（7为质），则视为中奖。
      </p>
      <p><strong>◎双面&gt;&gt;总和大小 玩法说明</strong><br> 开奖结果所有号码总和的为23、24、25、26、27、28、29、30、31、32、33、34、35、36、37、38、39、40、41、42、43、44、45时为“大”，若为0、1、2、3、4、5、6、7、8、9、10、11、12、13、14、15、16、17、18、19、20、21、22时为“小”，当投注和数大小与开奖结果的和数大小相符时，即为中奖。 <br> ※举例：投注者购买"总大"，当期开奖结果如为20976（万2+千0+百9+十7+个6=24为大），则视为中奖。
      </p>
      <p><strong>◎双面&gt;&gt;龙虎和 玩法说明</strong><br> 龙虎和是以开奖结果的万位和个位作为基准，取万为龙，个为虎的数字进行大小比对的一种玩法；
        <br> 当投注龙/虎时，开奖结果为和局，那么押注龙/虎视为不中奖，且计算有效金额退水；
        <br> 当投注"和"时，开奖结果为龙/虎，投注“和”视为不中奖；
        <br> 举例：开奖结果为：2,1,3,5,1 万为龙、个为虎：结果 龙(2）大于虎（1），即为开龙；如结果一样大，即为开和局！</p>
      <p><strong>◎双面&gt;&gt;总和单双 玩法说明</strong><br> 开奖结果总和的个位数为1、3、5、7、9时为“单”，若为0、2、4、6、8时为“双”，当投注总单双与开奖结果的总单双相符时，即为中奖。
        <br> ※举例：投注者购买总单，当期开奖结果如为20290（百2+十9+个0=11为单），则视为中奖。
      </p>
      <hr>
      <h5><strong>【龙虎玩法】</strong></h5>
      <p>龙虎游戏规则：龙虎是以开奖结果的五个数字作为基准，取任意位置（万、千、百、十、个）的数字进行组合大小比对的一种玩法；<br> 当投注龙/虎时，开奖结果为和局，那么押注龙/虎视为不中奖；
        <br> 当投注"和"时，开奖结果为龙/虎，投注“和”视为不中奖；
        <br> 举例：开奖结果为：2,1,3,5,2 万为龙、千为龙虎时：结果 龙(2）大于虎（1），即为开龙；如万为龙，个为虎时，结果一样大，即为开和局！<br> 说明：龙1 VS 虎2 即为万为龙，千为虎；龙2 VS 虎4 即为千为龙，十为虎；</p>
    </div>
    <div class="help_col" :class="{'show': tabIdx == 1}">
      <h4><strong>【五星玩法】</strong></h4>
      <p><strong>◎五星直选&gt;&gt;直选复式 </strong><br> 从万位、千位、百位、十位和个位各选1个号码为一注，每位号码可从0～9全选，投注号码与开奖号码按位一致，即为中奖。
        <br> ※举例：投注方案：23456 开奖号码：23456，即中五星直选。</p>
      <p><strong>◎五星直选&gt;&gt;直选单式 </strong><br> 从万位、千位、百位、十位和个位各手动输入1个号码为一注，每位号码可从0～9全选，投注号码与开奖号码按位一致，即为中奖。
        <br> ※举例：投注方案：23456 开奖号码：23456，即中五星直选。</p>

      <hr>
      <h4><strong>【四星玩法】</strong></h4>
      <p><strong>◎四星直选&gt;&gt;直选复式 </strong><br> 从千位、百位、十位和个位各选1个号码为一注，每位号码可从0～9全选，投注号码与开奖号码按位一致，即为中奖。
        <br> ※举例：投注方案：3456 开奖号码：3456，即中四星直选。</p>
      <p><strong>◎四星直选&gt;&gt;直选单式 </strong><br> 从千位、百位、十位和个位各手动输入1个号码为一注，每位号码可从0～9全选，投注号码与开奖号码按位一致，即为中奖。
        <br> ※举例：投注方案：3456 开奖号码：3456，即中四星直选。</p>

      <hr>
      <h4><strong>【后三玩法】</strong></h4>
      <p><strong>◎后三直选&gt;&gt;直选复式 </strong><br> 从百、十、个位中至少各选择1个号码组成一注，所选号码与开奖号码全部相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：345 开奖号码后三位为：345，即中后三位直选。</p>
      <p><strong>◎后三直选&gt;&gt;直选单式 </strong><br> 从百、十、个位中至少各手动输入1个号码组成一注，所选号码与开奖号码全部相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：345 开奖号码：后三位 345，即中后三直选。</p>
      <p><strong>◎后三直选&gt;&gt;后三组合 </strong><br> 从百、十、个位中至少各选择1个号码组成1-3星的组合共三注，当个位数以开奖号码相同，则中一个3等奖；如果个位和十位号码和开奖号码相同，则中一个3等奖以及一个2等奖，以次类推，最高可中3个奖。
        <br> ※举例：投注方案：购买：6+7+8，该票共6元，由以下三注：678(三星)、78(二星)、8(一星)构成 开奖号码：678，即可中奖 一星、二星、三星各一注。</p>
      <p><strong>◎后三直选&gt;&gt;直选和值 </strong><br> 所选号码数值等于开奖号码的百、十、个三个数值相加之和，即为中奖。
        <br> ※举例：投注方案：和值：1，开奖号码：后三位001、010、100，即中后三值选。
      </p>
      <p><strong>◎后三直选&gt;&gt;直选跨度 </strong><br> 所选数值与开奖号码后三位最大和最小数字相减之差，即为中奖。
        <br> ※举例：投注方案：跨度：8，开奖号码：**129，最大号码9与最小号码1相减值等于8，所选号与跨度号码相同即中奖。
      </p>
      <p><strong>◎后三组选&gt;&gt;组三复式 </strong><br> 从0-9号码中至少选择2个号码组成两注，所选号码与开奖号码的百、十、个位相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：588开奖号码：后三位588(顺序不限)，即可中后三组选三。
      </p>
      <p><strong>◎后三组选&gt;&gt;组三单式 </strong><br> 手动输入一个3位数号码组成一注，三个数字中必须有两个数字相同，输入的数字与开奖的百、十、个位相同，顺序不限，即为中奖。
        <br> ※举例：投注方案：001 开奖号码：后三位010(顺序不限)，即中后三组选三。</p>
      <p><strong>◎后三组选&gt;&gt;组六复式 </strong><br> 从0-9号码中至少选择3个号码组成一注，所选号码与开奖号码的百、十、个位相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：258开奖号码：后三位852(顺序不限)，即可中后三组选六。
      </p>
      <p><strong>◎后三组选&gt;&gt;组六单式 </strong><br> 手动输入一个3位数号码组成一注，三个数字完全不相同，所选号码与开奖号码的万、千、百位相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：158 开奖号码：后三位581（顺序不限），即可中后三组选六。</p>
      <p><strong>◎后三组选&gt;&gt;混合组选 </strong><br> 手动输入一个3位数号码组成一注(不包含豹子号)，开奖号码后3位为组选三或组选六形态，投注号码以开奖号码后三位相同，顺序不限，即为中奖。
        <br> ※举例：投注方案：001 和 123 开奖号码：后三位 010（顺序不限）即中后三组选三，或者后三位 312（顺序不限）即中后三组选六。</p>
      <p><strong>◎后三组选&gt;&gt;组选和值 </strong><br> 开奖号码后3位数号码组成一注(不包含豹子号)，开奖号码后3位为组选三或组选六形态，所选数值等于开奖号码的百、十、个位三个数字相加之和，即为中奖。
        <br> ※举例：投注方案：和值：3，开奖号码：后三位003(顺序不限)，即中后三组选三，或者后三位012(顺序不限)即中后三组选六。
      </p>
      <p><strong>◎后三组选&gt;&gt;组选包胆 </strong><br> 从0-9号码中任意选择一个胆码，开奖号码后三位为组选三或组选六形态(不含豹子号，投注号码与开奖后三位中任意一位相同，即为中奖。
        <br> ※举例：投注方案：包胆3：开奖号码：后三位3XX或者33X，即中后三组选三，后三位3XY，即中后三组选六。
      </p>
      <p><strong>◎后三其它&gt;&gt;和值尾数 </strong><br> 所选号码等于开奖号码的百、十、个位数字相加之和的尾数，即为中奖。
        <br> ※举例：投注方案：和值尾数8 开奖号码：后三位936，和值尾数为8，即中和值尾数。</p>
      <p><strong>◎后三其它&gt;&gt;特殊号 </strong><br> 所选号码特殊属性与开奖号码后三位号码属性一致，即为中奖。其中：1.顺子号的百、十、个位不分顺序(特别号码：019、089也是顺子号)；2.对子号指的是开奖号码的后三位当中,任意两位数字相同的三位数号码；3.豹子号指的是开奖号码后三位当中,三位数字全部相同的三位号码。
        <br> ※举例：投注方案：豹子顺子对子 开奖号码：后三位888，即中豹子；后三位678，即中顺子；后三位558，即中对子。</p>

      <hr>
      <h4><strong>【中三玩法】</strong></h4>
      <p><strong>◎中三直选&gt;&gt;直选复式 </strong><br> 从千、百、十位中至少各选择1个号码组成一注，所选号码与开奖号码中3位相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：345 开奖号码中三位：345，即中中三直选。</p>
      <p><strong>◎中三直选&gt;&gt;直选单式 </strong><br> 手动输入一个3位数号码组成一注，所选号码与开奖号码的千、百、十位相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：345 开奖号码：中三位 345，即中中三直选。</p>
      <p><strong>◎中三直选&gt;&gt;中三组合 </strong><br> 从千、百、十位中至少各选择一个号码组成1-3星的组合共三注，当十位号码与开奖号码相同，则中1个3等奖； 如果百位与十位号码与开奖号码相同，则中1个3等奖以及1个2等奖，依此类推，最高可中3个奖。
        <br> ※举例：投注方案：购买：6+7+8，该票共6元，由以上3注：678(三星)、78(二星)、8(一星)构成 开奖号码：中三位 678，即可中三星、二星、一星各1注。</p>
      <p><strong>◎中三直选&gt;&gt;直选和值 </strong><br> 所选数值等于开奖号码的千、百、十三个数字相加之和，即为中奖。
        <br> ※举例：投注方案：和值1 开奖号码：中三位001，010，100，即中中三和值。
      </p>
      <p><strong>◎中三直选&gt;&gt;直选跨度 </strong><br> 	所选数值等于开奖号码的中3位最大与最小数字相减之差，即为中奖。
        <br> ※举例：投注方案：跨度8 开奖号码： * 1 2 9  * ，最大9与最小1相减相等于8，所选号与跨度号码相同即中奖。
      </p>
      <p><strong>◎中三组选&gt;&gt;组三复式 </strong><br> 从0-9中至少选择2个号码组成两注，所选号码与开奖号码的千、百、十位相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选三。
      </p>
      <p><strong>◎中三组选&gt;&gt;组三单式 </strong><br> 手动输入一个3位数号码组成一注，三个数字当中必须有二个数字相同，所选号码与开奖号码的千、百、十位相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选三。</p>
      <p><strong>◎中三组选&gt;&gt;组六复式 </strong><br> 从0-9中至少选择3个号码组成一注，所选号码与开奖号码的千、百、十位相同，顺序不限，即为中奖。
        <br> ※举例：投注方案：258 开奖号码：中三位 852（顺序不限），即中三组选六
      </p>
      <p><strong>◎中三组选&gt;&gt;组六单式 </strong><br> 手动输入一个3位数号码组成一注，三个数字当中必须有二个数字相同，所选号码与开奖号码的千、百、十位相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选三。</p>
      <p><strong>◎中三组选&gt;&gt;混合组选 </strong><br> 手动输入一个3位数号码为一注(不含豹子号)，开奖号码中3位为组三或组六形态，投注号码与开奖号码中3位相同，顺序不限，即为中奖。
        <br> ※举例：投注方案：001 和 123 开奖号码：中三位 010（顺序不限）即中中三组选三，或者中三位 312（顺序不限）即中中三组选六。</p>
      <p><strong>◎中三组选&gt;&gt;组选和值 </strong><br> 开奖号码中3位为组三或组六形态(不含豹子号)，所选数值等于开奖号码千、百、十位三个数字相加之和，即为中奖。
        <br> ※举例：投注方案：和值3 开奖号码：中三位 003（顺序不限）即中中三组选三，或者中三位 012（顺序不限）即中中三组选六。
      </p>
      <p><strong>◎中三组选&gt;&gt;组选包胆 </strong><br> 从0-9中任意选择1个胆码，开奖号码中3位为组三或组六形态(不含豹子号)，投注号码与开奖号码中3位中任意1位相同，即为中奖。
        <br> ※举例：投注方案：包胆3 开奖号码：中三位 3XX 或者 33X，即中中三组选三，或者中三位 3XY，即中中三组选六。
      </p>
      <p><strong>◎中三其它&gt;&gt;和值尾数 </strong><br> 所选数值等于开奖号码的千、百、十位三个数字相加之和的尾数，即为中奖。
        <br> ※举例：投注方案：和值尾数 8开奖号码：中三位 936，和值尾数为8，即中和值尾数。</p>
      <p><strong>◎中三其它&gt;&gt;特殊号 </strong><br> 所选的号码特殊属性和开奖号码中3位的属性一致，即为中奖。其中：1.顺子号的千、百、十位不分顺序(特别号码：019、089也是顺子号)；2.对子号指的是开奖号码的中三位当中，任意2位数字相同的三位数号码。
        <br> ※举例：投注方案：豹子顺子对子 开奖号码：中三位 888，即中豹子；中三位 678，即中顺子；中三位 558，即中对子。</p>

      <hr>
      <h4><strong>【前三玩法】</strong></h4>
      <p><strong>◎前三直选&gt;&gt;直选复式 </strong><br> 从万、千、百位中至少各选择1个号码组成一注，所选号码与开奖号码全部相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：345 开奖号码前三位为：345，即中前三位直选。</p>
      <p><strong>◎前三直选&gt;&gt;直选单式 </strong><br> 从万、千、百位中至少各选择1个号码组成一注，所选号码与开奖号码全部相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：134 开奖号码后三位为：134，即中前三位直选。</p>
      <p><strong>◎前三直选&gt;&gt;前三组合 </strong><br> 从万、千、百位中至少各选择1个号码组成1-3星的组合共三注，当百位数以开奖号码相同，则中一个3等奖；如果百位和千位号码和开奖号码相同，则中一个3等奖以及一个2等奖，以次类推，最高可中3个奖。
        <br> ※举例：投注方案：购买：6+7+8，该票共6元，由以下三注：678(三星)、78(二星)、8(一星)构成 开奖号码：678，即可中奖 一星、二星、三星各一注。</p>
      <p><strong>◎前三直选&gt;&gt;直选和值 </strong><br> 所选号码数值等于开奖号码的万、百、十三个数值相加之和，即为中奖。
        <br> ※举例：投注方案：和值：1，开奖号码：前三位001、010、100，即中前三值选。
      </p>
      <p><strong>◎前三直选&gt;&gt;直选跨度 </strong><br> 所选数值与开奖号码后三位最大和最小数字相减之差，即为中奖。
        <br> ※举例：投注方案：跨度：8，开奖号码：**129，最大号码9与最小号码1相减值等于8，所选号与跨度号码相同即中奖。
      </p>
      <p><strong>◎前三组选&gt;&gt;组三复式 </strong><br> 从0-9号码中至少选择2个号码组成两注，所选号码与开奖号码的万、千、百位相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：588开奖号码：前三位588(顺序不限)，即可中前三组选三。
      </p>
      <p><strong>◎前三组选&gt;&gt;组三单式 </strong><br> 手动输入一个3位数号码组成一注，三个数字中必须有两个数字相同，输入的数字与开奖的万、千、百位相同，顺序不限，即为中奖。
        <br> ※举例：投注方案：001 开奖号码：前三位010(顺序不限)，即中前三组选三。 </p>
      <p><strong>◎前三组选&gt;&gt;组六复式 </strong><br> 从0-9号码中至少选择3个号码组成一注，所选号码与开奖号码的万、百、十位相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：258开奖号码：前三位852(顺序不限)，即可中前三组选六。
      </p>
      <p><strong>◎前三组选&gt;&gt;组六单式 </strong><br> 手动输入一个3位数号码组成一注，所选的号码与开奖的号码的万、百、十位相同，顺序不限，即为中奖。
        <br> ※举例：投注方案：158 开奖号码：前三位581（顺序不限），即可中前三组选六。</p>
      <p><strong>◎前三组选&gt;&gt;混合组选 </strong><br> 手动输入一个3位数号码组成一注(不包含豹子号)，开奖号码后3位为组选三或组选六形态，投注号码以开奖号码前三位相同，顺序不限，即为中奖。
        <br> ※举例：投注方案：001和123 开奖号码：前三位010(顺序不限)，即中前三组选三，或前三位312(顺序不限)，即中前三组选六。</p>
      <p><strong>◎前三组选&gt;&gt;组选和值 </strong><br> 开奖号码后3位数号码组成一注(不包含豹子号)，开奖号码后3位为组选三或组选六形态，所选数值等于开奖号码的万、百、十位三个数字相加之和，即为中奖。
        <br> ※举例：投注方案：和值：3，开奖号码：前三位003(顺序不限)，即中前三组选三，或者前三位012(顺序不限)即中前三组选六。
      </p>
      <p><strong>◎前三组选&gt;&gt;组选包胆 </strong><br> 从0-9号码中任意选择一个胆码，开奖号码前三位为组选三或组选六形态(不含豹子号，投注号码与开奖后三位中任意一位相同，即为中奖。
        <br> ※举例：投注方案：包胆3：开奖号码：前三位3XX或者33X，即中前三组选三，前三位3XY，即中前三组选六。
      </p>
      <p><strong>◎前三其它&gt;&gt;和值尾数 </strong><br> 所选号码等于开奖号码的万、百、十位数字相加之和的尾数，即为中奖。
        <br> ※举例：投注方案：和值尾数8 开奖号码：前三位936，和值尾数为8，即中和值尾数。</p>
      <p><strong>◎前三其它&gt;&gt;特殊号 </strong><br> 所选号码特殊属性与开奖号码前三位号码属性一致，即为中奖。其中：1.顺子号的万、百、十位不分顺序(特别号码：019、089也是顺子号)；2.对子号指的是开奖号码的前三位当中，任意两位数字相同的三位数号码;3.豹子号指的是开奖号码前三位当中,三位数字全部相同的三位号码。
        <br> ※举例：投注方案：豹子顺子对子 开奖号码：前三位888，即中豹子；前三位678，即中顺子；前三位558，即中对子。</p>
      
      <hr>
      <h4><strong>【中三玩法】</strong></h4>
      <p><strong>◎中三直选&gt;&gt;直选单式 </strong><br> 手动输入号码，至少输入1个三位数号码组成一注。赔率：990.000
        <br> ※举例：投注方案：345 开奖号码：中三位 345，即中中三直选。</p>
      <p><strong>◎中三直选&gt;&gt;直选复式 </strong><br> 从千位、百位、十位各选一个号码组成一注。赔率：780.000
        <br> ※举例：投注方案：345 开奖号码中三位：345，即中中三直选。</p>
      <p><strong>◎中三直选&gt;&gt;直选和值 </strong><br> 从0-27中任意选择1个或1个以上号码。赔率：980.000
        <br> ※举例：投注方案：和值1 开奖号码：中三位001，010，100，即中中三和值。</p>
      <p><strong>◎中三直选&gt;&gt;直选跨度 </strong><br> 从0-9中选择1个号码。赔率：990.000
        <br> ※举例：投注方案：跨度8 开奖号码： * 1 2 9  * ，最大9与最小1相减相等于8，所选号与跨度号码相同即中奖。</p>

      <p><strong>◎中三组选&gt;&gt;中三组合 </strong><br> 从千位、百位、十位各选一个号码组成三注。赔率：一等奖：980.000、二等奖：98.000、三等奖：9.800
        <br> ※举例：投注方案：购买：6+7+8，该票共6元，由以上3注：678(三星)、78(二星)、8(一星)构成 开奖号码：中三位 678，即可中三星、二星、一星各1注。</p>
      <p><strong>◎中三组选&gt;&gt;组三复式 </strong><br> 从0-9中任意选择2个或2个以上号码。赔率：326.666
        <br> ※举例：投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选三。</p>
      <p><strong>◎中三组选&gt;&gt;组六复式 </strong><br> 从0-9中任意选择3个或3个以上号码。赔率：163.333
        <br> ※举例：投注方案：258 开奖号码：中三位 852（顺序不限），即中三组选六</p>
      <p><strong>◎中三组选&gt;&gt;组选和值 </strong><br> 从1-26中任意选择1个以上号码。赔率：组三：326.666、组六：163.333
        <br> ※举例：投注方案：和值3 开奖号码：中三位 003（顺序不限）即中中三组选三，或者中三位 012（顺序不限）即中中三组选六。</p>
      <p><strong>◎中三组选&gt;&gt;组三单式 </strong><br> 手动输入号码，至少输入1个三位数号码（三个数字中必须有二个数字相同）。赔率：326.666
        <br> ※举例：投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选三。</p>
      <p><strong>◎中三组选&gt;&gt;组六单式 </strong><br> 手动输入号码，至少输入1个三位数号码（三个数字完全不相同）。赔率：163.333
        <br> ※举例：投注方案：588 开奖号码：中三位588（顺序不限），即可中中三组选三。</p>
      <p><strong>◎中三组选&gt;&gt;组选包胆 </strong><br> 从0-9中任选1个号码。赔率：组三：326.666、组六：163.333
        <br> ※举例：投注方案：包胆3 开奖号码：中三位 3XX 或者 33X，即中中三组选三，或者中三位 3XY，即中中三组选六。</p>
      <p><strong>◎中三组选&gt;&gt;混合组选 </strong><br> 手动至少输入三个号码构成一注(不包含豹子号)。赔率：组三：326.666、组六：163.333
        <br> ※举例：投注方案：001 和 123 开奖号码：中三位 010（顺序不限）即中中三组选三，或者中三位 312（顺序不限）即中中三组选六。</p>

      <p><strong>◎中三其它&gt;&gt;和值尾数 </strong><br> 从0-9中选择1个号码。赔率：9.900
        <br> ※举例：投注方案：和值尾数 8开奖号码：中三位 936，和值尾数为8，即中和值尾数。</p>
      <p><strong>◎中三其它&gt;&gt;特殊号 </strong><br> 选择一个号码形态。赔率：豹子：98.000、顺子：16.334、对子：3.629
        <br> ※举例：投注方案：豹子顺子对子 开奖号码：中三位 888，即中豹子；中三位 678，即中顺子；中三位 558，即中对子。</p>

      <hr>
      <h4><strong>【前二玩法】</strong></h4>
      <p><strong>◎前二直选&gt;&gt;直选复式 </strong><br> 从万、千位中至少各选择1个号码组成一注，所选号码与开奖号码的前2位相同，且顺序一致，即为中奖。 <br> ※举例：投注方案：58 开奖号码前两位：58，即中前二直选。</p>
      <p><strong>◎前二直选&gt;&gt;直选单式 </strong><br> 手动输入2个号码组成一注，输入号码的万、千位与开奖号码相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：58 开奖号码前两位：58，即中前二直选。</p>
      <p><strong>◎前二直选&gt;&gt;直选和值 </strong><br> 开奖号码的万、千位中两个数字相加之和等于所选和值，即为中奖。 <br> ※举例：投注方案：和值1 开奖号码前两位：01或10，即中前二和值。</p>
      <p><strong>◎前二直选&gt;&gt;直选跨度 </strong><br> 所选数值等于前二位最大数与最小数相减之差，即为中奖。
        <br> ※举例：投注方案：跨度9 开奖号码：90***，最大值9与最小值0相减之差即为跨度值，当所选号与跨度号码相同，即为中奖。</p>
      <p><strong>◎前二组选&gt;&gt;组选复式 </strong><br> 从0-9号码中选取两个号码组成一注，所选号码与开奖号码的万、千位相同，顺序不限，即为中奖。
        <br> ※举例：投注方案：58 开奖号码：前两位 58 或 85(顺序不限，不含对子号)，即为中奖。</p>
      <p><strong>◎前二组选&gt;&gt;组选单式 </strong><br> 手动输入2个号码组成一注，输入号码的万、千位与开奖号码相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：58 开奖号码：前两位 58 或 85(顺序不限，不含对子号)，即为中奖。</p>
      <p><strong>◎前二组选&gt;&gt;组选和值 </strong><br> 开奖号码的万、千位中两个数字相加之和等于所选号(不含对子号)，即为中奖。
        <br> ※举例：投注方案：和值1 开奖号码前两位：01或10(顺序不限，不含对子号)，即中前二组选。 </p>
      <p><strong>◎前三组选&gt;&gt;组选包胆 </strong><br> 从0-9号码中任意选取一个胆码，开奖号码前二位各不相同(不含对子号)，投注号码与开奖号码前二位中任意一位相同，即为中奖。
        <br> ※举例：投注方案：包胆8 开奖号码：前二位 8×，且×不等于8，即中前二组选。</p>

      <hr>
      <h4><strong>【定位胆玩法】</strong></h4>
      <p><strong>◎定位胆&gt;&gt;直选复式 </strong><br> 从万、千、百、十、个位中至少选择1个号码组成一注，每注由一个号码组成，所选号码与相同位置上的开奖号码一致，即为中奖。
        <br> ※举例：投注方案：万位1 开奖号码：万位1，即中定位胆万位。</p>


      <hr>
      <h4><strong>【不定位玩法】</strong></h4>
      <p><strong>◎三星&gt;&gt;前三一码 </strong><br> 从0-9中任意选择1个以上号码，每组由一个号码组成，只要开奖号码万、千、百位中包含所选号码，即为中奖。（同个号码出现多次只计一次中奖）
        <br> ※举例：投注方案：1 开奖号码：前三位，至少出现1个1，即中前三一码不定位。</p>
      <p><strong>◎三星&gt;&gt;前三二码 </strong><br> 从0-9中至少 选择2个以上号码，每组由2个号码组成，只要开奖号码万、千、百位中同时包含所选的2个号码，即为中奖。（同个号码出现多次只计一次中奖）<br>      ※举例：投注方案：12
      <br>开奖号码：前三位，至少出现1和2各一个，即中前三二码不定位。
      </p>
      <p><strong>◎三星&gt;&gt;后三一码 </strong><br> 从0-9中任意选择1个以上号码，每组由一个号码组成，只要开奖号码百、十、个位中包含所选号码，即为中奖。（同个号码出现多次只计一次中奖） <br> ※举例：投注方案：1
        <br>开奖号码：后三位至少出现1个1，即中后三一码不定位。
      </p>
      <p><strong>◎三星&gt;&gt;后三二码 </strong><br> 从0-9中至少 选择2个以上号码，每组由2个号码组成，只要开奖号码百、十、个位中同时包含所选的2个号码，即为中奖。（同个号码出现多次只计一次中奖）<br>      ※举例：投注方案：12
        <br>开奖号码：后三位至少出现1和2各一个，即中后三二码不定位。
      </p>
      <p><strong>◎四星&gt;&gt;前四一码 </strong><br> 从0-9中任意选择1个以上号码，每组由一个号码组成，只要开奖号码万、千、百、十位中包含所选号码，即为中奖。（同个号码出现多次只计一次中奖）
        <br> ※举例：投注方案：1 开奖号码：前四位至少出现1个1，即中前四不定位。</p>
      <p><strong>◎四星&gt;&gt;前四二码 </strong><br> 从0-9中至少选择2个以上号码，每组由2个号码组成，只要开奖号码万、千、百、十位中同时包含所选的2个号码，即为中奖。（同个号码出现多次只计一次中奖）
        <br> ※举例：投注方案：12 开奖号码：前四位至少出现1和2各一个，即中前四二码不定位。</p>
      <p><strong>◎四星&gt;&gt;后四一码 </strong><br> 从0-9中任意选择1个以上号码，每组由一个号码组成，只要开奖号码千、百、十、个位中包含所选号码，即为中奖。（同个号码出现多次只计一次中奖）
        <br> ※举例：投注方案：1 开奖号码：后四位至少出现1个1，即中后四不定位。</p>
      <p><strong>◎四星&gt;&gt;后四二码 </strong><br> 从0-9中至少选择2个以上号码，每组由2个号码组成，只要开奖号码千、百、十、个位中同时包含所选的2个号码，即为中奖。（同个号码出现多次只计一次中奖）
        <br> ※举例：投注方案：12 开奖号码：后四位至少出现1和2各一个，即中后四二码不定位。</p>
      <p><strong>◎五星&gt;&gt;五星一码 </strong><br> 从0-9中任意选择1个以上号码，每组由一个号码组成，只要开奖号码中包含所选号码，即为中奖。（同个号码出现多次只计一次中奖）
        <br> ※举例：投注方案：1 开奖号码：至少出现1个1，即中五星不定位。</p>
      <p><strong>◎五星&gt;&gt;五星二码 </strong><br> 从0-9中至少选择2个以上号码，每组由2个号码组成，只要开奖号码中同时包含所选的2个号码，即为中奖。（同个号码出现多次只计一次中奖）
        <br> ※举例：投注方案：12 开奖号码：至少出现1和2各一个，即中五星二码不定位。</p>
      <p><strong>◎五星&gt;&gt;五星三码 </strong><br> 从0-9中至少选择3个以上号码，每组由3个号码组成，只要开奖号码中同时包含所选的3个号码，即为中奖。（同个号码出现多次只计一次中奖）
        <br> ※举例：投注方案：123 开奖号码：至少出现1和2及3各一个，即中五星三码不定位。</p>


      <hr>
      <h4><strong>【大小单双玩法】</strong></h4>
      <p><strong>◎大小单双&gt;&gt;前二大小单双 </strong><br> 对万、千位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。
        <br> ※举例：投注方案：小双 开奖号码：万、千位“小、双”，即中前二大小单双。</p>
      <p><strong>◎大小单双&gt;&gt;后二大小单双 </strong><br> 对十位和个位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。
        <br> ※举例：投注方案：大单 开奖号码：十、个位“大单”，即中后二大小单双。</p>
      <p><strong>◎大小单双&gt;&gt;前三大小单双 </strong><br> 对万、千和百位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。
        <br> ※举例：投注方案：小双小 开奖号码：万、千、百位“小双小”，即中前三大小单双。</p>
      <p><strong>◎大小单双&gt;&gt;后三大小单双 </strong><br> 对百、十和个位的“大（56789）小（01234）、单（13579）双（02468）”形态进行购买，所选号码的位置、形态与开奖号码的位置、形态相同，即为中奖。
        <br> ※举例：投注方案：大单大 开奖号码：百、十、个位“大单大”，即中后三大小单双。</p>


      <hr>
      <h4><strong>【任选二玩法】</strong></h4>
      <p><strong>◎任二直选&gt;&gt;直选复式 </strong><br> 从万、千、百、十、个位中至少选择两个位置，至少各选1个号码组成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：万位5，百位8 开奖号码：51812，即中任二直选。</p>
      <p><strong>◎任二直选&gt;&gt;直选单式 </strong><br> 从万、千、百、十、个位中至少选择两个位置,至少手动输入一个两位数的号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：位置选择万、百位，输入号码58 开奖号码：51812，即中任二直选(单式)。</p>
      <p><strong>◎任二直选&gt;&gt;直选和值 </strong><br> 从万、千、百、十、个位中至少选择两个位置,至少选择一个和值号码构成一注，所选两个位置的开奖号码相加之和与所选和值一致，即为中奖。
        <br> ※举例：投注方案：位置选择万、百位，选择和值号码13 开奖号码：51812，即中任二直选和值。</p>
      <p><strong>◎任二组选&gt;&gt;组选复式 </strong><br> 从万、千、百、十、个位中至少选择两个位置,至少选择两个号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：位置选择万、百位，选择号码85 开奖号码：51812或者81512，即中任二组选。</p>
      <p><strong>◎任二组选&gt;&gt;组选单式 </strong><br> 从万、千、百、十、个位中至少选择两个位置,至少手动输入一个两位数的号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：位置选择万、百位，输入号码85 开奖号码：51812或者81512，即中任二组选(单式)。</p>
      <p><strong>◎任二组选&gt;&gt;组选和值 </strong><br> 从万、千、百、十、个位中至少选择两个位置,至少选择一个和值号码构成一注，所选两个位置的开奖号码相加之和与所选和值一致(不含对子号)，即为中奖。
        <br> ※举例：投注方案：位置选择万、百位，选择和值号码13 开奖号码：51812，即中任二组选和值。</p>

      <hr>
      <h4><strong>【任选三玩法】</strong></h4>
      <p><strong>◎任三直选&gt;&gt;直选复式 </strong><br> 从万、千、百、十、个位中至少选择三个位置，至少各选1个号码组成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：万位5，百位8,个位2 开奖号码：51812，即中任三直选。</p>
      <p><strong>◎任三直选&gt;&gt;直选单式 </strong><br> 从万、千、百、十、个位中至少选择三个位置,至少手动输入一个三位数的号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：位置选择万、百,个位，输入号码582 开奖号码：51812，即中任三直选(单式)。</p>
      <p><strong>◎任三直选&gt;&gt;直选和值 </strong><br> 从万、千、百、十、个位中至少选择三个位置,至少选择一个和值号码构成一注，所选三个位置的开奖号码相加之和与所选和值一致，即为中奖。
        <br> ※举例：投注方案：位置选择万、百、个位，选择和值号码15 开奖号码：51812，即中任三直选和值。</p>
      <p><strong>◎任三组选&gt;&gt;组三复式 </strong><br> 从万、千、百、十、个位中至少选择三个位置,至少选择两个号码构成两注，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：位置选择万、十、个位,选择号码12 开奖号码：11812，即中任三组三。</p>
      <p><strong>◎任三组选&gt;&gt;组三单式 </strong><br> 从万、千、百、十、个位中至少选择三个位置,至少手动输入三个号码构成一注，三个数字中必须有二个数字相同，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。
        <br> ※举例： 投注方案：位置选择万、十、个位,输入号码112 开奖号码：11812，即中任三组三(单式)。</p>
      <p><strong>◎任三组选&gt;&gt;组六复式 </strong><br> 从万、千、百、十、个位中至少选择三个位置,至少选择三个号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：投注方案：位置选择万、十、个位,选择号码512 开奖号码：51812，即中任三组六。</p>
      <p><strong>◎任三组选&gt;&gt;组六单式 </strong><br> 从万、千、百、十、个位中至少选择三个位置,至少手动输入三个号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：位置选择万、十、个位,输入号码512 开奖号码：51812，即中任三组六(单式)。</p>
      <p><strong>◎任三组选&gt;&gt;混合组选 </strong><br> 从万、千、百、十、个位中至少选择三个位置,至少手动输入三个号码构成一注(不含豹子号)，开奖号码指定位置的号码为组三或组六形态，所选号码与开奖号码指定位置上的号码相同，且顺序不限，即为中奖。
        <br> ※举例：投注方案：选择位置万、十、个位，输入号码001以及512 开奖号码：03410(指定位置号码顺序不限)即中任三组三；或者51812(指定位置号码顺序不限)即中任三组六。</p>
      <p><strong>◎任三组选&gt;&gt;组选和值 </strong><br> 从万、千、百、十、个位中至少选择三个位置,至少选择一个和值号码构成一注，所选三个位置的开奖号码相加之和与所选和值一致(不包含豹子号)，即为中奖。
        <br> ※举例：投注方案：位置选择万、十、个位,选择和值号码8 开奖号码：51812，即中任三组选和值。</p>

      <hr>
      <h4><strong>【任选四玩法】</strong></h4>
      <p><strong>◎任四直选&gt;&gt;直选复式 </strong><br> 从万、千、百、十、个位中至少选择四个位置，至少各选1个号码组成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：万位5，千位1,百位8,十位1 开奖号码：51812，即中任四直选。</p>
      <p><strong>◎任四直选&gt;&gt;直选单式 </strong><br> 从万、千、百、十、个位中至少选择四个位置,至少手动输入一个四位数的号码构成一注，所选号码与开奖号码的指定位置上的号码相同，且顺序一致，即为中奖。
        <br> ※举例：投注方案：位置选择万位、千位、百位、十位，输入号码5181 开奖号码：51812，即中任四直选(单式)。</p>
      <p><strong>◎任四组选&gt;&gt;组选24 </strong><br> 从万、千、百、十、个位中至少选择四个位置,号码区至少选择四个号码构成一注，所选号码与开奖号码指定位置上的号码相同，顺序不限，且开奖号码没有重复，即为中奖。
        <br> ※举例：投注方案：位置选择千、百、十、个位,号码选择0568 开奖号码：10568(指定位置号码顺序不限且没有重复)，即可中任四组选24。</p>
      <p><strong>◎任四组选&gt;&gt;组选12 </strong><br> 从万、千、百、十、个位中至少选择四个位置,从“二重号”中至少选择一个号码，“单号”中至少选择两个号码组成一注，所选号码与开奖号码指定位置上的号码相同，且所选的二重号码在开奖号码指定位置中出现2次，顺序不限，即为中奖。
        <br> ※举例：投注方案：位置选择千、百、十、个位,二重号：8；单号：06 开奖号码：10688(指定位置号码顺序不限)，即可中任四组选12。</p>
      <p><strong>◎任四组选&gt;&gt;组选6 </strong><br> 从万、千、百、十、个位中至少选择四个位置,从“二重号”中至少选择两个号码组成一注，所选号码与开奖号码指定位置上的号码相同，且所选的2个二重号码在开奖号码指定位置中分别出现了2次，顺序不限，即为中奖。
        <br> ※举例：投注方案：位置选择千、百、十、个位,二重号：28 开奖号码：12288(指定位置号码顺序不限)，即可中任四组选6。</p>
      <p><strong>◎任四组选&gt;&gt;组选4 </strong><br> 从万、千、百、十、个位中至少选择四个位置,从“三重号”中至少选择一个号码，“单号”中至少选择一个号码组成一注，所选号码与开奖号码指定位置上的号码相同，且所选三重号码在在开奖号码指定位置中出现3次，顺序不限，即为中奖。
        <br> ※举例：投注方案：位置选择千、百、十、个位,三重号：8；单号：2 开奖号码：18828(指定位置号码顺序不限)，即可中任四组选4。</p>
    </div>
    <div class="help_col" :class="{'show': tabIdx == 2}">
      <h5><strong>总则</strong></h5>
      <p>
        template(v-if="/(YF|QQ|QIQU|HENEI)SSC/.test(data.alias)")
          | 开奖时间：每天1440期，00:00-23:59（1分钟一期）
        template(v-else-if="/(JND|ELS|BHD|GG)SSC/.test(data.alias)")
          | 开奖时间：每天960期，00:00-23:59（1.5分钟一期）
        template(v-else-if="/(EF|GX)SSC/.test(data.alias)")
          | 开奖时间：每天720期，00:00-23:58（2分钟一期）
        template(v-else-if="/SFSSC/.test(data.alias)")
          | 开奖时间：每天420期，09:03-次日06:00（3分钟一期）
        template(v-else-if="/(WF|FC|TT)SSC/.test(data.alias)")
          | 开奖时间：每天288期，00:00-23:55（5分钟一期）
        template(v-else-if="/SHFSSC/.test(data.alias)")
          | 开奖时间：每天144期，00:00-24:00（10分钟一期）；
        template(v-else-if="/CQSSC/.test(data.alias)")
          | 开奖时间：每天59期，00:28-03:08（20分钟一期，共9期）07:28-23:48（20分钟一期，共50期）
        template(v-else-if="/XJSSC/.test(data.alias)")
          | 开奖时间：每天48期，10:18-02:18（20分钟一期）
        template(v-else-if="/TJSSC/.test(data.alias)")
          | 开奖时间：每天42期，09:18-22:58（20分钟一期）
        template(v-else-if="/AZXY5SSC/.test(data.alias)")
          | 开奖时间：每天开奖288期，全天24小时销售，每5分钟1期
        template(v-else-if="/WF179SSC/.test(data.alias)")
          | 开奖时间：09:05~23:55，五分钟一期，179期/日
        <br> 开奖号码：开奖结果为5个号码；
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rules_SSC',
  props: ['data'],
  data() {
    return {
      tabs: ['传统玩法', '官方玩法', '游戏说明'],
      tabIdx: 0,
    };
  },
};
</script>
