const names = [
  '[大笑]',
  '[爱你]',
  '[微笑]',
  '[笑哭了]',
  '[挖鼻孔]',
  '[财迷]',
  '[害羞]',
  '[亲亲]',
  '[可爱]',
  '[色迷迷]',
  '[汗]',
  '[鄙视]',
  '[惊讶]',
  '[拜托]',
  '[调皮]',
  '[说错话]',
  '[再见]',
  '[思考]',
  '[快哭了]',
  '[酷]',
  '[疑惑]',
  '[打脸]',
  '[可怜]',
  '[开心]',
  '[不开心]',
  '[嘘]',
  '[怒]',
  '[委屈]',
  '[互粉]',
  '[大怒]',
  '[糗大了]',
  '[抱歉]',
  '[OK]',
  '[合作]',
  '[耶]',
  '[勾引]',
  '[赞]',
  '[加油]',
  '[喜欢]',
  '[心碎了]',
  '[早上好]',
  '[蛋糕]',
  '[礼物]',
  '[干杯]',
  '[神马]',
  '[围观]',
  '[囧]',
  '[熊猫眼]',
  '[打你]',
  '[准时]',
  '[肥皂]',
  '[猪头]',
  '[奥特曼]',
  '[给力]',
  '[威武]',
  '[恭喜]',
  '[鲜花]',
];

const data = names.reduce((map, title, index) => {
  let imgSrc = require(`@/assets/themeMix/emoji/${index + 1}emoji.png`)
  return map.set(title, imgSrc);
}, new Map());

export default data;