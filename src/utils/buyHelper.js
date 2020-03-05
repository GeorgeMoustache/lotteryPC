export default function getjwt(form, formatFn) {
  const keys = Object.keys(form);
  let main = keys.map(key => `${key}${JSON.stringify(form[key])}`);
  main = main.join('').replace(/"/g, '');

  const d = new Date();
  const timestamp = Math.round(d / 1000);
  const key = `userlogout${(timestamp + '').substr(-7)}`;
  return { headers: { timestamp, sign: formatFn(key + main + key) } };
}
