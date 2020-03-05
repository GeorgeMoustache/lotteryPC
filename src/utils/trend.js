/**
 * init
 * @param  {Number} options.colLen [description]
 * @return {[type]}                [description]
 */
function init({ colLen = 5 }, color) {
  const radius = 10;
  let colorAry = [];
  if (!color) {
    colorAry = ['#11b35e', '#dd5e00'];
  } else {
    colorAry = [color, color];
  }

  let pointAry = [];
  for (let i = 0; i < colLen; i++) {
    pointAry.push([]);
  }

  try {
    var wrap = document.getElementById('chart');
    var table = wrap.getElementsByClassName('chart-table')[0];
    var canvas = document.getElementById('chartCanvas');
    if (canvas == null) {
      canvas = document.createElement('canvas');
      canvas.id = 'chartCanvas';
      wrap.appendChild(canvas);
    }
  } catch (error) {
    return;
  }
  // ! category&limit 不同，宽高也不同
  const width = table.offsetWidth,
    height = table.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  const canvasPosition = getElementPosition(canvas);
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);

  let rowAry = table.getElementsByClassName('ball-row');
  Array.prototype.map.call(rowAry, (parent, i) => {
    let ary = parent.getElementsByClassName('omit-ball');
    Array.prototype.map.call(ary, (el, j) => {
      pointAry[j][i] = getPosition(el);
    });
  });
  for (let i = 0; i < colLen; i++) {
    draw({
      radius: radius,
      color: colorAry[i % 2],
      points: pointAry[i],
      canvas: canvas,
    });
  }
  wrap = null;
  table = null;
  canvas = null;

  function getPosition(el) {
    const position = getElementPosition(el);
    // 获取中间坐标，减去视图的文档坐标
    return {
      x: position.x + radius - canvasPosition.x,
      y: position.y + radius - canvasPosition.y,
    };
  }
}

/**
 * draw canvas line
 * @param  {[type]} options.radius [description]
 * @param  {[type]} options.color  [description]
 * @param  {[type]} options.points [description]
 * @param  {[type]} options.canvas [description]
 * @return {[type]}                [description]
 */
function draw({ radius, color, points, canvas }) {
  let ctx = canvas.getContext('2d');
  ctx.strokeStyle = color;
  let length = points.length;
  points.map((curP, i) => {
    let nextP = points[i + 1];
    if (nextP == null) return;
    ctx.beginPath();
    ctx.moveTo(curP.x, curP.y);
    ctx.lineTo(nextP.x, nextP.y);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.closePath();

    ctx.beginPath();
    let rect = getRect(curP);
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
    ctx.closePath();
  });

  ctx.beginPath();
  let lastObj = getRect(points[length - 1]);
  ctx.clearRect(lastObj.x, lastObj.y, lastObj.w, lastObj.h);
  ctx.closePath();

  function getRect(point) {
    let size = (radius - 3) * 2;
    return {
      x: point.x - radius + 3,
      y: point.y - radius + 3,
      w: size,
      h: size,
    };
  }
}

/**
 * 返回文档坐标
 * @param  {HTMLNodeElement} e [description]
 * @return {[type]}   [description]
 */
function getElementPosition(e) {
  let x = 0,
    y = 0;
  while (e != null) {
    x += e.offsetLeft;
    y += e.offsetTop;
    e = e.offsetParent;
  }
  return {
    x: x,
    y: y,
  };
}

export { init };
