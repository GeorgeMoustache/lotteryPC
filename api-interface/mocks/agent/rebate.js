/**
 * 代理中心-返点
 *
 * @url agent/rebate.action
 *
 */

module.exports = () => {
  return {
    code: 0,
    msg: '',
    list: [
      {
        id: 1,
        label: '快3',
        maxPoint: '7.5',
        minPoint: '0.0',
        point: '7.5'
      },
      {
        id: 2,
        label: '时时彩',
        maxPoint: '8.0', // Int
        minPoint: '0.0', // Int
        point: '8.0' // Int
      },
      {
        id: 3,
        label: '11选5',
        maxPoint: '7.5',
        minPoint: '0.0',
        point: '7.5'
      },
      {
        id: 4,
        label: '福彩3D',
        maxPoint: '7.5',
        minPoint: '0.0',
        point: '7.5'
      },
      {
        id: 5,
        label: '排列3',
        maxPoint: '7.5',
        minPoint: '0.0',
        point: '7.5'
      },
      {
        id: 6,
        label: 'PK10',
        maxPoint: '8.0',
        minPoint: '0.0',
        point: '8.0'
      },
      {
        id: 7,
        label: '六合彩',
        maxPoint: '10.0',
        minPoint: '0.0',
        point: '10.0'
      }
    ]
  };
};
