const mixin = {
  props: {
    category: String,
    modeObj: Object,
    mode: String,
    price: [String, Number],
    betList: Array,
  },
  data() {
    return {
      tplList: [],
    };
  },
  created() {
    this.init();
    this.onBusHandler(); // fix: 首次无法触发 bus
  },
  beforeDestroy() {
    this.offBusHandler();
  },
  methods: {
    onBusHandler() {
      this.$bus.on('updatePrice', this.updatePrice);
      this.$bus.on('resetSelected', this.resetSelected);
      this.$bus.on('validateForm', this.validateForm);
    },
    offBusHandler() {
      this.$bus.off('updatePrice', this.updatePrice);
      this.$bus.off('resetSelected', this.resetSelected);
      this.$bus.off('validateForm', this.validateForm);
    },
    // 选中事件
    handleSelected(event, childIndex, item, itemIndex) {
      //金額空白時點選帶入數字，非空白點選清空
      if (item.price !== '') {
        item.price = '';
      } else {
        item.price = this.price;
      }

      this.tplList[childIndex].values.splice(itemIndex, 1, item);
      this.tplList.splice(childIndex, 1, this.tplList[childIndex]);
    },
    // 金额更新，同步更新选中内容
    updatePrice(value) {
      this.tplList = this.tplList.map(child => {
        child.values = child.values.map(item => {
          if (item.activeCls) item.price = value;
          return item;
        });
        return child;
      });
    },
    // 重置
    resetSelected() {
      this.tplList = this.tplList.map(child => {
        child.values = child.values.map(item => {
          item.price = '';
          item.activeCls = false;
          return item;
        });
        return child;
      });
    },
    validateForm([minCost, maxCost]) {
      let betList = [];
      this.tplList.forEach(child => {
        child.values.forEach(item => {
          if (item.price) {
            item.subModeLabel = child.label;
            item.mode = child.alias;
            betList.push(item);
          }
        });
      });

      if (betList.length === 0) {
        this.$Notice.warning({
          title: '系统提示',
          desc: '请至少选择一注投注号码',
        });
        return;
      }

      // 如果金额范围错误，则返回消息
      const isFail = betList.some(item => {
        const { price, subModeLabel, label } = item;
        let msg = '';

        if (price < minCost) {
          msg = `最小金额为${minCost}元`;
        } else if (price > maxCost) {
          msg = `最大金额为${maxCost}元`;
        }

        if (msg) this.notice(msg, 'warning');

        return msg;
      });
      if (isFail) return;

      this.$emit('update:betList', betList);
      this.$parent.betModal = true;
    },
    formatPrice() {},
  },
  watch: {
    category() {
      this.betList.splice(0);
      this.init();
    },
    mode: 'init',
    betList(curVal) {
      if (!curVal.length) this.resetSelected();
    },
  },
};

export default mixin;
