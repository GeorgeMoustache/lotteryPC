/**
 * 获取生肖五行
 */
export default function getSxwxData() {
  var ReferenceYear = 1924; //甲子年
  var GanZhi = [
    ['金', '鼠'],
    ['金', '牛'],
    ['火', '虎'],
    ['火', '兔'],
    ['木', '龙'],
    ['木', '蛇'],
    ['土', '马'],
    ['土', '羊'],
    ['金', '猴'],
    ['金', '鸡'],
    ['火', '狗'],
    ['火', '猪'],

    ['水', '鼠'],
    ['水', '牛'],
    ['土', '虎'],
    ['土', '兔'],
    ['金', '龙'],
    ['金', '蛇'],
    ['木', '马'],
    ['木', '羊'],
    ['水', '猴'],
    ['水', '鸡'],
    ['土', '狗'],
    ['土', '猪'],

    ['火', '鼠'],
    ['火', '牛'],
    ['木', '虎'],
    ['木', '兔'],
    ['水', '龙'],
    ['水', '蛇'],
    ['金', '马'],
    ['金', '羊'],
    ['火', '猴'],
    ['火', '鸡'],
    ['木', '狗'],
    ['木', '猪'],

    ['土', '鼠'],
    ['土', '牛'],
    ['金', '虎'],
    ['金', '兔'],
    ['火', '龙'],
    ['火', '蛇'],
    ['水', '马'],
    ['水', '羊'],
    ['土', '猴'],
    ['土', '鸡'],
    ['金', '狗'],
    ['金', '猪'],

    ['木', '鼠'],
    ['木', '牛'],
    ['水', '虎'],
    ['水', '兔'],
    ['土', '龙'],
    ['土', '蛇'],
    ['火', '马'],
    ['火', '羊'],
    ['木', '猴'],
    ['木', '鸡'],
    ['水', '狗'],
    ['水', '猪'],
  ];

  var sxwxJson = {};
  var shuArray = new Array();
  var niuArray = new Array();
  var huArray = new Array();
  var tuArray = new Array();
  var longArray = new Array();
  var sheArray = new Array();
  var maArray = new Array();
  var yangArray = new Array();
  var houArray = new Array();
  var jiArray = new Array();
  var gouArray = new Array();
  var zhuArray = new Array();

  var wx_jinArray = new Array();
  var wx_muArray = new Array();
  var wx_shuiArray = new Array();
  var wx_huoArray = new Array();
  var wx_tuArray = new Array();

  //在农历春节之前仍然使用去年的计算方式
  var D = new Date(new Date().setMilliseconds(window.diffTime));
  var basePoint = 0;
  var aryYears = [
    {
      年: 2017,
    },
    {
      年: 2018,
      月: 2,
      日: 16,
    },
    {
      年: 2019,
      月: 2,
      日: 5,
    },
    {
      年: 2020,
      月: 2,
      日: 1,
    },
    {
      年: 2021,
      月: 2,
      日: 12,
    },
    {
      年: 2022,
      月: 2,
      日: 1,
    },
  ];
  var LastYear = D.getFullYear();
  var LastMonth = D.getMonth() + 1;
  var LastDay = D.getDate();

  for (var index = 0; index < aryYears.length; index++) {
    var element = aryYears[index];
    if (LastYear == 2017) {
      basePoint = LastYear - ReferenceYear;
    } else if (parseInt(element['年']) == LastYear) {
      if (parseInt(element['月']) == LastMonth) {
        if (LastDay >= parseInt(element['日'])) {
          basePoint = LastYear - ReferenceYear;
        } else {
          basePoint = LastYear - ReferenceYear - 1;
        }
      } else if (LastMonth < parseInt(element['月'])) {
        basePoint = LastYear - ReferenceYear - 1;
      } else if (LastMonth > parseInt(element['月'])) {
        basePoint = LastYear - ReferenceYear;
      }
    }
  }

  if (basePoint >= 60) {
    basePoint = basePoint - 60;
  }
  //逆序计算五行、生肖
  for (var i = 1; i <= 49; i++) {
    var point;
    if (i <= basePoint + 1) {
      point = basePoint - i + 1;
    } else {
      point = 61 + basePoint - i;
    }
    switch (GanZhi[point][1]) {
      case '鼠':
        shuArray.push(i);
        break;
      case '牛':
        niuArray.push(i);
        break;
      case '虎':
        huArray.push(i);
        break;
      case '兔':
        tuArray.push(i);
        break;
      case '龙':
        longArray.push(i);
        break;
      case '蛇':
        sheArray.push(i);
        break;
      case '马':
        maArray.push(i);
        break;
      case '羊':
        yangArray.push(i);
        break;
      case '猴':
        houArray.push(i);
        break;
      case '鸡':
        jiArray.push(i);
        break;
      case '狗':
        gouArray.push(i);
        break;
      case '猪':
        zhuArray.push(i);
        break;
    }

    switch (GanZhi[point][0]) {
      case '金':
        wx_jinArray.push(i);
        break;
      case '木':
        wx_muArray.push(i);
        break;
      case '水':
        wx_shuiArray.push(i);
        break;
      case '火':
        wx_huoArray.push(i);
        break;
      case '土':
        wx_tuArray.push(i);
        break;
    }
  }
  sxwxJson['鼠'] = shuArray;
  sxwxJson['牛'] = niuArray;
  sxwxJson['虎'] = huArray;
  sxwxJson['兔'] = tuArray;
  sxwxJson['龙'] = longArray;
  sxwxJson['蛇'] = sheArray;
  sxwxJson['马'] = maArray;
  sxwxJson['羊'] = yangArray;
  sxwxJson['猴'] = houArray;
  sxwxJson['鸡'] = jiArray;
  sxwxJson['狗'] = gouArray;
  sxwxJson['猪'] = zhuArray;

  sxwxJson['金'] = wx_jinArray;
  sxwxJson['木'] = wx_muArray;
  sxwxJson['水'] = wx_shuiArray;
  sxwxJson['火'] = wx_huoArray;
  sxwxJson['土'] = wx_tuArray;
  return sxwxJson;
}
