// 公用
const common = [
  [
    {
      value: 'reverse',
      label: '反向',
    },
    {
      value: 'empty',
      label: '全删',
    },
  ],
  [
    {
      value: 'td',
      label: '合大',
    },
    {
      value: 'ts',
      label: '合小',
    },
    {
      value: 'to',
      label: '合单',
    },
    {
      value: 'te',
      label: '合双',
    },
  ],
  [
    {
      value: 'dd',
      label: '大单',
    },
    {
      value: 'ds',
      label: '大双',
    },
    {
      value: 'so',
      label: '小单',
    },
    {
      value: 'se',
      label: '小双',
    },
  ],
  [
    {
      value: 'sd',
      label: '尾大',
    },
    {
      value: 'ss',
      label: '尾小',
    },
  ],
];

// 大小单双
const dxds = [
  [
    {
      value: 'd',
      label: '大',
    },
    {
      value: 's',
      label: '小',
    },
    {
      value: 'o',
      label: '单',
    },
    {
      value: 'e',
      label: '双',
    },
  ],
];

// 色波
const sb = [
  [
    {
      value: 'r',
      label: '红波',
    },
    {
      value: 'b',
      label: '蓝波',
    },
    {
      value: 'g',
      label: '绿波',
    },
  ],
  [
    {
      value: 'rb',
      label: '红大',
    },
    {
      value: 'rs',
      label: '红小',
    },
    {
      value: 'ro',
      label: '红单',
    },
    {
      value: 're',
      label: '红双',
    },
  ],
  [
    {
      value: 'bb',
      label: '蓝大',
    },
    {
      value: 'bs',
      label: '蓝小',
    },
    {
      value: 'bo',
      label: '蓝单',
    },
    {
      value: 'be',
      label: '蓝双',
    },
  ],
  [
    {
      value: 'gb',
      label: '绿大',
    },
    {
      value: 'gs',
      label: '绿小',
    },
    {
      value: 'go',
      label: '绿单',
    },
    {
      value: 'ge',
      label: '绿双',
    },
  ],
];

// 生肖
const sx = [
  [
    {
      value: 'anm01',
      label: '鼠',
    },
    {
      value: 'anm02',
      label: '牛',
    },
    {
      value: 'anm03',
      label: '虎',
    },
    {
      value: 'anm04',
      label: '兔',
    },
  ],
  [
    {
      value: 'anm05',
      label: '龙',
    },
    {
      value: 'anm06',
      label: '蛇',
    },
    {
      value: 'anm07',
      label: '马',
    },
    {
      value: 'anm08',
      label: '羊',
    },
  ],
  [
    {
      value: 'anm09',
      label: '猴',
    },
    {
      value: 'anm10',
      label: '鸡',
    },
    {
      value: 'anm11',
      label: '狗',
    },
    {
      value: 'anm12',
      label: '猪',
    },
  ],
  [
    {
      value: 'front_anm',
      label: '前肖',
    },
    {
      value: 'back_anm',
      label: '后肖',
    },
    {
      value: 'sky_anm',
      label: '天肖',
    },
    {
      value: 'land_anm',
      label: '地肖',
    },
  ],
  [
    {
      value: 'beast_anm',
      label: '野兽',
    },
    {
      value: 'poultry_anm',
      label: '家禽',
    },
  ],
];

// 头尾数
const tws = [
  [
    {
      value: 'td0',
      label: '0头',
    },
    {
      value: 'td1',
      label: '1头',
    },
    {
      value: 'td2',
      label: '2头',
    },
    {
      value: 'td3',
      label: '3头',
    },
    {
      value: 'td4',
      label: '4头',
    },
  ],
  [
    {
      value: 'sd0',
      label: '0尾',
    },
    {
      value: 'sd1',
      label: '1尾',
    },
    {
      value: 'sd2',
      label: '2尾',
    },
    {
      value: 'sd3',
      label: '3尾',
    },
    {
      value: 'sd4',
      label: '4尾',
    },
  ],
  [
    {
      value: 'sd5',
      label: '5尾',
    },
    {
      value: 'sd6',
      label: '6尾',
    },
    {
      value: 'sd7',
      label: '7尾',
    },
    {
      value: 'sd8',
      label: '8尾',
    },
    {
      value: 'sd9',
      label: '9尾',
    },
  ],
];

export default { common, dxds, sb, sx, tws };
