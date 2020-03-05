const convertUnit = function(value) {
  if (value == 0) {
    value = 0;
  } else if (1e4 <= value && value < 1e8) {
    value = value / 1e4 + '万';
  } else if (value >= 1e8) {
    value = value / 1e8;
    if (value < 10) {
      value = value.toFixed(1);
    }
    value = value + '亿';
  }
  return value;
};

export { convertUnit };
