import store from '@/store';
import { WS, ACCOUNT } from '@/store/mutation-types';

let ws; //websocket实例
let lockReconnect = false; //避免重复连接
let URL = '';

function createWebSocket(host, options = {}) {
  // 重连
  var { isReconnect } = options;
  if (isReconnect && ws && ws.close) {
    heartCheck.reset();
    ws.close(); // 触发 onclose 事件
    return;
  }

  // 获取URL
  if (host) {
    let prefix = ~location.protocol.indexOf('s') ? 'wss' : 'ws';
    if (__DEV__) prefix = 'wss';
    URL = `${prefix}://${host}/websocket/${store.getters[ACCOUNT.CLIENTID]}`;
  }

  try {
    ws = new WebSocket(URL);
    initEventHandle();
  } catch (e) {
    reconnect();
  }
}

function initEventHandle() {
  ws.onclose = function() {
    // log('[webSocket onclose]: ', event.data)
    reconnect();
  };
  ws.onerror = function() {
    // log('[webSocket onerror]: ', event.data)
    reconnect();
  };
  ws.onopen = function() {
    // log('[webSocket onopen]: ', event.data)
    //心跳检测重置
    heartCheck.reset().start();
  };
  ws.onmessage = function({ data }) {
    if (data != 'HeartBeat') {
      try {
        let msg = JSON.parse(data);
        if (msg && msg.code == 0) {
          store.commit(WS.LOTTERY_INFO, msg);
        }
      } catch (ex) {
        // log('ws', ex)
      }
    }
    //如果获取到消息，心跳检测重置
    //拿到任何消息都说明当前连接是正常的
    heartCheck.reset().start();
  };
}

function reconnect() {
  if (lockReconnect) return;
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function() {
    createWebSocket();
    lockReconnect = false;
  }, 2000);
}

//心跳检测
let heartCheck = {
  timeout: 30e3, //60秒
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function() {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function() {
    let self = this;
    this.timeoutObj = setTimeout(function() {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      ws.send('HeartBeat');
      self.serverTimeoutObj = setTimeout(function() {
        //如果超过一定时间还没重置，说明后端主动断开了
        ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, self.timeout);
    }, this.timeout);
  },
};

export default createWebSocket;
