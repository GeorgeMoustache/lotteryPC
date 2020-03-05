import store from '@/store';
import { WS } from '@/store/mutation-types';

let ws; //websocket实例
let lockReconnect = false; //避免重复连接
let URL = '';

window.addEventListener('unload', () => ws && ws.close && ws.close());

function createWebSocket(url) {
  // 如果构建过一次，不再构建
  if (url && createWebSocket.isCreated) return;
  if (url) {
    createWebSocket.isCreated = true;
    URL = url;
  }
  // 停止
  if (url === null) {
    heartCheck.reset();
    ws.close();
    ws = null;
    return;
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
    if (ws === null) return;
    // log('[webSocket onclose2]: ', event.data);
    reconnect();
  };
  ws.onerror = function() {
    // log('[webSocket onerror2]: ', event.data);
    reconnect();
  };
  ws.onopen = function() {
    // log('[webSocket onopen2]: ', event.data);
    //心跳检测重置
    heartCheck.reset().start();
  };
  ws.onmessage = function({ data }) {
    // {"code":0,"errorMsg":"ok","message":{"content":"0","from":"-1","type":"heart_beat"}}
    let msg;
    try {
      msg = JSON.parse(data);
    } catch (ex) {
      log('ws', ex);
    }
    if (msg && msg.code == 0 && msg.message && msg.message.type != 'heart_beat') {
      store.commit(WS.CHAT_MESSAGE, data);
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
  timeout: 30e3,
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
      ws.send('{"message":{"content":' + new Date().getTime() + ',"type":"heart_beat"}}');
      self.serverTimeoutObj = setTimeout(function() {
        //如果超过一定时间还没重置，说明后端主动断开了
        ws.close(); //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, self.timeout);
    }, this.timeout);
  },
};
export { createWebSocket as createWebSocketChat };
