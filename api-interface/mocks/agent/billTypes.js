/**
 * 代理中心-交易明细-主類與摘要選項
 *
 * @url agent/billTypes.action
 * 
 */

module.exports = (query) => {
  return {
    code: "0",
    msg: "",
    list: [
      {
        type: 1,
        label: "交易明細",
        subList: [
          {
            type: 0,
            label: "全部"
          },
          {
            type: 1,
            label: "充值"
          },
          {
            type: 2,
            label: "提款"
          },
          {
            type: 5,
            label: "退回"
          },
          {
            type: 6,
            label: "赠送彩金"
          },
          {
            type: 7,
            label: "返佣"
          },
          {
            type: 8,
            label: "提款失败"
          },
          {
            type: 9,
            label: "人工加款"
          },
          {
            type: 10,
            label: "其他扣款"
          },
          {
            type: 13,
            label: "派奖回滚"
          },
          {
            type: 14,
            label: "代理返点"
          },
          {
            type: 17,
            label: "入款误存扣款"
          },
          {
            type: 18,
            label: "活动返水"
          },
          {
            type: 19,
            label: "活动返水回滚"
          },
          {
            type: 20,
            label: "晋级奖励"
          },
          {
            type: 21,
            label: "银行转账优惠"
          },
          {
            type: 30,
            label: "额度转入"
          },
          {
            type: 31,
            label: "额度转出"
          }
        ]
      },
      {
        type: 2,
        label: "充值记录",
        subList: [
          {
            type: -1,
            label: "全部"
          },
          {
            type: 0,
            label: "未处理"
          },
          {
            type: 1,
            label: "成功到账"
          },
          {
            type: 2,
            label: "充值失败"
          },
          {
            type: 3,
            label: "处理中"
          },
          {
            type: 4,
            label: "已过期"
          }
        ]
      },
      {
        type: 3,
        label: "提现记录",
        subList: [
          {
            type: -1,
            label: "全部"
          },
          {
            type: 0,
            label: "申请中"
          },
          {
            type: 1,
            label: "锁定中"
          },
          {
            type: 2,
            label: "提现成功"
          },
          {
            type: 3,
            label: "提现失败"
          },
          {
            type: 4,
            label: "已过期"
          },
          {
            type: 5,
            label: "后台删除"
          }
        ]
      }
    ]
  }
};