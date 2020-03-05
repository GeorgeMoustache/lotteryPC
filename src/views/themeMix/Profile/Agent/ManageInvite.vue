<template lang="pug">
.manage-invite
  Form(ref="form", :model="form", :label-width="120")
    FormItem(label="开户类型：")
      RadioGroup(v-model="form.userType" type="button")
        Radio(label=1) 代理
        Radio(label=0) 玩家
    p.tip
      b 返点设置：请先为下级设置返点。
      a(@click="$root.openWindow({path: '/rebateDes/0'}, 'rebate')" target="_blank") 点击查看返点赔率表
    .main
      FormItem(
        v-for="(item, index) in list",
        :key="index",
        :label="item.label",
        :prop="'points.' + item.id",
        :rules="{required: true, message: '返点不能为空'}"
        )
        Input.form-width-sm(
          v-model="form.points[item.id]",
          @on-blur="onBlur(item.id, item, $event.target)"
          )
        span.help(v-text="`（自身返点${item.point}，可为下级设置返点范围${item.minPoint}-${item.maxPoint}）`")
    FormItem
      Button(type="primary", :loading="loading" @click="handleSubmit('form')") 生成邀请码
  Alert(type="warning")
    h3 ※ 温馨提示：
    p 1、不同的返点赔率不同，返点越高赔率越高。
    p 2、代理可获得的佣金等于代理自身返点与下级返点的差值，如代理自身返点6，下级返点4，代理可获得下级投注金额的2%，即下级下注100元，代理可获得2元。
    p 3、下级返点值设得越低，下级的赔率就越低，建议给下级设置的返点不要过低。
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { agentApi } from 'api';

export default {
  name: 'ManageInvite',
  data() {
    return {
      form: {
        userType: '1',
        points: {}
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters(['agentRebate']),
    list() {
      let list = this.agentRebate;
      let obj = {};
      list.forEach(item => {
        obj[item.id] = void 0;
      });
      this.form.points = obj;
      return list;
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    ...mapActions({
      fetchData: 'fetchAgentRebate'
    }),
    onBlur(id, item, target) {
      let { value } = target;
      let { minPoint, maxPoint } = item;
      if (/^\d{1,2}(.\d)?$/.test(value)) {
        value = parseFloat(value).toFixed(1);
      }
      if (isNaN(value) || value == '') {
        value = '';
      } else if (value - minPoint < 0) {
        value = minPoint; // Number x String !!!
      } else if (value - maxPoint > 0) {
        value = maxPoint;
      }
      value = value == '' ? value : parseFloat(value).toFixed(1);
      target.value = value;
      this.form.points[id] = value;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) this.submit();
      });
    },
    submit() {
      this.loading = true;
      agentApi.setInviteUrl(this.form).then(data => {
        if (data.code != 0) return this.notice(data.msg || '设置失败', 'warning');
        this.modal = true;
        this.$Modal.info({
          title: '温馨提示',
          content: '邀请码已生成，请点击邀请码管理进行查询',
          onOk: ()=> {
            this.$router.push({ path: '/profile/agent/manageIcode' });
          }
        })
      });
    },
    notice(msg, type) {
      this.$Message[type](msg);
    }
  }
};
</script>

<style lang="scss">
.manage-invite {
  // .ivu-form-item-label {
  // 	font-size: 18px;
  // }
  .tip {
    margin-bottom: 20px;
  }
  .ivu-alert-message {
    h3 {
      font-size: 13px;
    }
    line-height: 2;
  }
  .main {
    margin-bottom: 20px;
    padding-top: 20px;
    border-top: 1px dotted #e8e8e8;
    border-bottom: 1px dotted #e8e8e8;
  }
}
</style>
