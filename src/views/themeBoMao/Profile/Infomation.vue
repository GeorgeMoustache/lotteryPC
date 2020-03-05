<template lang="pug">
#information
  .page-tabs
    router-link(:to="{path: '/profile/information'}") 个人中心
    router-link(:to="{path: '/profile/password'}") 安全中心
    router-link(:to="{path: '/profile/bankCard'}") 银行卡管理
  .wrap
    a.back(v-if="gradeTableEnabled" @click="gradeTableEnabled = false") 返回
    .user-info
      .info
        img.avatar(:src="accountInfo.headImg")
        .rank
          .user-level(:class="'user-level' + curGrade.grade")
            i {{curGrade.grade}}
            | {{curGrade.gradeName}}
          .user-label.user-label2(v-if="accountInfo.isCommissioner")
            | 计划专员
      .grade(v-if="gradeList.length")
        Progress(:percent="gradePercent" :stroke-width="20" hide-info)
        p VIP等级:
          span {{curGrade.gradeName}}
          | ({{gradeData.userGradeGrow}} / {{nextGrade.gradeGrow}})
        p 再获得 
          span {{nextGrade.gradeGrow-gradeData.userGradeGrow}} 
          | 成长值即可升级
          a.grade-explain(v-if="!gradeTableEnabled" @click="gradeTableEnabled = true") 如何升級
    Form.list(ref="form" :model="form" :rules="rules" label-position="right" :label-width="100" v-if="!gradeTableEnabled")
      FormItem(label="会员账号：") 
        Input(v-model="accountInfo.username" disabled)
      FormItem(v-for="item in columnList" :key="item.code" :prop="item.code != 'realName' ? item.code : ''" :label="item.title + '：'")
        Input(v-model="form[item.code]" :placeholder="holder[item.code] && holder[item.code].holderReg" :disabled="item.code == 'realName'")
    .buttons(v-if="!gradeTableEnabled")
      Button.submit(@click="handleSubmit('form')") 提交
      Button.reset(@click="infoReset('form')") 取消
    .grade-table(v-if="gradeTableEnabled")
      .title 等级积分说明
      table
        thead
          tr
            td 等级
            td 积分
        tbody
          tr(v-for="item in gradeList" :key="item.grade")
            td 
              .user-level(:class="'user-level' + item.grade")
                i {{item.grade}}
                | {{appConfig.webChat.ranks[item.grade - 1]}}
            td {{item.gradeGrow}}
</template>

<script>
import { ACCOUNT } from '@/store/mutation-types';
import { mapGetters, mapActions } from 'vuex';
import { accountApi } from "api";
import mixin from '@/utils/Register_Login/regRules_mixin';

export default {
  name: 'ProfileInformation',
  mixins: [mixin],
  inject: ['ivNotice', 'reload'],
  data() {
    return {
      //用戶等級
      gradePercent: 0,
      curGrade: {},
      nextGrade: {},
      maxLevel: false,
      gradeTableEnabled: false,

      form: {},
      columnList: [], // 註冊顯示欄位list
    }
  },
  computed: {
    ...mapGetters({
      appConfig: "appConfig",
      accountInfo: ACCOUNT.ACCOUNTINFO,
      gradeData: "gradeData"
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
          this.gradePercent = 100
          userGradeGrow = ''
        } else {
          this.gradePercent = Math.min((userGradeGrow / nextGrade.gradeGrow) * 100, 100);
        }
        const el = document.querySelector(".ivu-progress-bg");
        if (el) el.innerHTML = userGradeGrow;
      });
      return list;
    },
  },
  created() {
    this.fetchSysPromotion();
    this.columnList = this.accountInfo.list;
    this.processRules();
  },
  methods: {
    ...mapActions(['fetchSysPromotion']),
    //根據api有打到的項目取得validate基本配置
    processRules() {
      this.columnList.forEach((item, index) => {
        //處理rules
        const isRequired = item.isRequired;
        this.rules[item.code][0].required = isRequired;

        //處理placeholder說明
        let reg = this.holder[item.code].holderReg;
        this.holder[item.code].holderReg = reg.replace('{isRequired}', isRequired === true ? ',必填' : '');

        //動態處理form欄位
        this.$set(this.form, item.code, item.value);
      });
    },
    //更新會員資料
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        accountApi.updateUserInfo(this.form).then(data => {
          let { code, msg } = data;
          if (code != 0) {
            this.ivNotice('error', msg);
          } else {
            this.ivNotice('success', msg);
            this.$store.dispatch("accountInfo").then(data => {
              this.reload();
            })
          }
        })
      });
    },
    //重置會員資料
    infoReset(name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>