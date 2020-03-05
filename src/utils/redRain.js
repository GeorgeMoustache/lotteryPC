var container;

var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
var animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';

function animationInit(nums) {
  container = document.getElementById('app') || document.body;
  for (var i = 0; i < nums; i++) {
    createALeaf(i);
  }
}
function update(i) {
  var div = document.getElementById(`leaf_${i}`);
  div && div.parentNode && div.parentNode.removeChild(div);
  div = null;
  createALeaf(i);
}

function randomInteger(low, high) {
  return low + Math.floor(Math.random() * (high - low));
}

function randomFloat(low, high) {
  return low + Math.random() * (high - low);
}

function pixelValue(value) {
  return value + 'px';
}

function durationValue(value) {
  return value + 's';
}

function createALeaf(i) {
  var image = document.createElement('i');
  image.className = `redPacet`;
  var size = randomInteger(80, 150) / 100;
  image.style.webkitTransform = `scale(${size})`;
  image.style.transform = `scale(${size})`;

  var leafDiv = document.createElement('div');
  leafDiv.className = 'leaf';
  leafDiv.id = `leaf_${i}`;

  // TODO: 位置
  leafDiv.style.top = pixelValue(randomInteger(-200, -100));
  leafDiv.style.left = pixelValue(randomInteger(0, 1920));

  leafDiv.style.webkitAnimationName = 'fade, drop';
  leafDiv.style.animationName = 'fade, drop';

  /* 随机下落时间 */
  var fadeAndDropDuration = durationValue(randomFloat(2, 10));
  leafDiv.style.webkitAnimationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;
  leafDiv.style.animationDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;

  // 随机delay时间
  var leafDelay = durationValue(randomFloat(0, 2));
  leafDiv.style.webkitAnimationDelay = leafDelay + ', ' + leafDelay;
  leafDiv.style.animationDelay = leafDelay + ', ' + leafDelay;

  leafDiv.appendChild(image);
  container.appendChild(leafDiv);

  leafDiv.addEventListener(
    animationEndEvent,
    function() {
      update(i);
    },
    false
  );
}

export default animationInit;
