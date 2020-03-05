/**
 * 代理中心-代理返点详情
 *
 * @url agent/rebateInfo.action
 *
 * params: inviteCode || userId
 */

module.exports = () => {
  return {
    code: 0,
    msg: "",
    list: [
      {
        label: "时时彩",
        setPoint: "7.0" // Int
      },
      {
        label: "快3",
        setPoint: "7.0"
      },
      {
        label: "11选5",
        setPoint: "7.0"
      },
      {
        label: "福彩3D",
        setPoint: "7.0"
      },
      {
        label: "排列3",
        setPoint: "7.0"
      },
      {
        label: "PK10",
        setPoint: "7.0"
      },
      {
        label: "六合彩",
        setPoint: "7.0"
      }
    ]
  };
};
