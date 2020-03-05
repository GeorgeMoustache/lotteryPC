const path = require("path");
const express = require("express");
const mockjs = require("express-mockjs");

// req.body for 'POST'
let bodyParser = require("body-parser");
let multer = require("multer");

const port = 8151;
let app = express();

app.all('*', (req, res, next) => {
  const time = new Date().Format("HH:mm:ss")
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')

  if (req.method == "OPTIONS") {
    res.send(200);
  } else {
    setTimeout(next, 0)
  }
});

app.use(bodyParser.json()); // for parsing application/json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); 

app.use("/api", mockjs(path.join(__dirname, "mocks")));

const server = app.listen(port);
server.on("listening", () => {
  console.log(`Listening on http://localhost:${port}/api`);
});

Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
