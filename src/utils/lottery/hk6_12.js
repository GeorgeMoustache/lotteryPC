import { padLeftZero } from './helper';
import lunar from './lunar';

const TWELVE = (() => {
  const obj = {
    鼠: 10,
    牛: 9,
    虎: 8,
    兔: 7,
    龙: 6,
    蛇: 5,
    马: 4,
    羊: 3,
    猴: 2,
    鸡: 1,
    狗: 12,
    猪: 11,
  };
  let year = 0;
  if (year < 2000) year = lunar.toLunar(new Date()).lunarYear;
  const diff = (year - 2017) % 12;
  let ary = [];
  for (let p in obj) {
    ary.push({
      value: p,
      summary: getVal(obj[p], diff),
    });
  }
  return [ary];

  function getVal(val, diff) {
    let num = (val + diff) % 12;
    num = num ? num : 12;
    let i = 0,
      result = [];
    while (i < 5) {
      let temp = num + i * 12;
      temp <= 49 && result.push(padLeftZero(temp));
      i++;
    }
    return result;
  }
})();
export default TWELVE;
