<template lang="pug">
.layout-footer(:class="{theme4: appConfig.themeName == 'theme4'}")
  .wrap
    ul.links
      li
        h3 平台优势
        p.check(v-for="(item, index) in 4" :key="item" v-text="['账户安全', '购彩简单', '领奖方便', '提款快速'][index]") 
      li(v-for="(item, index) in list" :key="index")
        h3(v-text="['账户相关', '充值购彩', '兑奖提款'][index]")
        p(v-for="(child, idx) in item" :key="idx")
          router-link( :to="{path: `/helpInfo#help-${child.id}`}" v-text="child.title")
    ul.special
      li(v-for="(item, index) in 5" :key="item")
        a(v-text="['网路警察举报平台', '公共信息网路安全监察', '网上交易保障中心', '网站信用良好 Credit Rating', '可信网站身份验证'][index]")
    .copyright
      p 郑重提示：彩票有风险，投注需谨慎！ 不向未满18周岁的青少年出售彩票
      p Copyright&copy; {{appConfig.AppName}} Reserved V.{{appConfig.buildVersion}}
      p 建议使用分辨率：1280以上
      p 建议使用浏览器为:
        span.qq
        span.c360
        span.uc
        span.sogo
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters } from 'vuex';

export default {
  name: 'LayoutFooter',
  data () {
    return {
      list: [
        [{title: "如何注册账号", id: 1}, {title: "怎么找回登录密码", id: 3}, {title: "如何修改手机号码", id: 37}, {title: "如何修改真实姓名", id: 26}],
        [{title: "如何进行充值", id: "tit3"}, {title: "如何购买彩票", id: "tit4"}, {title: "如何查询购彩记录", id: 9}, {title: "充值没到账怎么办", id: "tit3"}],
        [{title: "怎样进行兑奖", id: 10}, {title: "如何进行提款", id: 12}, {title: "提款是否收手续费", id: 13}, {title: "提款不成功怎么办", id: 16}]
		  ],
    }
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
    })
  }
}
</script>

<style lang="scss" scoped>
.layout-footer {
  padding: 16px 0 27px 0;
  background: #d4d4d4;
  font-size: 12px;
  color: #64656a;
  .wrap {
    width: 880px;
    margin: 0 auto;
  }
  &.theme4 {
    background: #262732;
    color: #FFF;
    .links {
      li {
        h3::before {
          display: none;
        }
        a {
          color: #FFF;
        }
        p.check::before {
          display: none;
        }
      }
    }
  }
}

.links {
  display: flex;
  justify-content: space-between;
  h3 {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: normal;
    &::before {
      content: "";
      display: block;
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }
  li:nth-child(1) h3::before {
    background: url('~assets/themeMix/footer-advantage.svg')
  }
  li:nth-child(2) h3::before {
    background: url('~assets/themeMix/footer-account.svg')
  }
  li:nth-child(3) h3::before {
    background: url('~assets/themeMix/footer-recharge.svg')
  }
  li:nth-child(4) h3::before {
    background: url('~assets/themeMix/footer-withdrawal.svg')
  }
  p {
    margin-bottom: 5px;
  }
  p.check {
    display: flex;
    align-items: center;
    &::before {
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      margin-right: 5px;
      background: url('~assets/themeMix/footer-checkbox.svg') center center no-repeat;
      background-size: 100% auto;
    }
  }
  a {
    display: inline-block;
    
    color: #64656a;
    &:hover {
      color: #ea721a;
    }
  }
}

.special {
  display: flex;
  width: 710px;
  margin: 46px auto 30px auto;
  text-align: center;
  @for $i from 1 through 5 {
    $top: #{($i - 1) * - 47px};
    li:nth-child(#{$i}) a {
      display: inline-block;
      margin: 0 12px;
      width: 120px;
      height: 45px;
      background-image: url('~assets/themeMix/footer-symblo.png');
      background-position-x: left;
      background-position-y: $top;
      text-indent: -9999px;
    }
  }
}

.copyright {
  text-align: center;
  p {
    margin-bottom: 3px;
  }  
  span {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-left: 3px;
    background-image: url('~assets/themeMix/footer-browser.png');
    background-position-y: top;
    vertical-align: middle;
    &.qq {
      background-position-x: 0;
    }
    &.c360 {
      background-position-x: -30px;
    }
    &.uc {
      background-position-x: -60px;
    }
    &.sogo {
      background-position-x: -90px;
    }
  }
}
</style>
