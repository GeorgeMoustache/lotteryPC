import { mapGetters } from 'vuex';

const mixins = {
  inject: ['ivNotice'],
  computed: {
    ...mapGetters(['appConfig']),
    costRange() {
      let { costRange = [1, 50000] } = this.appConfig;
      return costRange;
    },
    priceMaxLength() {
      let { costRange } = this;
      return costRange ? costRange[1].toString().length : 5;
    },
  },
  methods: {
    /**
     * 校验金额
     *
     * @param {String} value 要校验的内容
     * @returns {Boolean} 是否通过
     */
    checkPrice(value) {
      if (value == null) {
        console.error('请设置 checkPrice 的参数');
      }

      const reg = /^\d+(\.\d{1,3})?$/;
      let msg = '';

      if (value == '' || value == 0) {
        msg = '请输入金额';
      } else if (!reg.test(value)) {
        msg = '请输入正确的金额格式！';
      } else {
        const [minCost, maxCost] = this.costRange;
        if (value < minCost) {
          msg = `最小金额为${minCost}元`;
        }
        if (value > maxCost) {
          msg = `最大金额为${maxCost}元`;
        }
      }

      if (msg) this.ivNotice('warning', msg);

      return !msg; // 是否通过
    },
  },
};

export default mixins;
