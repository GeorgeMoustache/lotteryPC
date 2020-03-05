import { chatApi } from '@/api';

const mixins = {
  computed: {
    // lottery数据加载完成
    isReady() {
      let { alias } = this.info;
      return alias != null;
    },
    isStopSales: {
      get() {
        let { lotteryInfo = {} } = this; // fix: pk10,ssc官方玩法
        let { curIssue = '' } = Object.assign({}, lotteryInfo, this.info);
        curIssue = '' + curIssue;
        return !curIssue.length; // 是否暂停销售
      },
      set(value) {
        return value;
      },
    },
  },
  methods: {
    // 删除全部
    onEmpty() {
      if (!this.cartList.length) return;
      this.$Modal.confirm({
        title: '温馨提示',
        content: '是否清空确认区中所有投注内容？',
        onOk: () => {
          this.emptyCart();
        },
      });
    },
    /**
     *  分享注單 
     *  191119 kyle 從5大投注模板剝離，維護一份分享注單的行為
     *  日後整合刪除
     */
    shareBet() {
      chatApi.shareBet({form: this.form}).then(data => {
        switch (data.code) {
          case '0':
            this.$Notice.success({
              title: '系统提示',
              desc: '成功分享注单至聊天室'
            })
            break;
          case '-1':
            this.$Notice.error({
              title: '系统提示',
              desc: '分享注单失败'
            })  
            break;
          default:
            this.$Notice.error({
              title: '系统提示',
              desc: data.msg
            })
            break;
        }

        this.betList.splice(0);
        this.emptyCart();
        this.formatChaseList.splice(0)
      })
    },
  },
};
export default mixins;
