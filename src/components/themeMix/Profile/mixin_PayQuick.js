import { accountApi } from 'api';

const mixins = {
  methods: {
    init(index) {
      const { accountId, accountNo, accountName, range, needProve, src } = this.list[index];
      this.form = {
        amount: '', // 充值金额
        prove: '', // 凭证
        accountId: accountId,
        accountNo: accountNo,
        accountName: accountName,
        datetime: new Date(),
      };
      let [min, max] = range;
      if (min > max) {
        let temp = min;
        min = max;
        max = temp;
      }
      this.range = [min, max];
      this.needProve = needProve;
      this.src = src;
    },
    formatAmount(value) {
      let formatVal = +String(value).replace(/[^\d.]/g, '');
      if (Number.isNaN(formatVal)) formatVal = 0;
      if (value != formatVal) this.form.amount = formatVal;
    },
    selectChange(value) {
      this.init(value);
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (!valid) return;
        this.handleAjax();
      });
    },
    handleAjax() {
      this.loading = true;
      accountApi.depositQuick(this.form).then(data => {
        if (data.code != 0) {
          return this.notice(data.msg, 'warning');
        }
        this.loading = false;
        this.$Notice.success({
          title: '系统提示',
          desc: data.msg
        });
      });
    },
    notice(msg, type) {
      this.$Message[type](msg);
    },
  },
};

export default mixins;
