<template lang="pug">
.profile_index
  .model
    .user-info
      h3.model-title 个人信息
      .model-box
        .user-avatar
          img(src="@/assets/themeMix/member-avatar.png")
        ul.user-data
          li 账号：
            span(v-text="accountInfo.username")
          li 等级：VIP{{gradeData.userGrade}}
          li 昵称：{{accountInfo.nickname}}
          li
            router-link.modify(:to="{path: '/profile/info'}")
              icon.text-success(type="gear-a")
              | 修改密码
            router-link.edit(:to="{path: '/profile/Information'}") 编辑个人信息
    .online-reposit
      h3.model-title 在线存/取款
      .model-box
        router-link.user-online(style="border-right:1px solid #e9ecee;" :to="{path: '/profile/deposit'}")
          h4
            span 在线存款
          p.text-gray 支持微信/支付宝等快捷支付
          span.icon.deposit
        router-link.user-online(:to="{path: '/profile/withdraw'}")
          h4
            span 在线取款
          p.text-gray 7x24在线客服审核 3分钟出款
          span.icon.withdraw
  .model(v-if="moneyTransEnabled")
    MoneyTransList
  .model
    .grade-wrap(v-if="gradeList.length")
      h3.model-title 等级积分
      .model-box
        Progress.mb10.grade-percent(:percent="gradePercent" status="wrong" :stroke-width="24" hide-info)
        p.grade-info
          span.text-error.text-left VIP{{curGrade.grade}}({{curGrade.gradeGrow}})
          span.text-center(v-if="!maxLevel") 距离升级VIP{{nextGrade.grade}}还差
            em.text-error {{nextGrade.gradeGrow-gradeData.userGradeGrow}}
            | 分（每{{appConfig.upgradeType}}1元加1分）
            a.grade-explain(@click="modal = true") 等级说明
          span.text-error.text-right(v-text="maxLevel ? '最高等级' : `VIP${nextGrade.grade}(${nextGrade.gradeGrow})`") 
  Modal(v-model="modal" title="等级说明")
    .grade-table-wrap
      table.grade-table
        thead
          tr
            th 等级
            th 所需积分
        tbody
          tr(v-for="item in gradeList" :key="item.grade")
            td VIP{{item.grade}}
            td {{item.gradeGrow}}
      p(slot="footer")
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters, mapActions } from 'vuex';
import MoneyTransList from '@/components/themeMix/Profile/MoneyTransList';

export default {
  name: 'ProfileIndex',
  components: {
    MoneyTransList,
  },
  inject: ['ivNotice'],
  data() {
    return {
      gradePercent: 0,
      curGrade: {},
      nextGrade: {},
      maxLevel: false,
      modal: false,
    };
  },
  computed: {
    ...mapGetters({
      appConfig: 'appConfig',
      accountInfo: ACCOUNT.ACCOUNTINFO,
      gradeData: 'gradeData',
    }),
    gradeList() {
      const { gradeData } = this;
      if (gradeData == null) return [];
      let { list, userGrade, userGradeGrow } = gradeData;
      if (list == null) return [];

      //取得目前等級在等級列表中的位置
      const curIdx = list.findIndex(item => item.grade == userGrade);
      if (curIdx == -1) return [];

      //取得等級相關資訊
      const curGrade = list[curIdx];
      const nextGrade = list[curIdx + 1];
      this.curGrade = list[curIdx];
      this.nextGrade = list[curIdx + 1];

      //判斷等級是否已達最高
      if (curIdx == list.length - 1) {
        this.maxLevel = true;
      }
      //計算百分比
      this.$nextTick(() => {
        if (this.maxLevel) {
          this.gradePercent = 100;
          userGradeGrow = '';
        } else {
          this.gradePercent = Math.min((userGradeGrow / nextGrade.gradeGrow) * 100, 100);
        }
        const el = document.querySelector('.ivu-progress-bg');
        if (el) el.innerHTML = userGradeGrow;
      });
      return list;
    },
    moneyTransEnabled() {
      if (this.$root.thirdPartyTab.length) {
        if (this.accountInfo.type != 3) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  created() {
    this.fetchSysPromotion();
  },
  methods: {
    ...mapActions(['fetchSysPromotion']),
  },
};
</script>

<style lang="scss" scoped>
.model {
  display: flex;
  justify-content: space-between;
  margin-bottom: 35px;
  .model-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 16px;
    color: #495060;
    &::before {
      content: '';
      display: block;
      width: 20px;
      height: 20px;
      margin-right: 13px;
      background-color: #f13131;
      background-position: center center;
      background-repeat: no-repeat;
      border-radius: 50%;
    }
  }
  .model-box {
    background: #fff;
    border-radius: 5px;
  }
}

.user-info {
  width: 520px;
  .model-title::before {
    background-image: url('~assets/themeMix/member-account.png');
    background-size: 10px auto;
  }
  .model-box {
    display: flex;
    padding: 20px;
  }
  .user-avatar {
    margin-right: 15px;
    width: 117px;
    height: 117px;
    border-radius: 8px;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .user-data {
    flex-grow: 1;
    font-size: 14px;
    ul {
      margin: 0;
    }
    li {
      list-style: none;
      margin-bottom: 11px;
      color: #495060;
      a {
        display: inline-flex;
        align-items: center;
        color: #495060;
        &.edit {
          margin-left: 50px;
          &::before {
            content: '';
            display: block;
            width: 15px;
            height: 15px;
            margin-right: 5px;
            background: url('~assets/themeMix/member-edit.svg');
            background-size: 100% auto;
          }
        }
        &:hover {
          color: $primary-color;
        }
        .ivu-icon {
          vertical-align: middle;
          font-size: 20px;
          margin-right: 5px;
        }
      }
    }
  }
}

.online-reposit {
  width: 520px;
  .model-title::before {
    background-image: url('~assets/themeMix/member-title-bank.png');
  }
  .model-box {
    display: flex;
    padding: 7px 15px;
  }
  .user-online {
    width: 50%;
    font-size: 14px;
    color: #495060;
    text-align: center;
    &:hover {
      .icon {
        background-color: #666;
      }
    }
  }
  h4 {
    font-weight: normal;
  }
  p {
    margin: 8px 0 16px 0;
    color: #8d8d8d;
  }
  .icon {
    display: block;
    width: 76px;
    height: 76px;
    margin: 0 auto;
    background-position: center center;
    background-repeat: no-repeat;
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.16);
    &.deposit {
      background-image: url('~assets/themeMix/member-deposit.png');
      background-color: #31a4f1;
      border-radius: 50%;
    }
    &.withdraw {
      background-image: url('~assets/themeMix/member-withdrawal.png');
      background-color: #ff7e56;
      border-radius: 5px;
    }
  }
}

.grade-wrap {
  width: 100%;
  .model-title::before {
    background-image: url('~assets/themeMix/member-title-level.png');
  }
  .model-box {
    padding: 20px;
  }
  .grade-info {
    display: table;
    width: 100%;
    font-size: 14px;
    em {
      font-style: normal;
    }
    & > span {
      display: table-cell;
    }
  }
  .grade-explain {
    color: $info-color;
  }
}
.grade-table-wrap {
  height: 50vh;
  overflow: auto;
  .grade-table {
    th,
    td {
      border: 1px solid #e6e6e6;
      height: 32px;
      text-align: center;
    }
    th {
      background: #f2f7ff;
    }
  }
}
</style>
