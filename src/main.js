import Vue from 'vue';
import App from './App';
import Router from 'vue-router';
import store from './store';
import createWebSocket from 'utils/wsLottery';
import dateHelper from 'utils/dateHelper';
import iView from 'iview';
import VueBus from 'vue-bus';
import scroll from 'vue-seamless-scroll';
import * as filters from './filters';
import mixin from 'utils/mixins';
import { lotteryApi } from 'api';
import VueClipboards from 'vue-clipboards';
import 'babel-polyfill'; //專案環境需使用 babel-polyfill 打包編譯避免 ie 畫面空白的問題
import VueCookie from 'vue-cookie';
//客製化捲軸樣式
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import '@/style/iview_core.less'; //iview 核心樣式
import '@/style/themeMix/main.scss'; //themeMix 樣式
import '@/style/themeBoMao/main.scss'; //themeBoMao 樣式

Vue.use(iView);
Vue.use(VueClipboards);
Vue.use(VueBus);
Vue.use(scroll, { componentName: 'scroll-seamless' });
Vue.use(VueCookie);
Vue.use(iView);
Vue.use(Router);
Vue.use(PerfectScrollbar);
Vue.prototype.createWebSocket = createWebSocket;

let router = new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
      };
    }
  },
  routes: [],
});

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

// 获取应用配置
async function getConfig() {
  let result = await store.dispatch('appConfig').then(data => {
    const { code, wsHost, themeName = 'theme1' } = data;
    if (code != 0) return iView.Message.error({ content: '获取数据失败,请刷新页面' });
    createWebSocket(wsHost);

    //依 themeName 套用 router
    let routerName = '';
    let themeMixGroup = ['theme1', 'theme2', 'theme3', 'theme4'];

    if (themeMixGroup.includes(themeName)) {
      routerName = 'themeMix';
    } else {
      routerName = 'themeBoMao';
    }

    const { routerMap } = require(`./router/${routerName}`);
    router.addRoutes(routerMap);
    return routerMap;
  });
  return result;
}

Vue.prototype.notice = function(msg, type) {
  iView.Message[type](msg);
};

function log() {
  if (__DEV__ && console && console.log) {
    let args = Array.prototype.slice.call(arguments);
    args.unshift('[PC]:');
    console.log.apply(console, args);
  }
}
window.log = log;

// 获取数据失败,请刷新页面

let cacheRoles = {};
let routerMap = null;
// 路由拦截
router.beforeEach((to, from, next) => {
  if (routerMap == null) {
    routerMap = getConfig();
    next();
    return;
  }

  iView.LoadingBar.start();
  let needRoles = getRoles(to, cacheRoles);

  // 免登录白名单，直接进入
  if (needRoles.length === 0) return next();

  // 用户的角色
  let { role } = store.getters;
  if (role === '') {
    store.dispatch('accountInfo').then(value => {
      role = value;
      hasPermission();
    });
  } else {
    hasPermission();
  }
  function hasPermission() {
    // 未登录,全部重定向到登录页
    let params;
    if (role === 'visitor' || role === '') {
      params = { path: '/login', replace: true };
    } else if (to.path === '/login') {
      params = { path: '/' };
    } else if (role === 'guest' && needRoles.indexOf('guest') == -1) {
      // 试玩账号权限判断
      iView.Message.warning({
        content: '抱歉，试玩账号不能进行此操作',
      });
      // 直接访问 => 404
      params = from.path === '/' ? '/404' : false;
    } else if (needRoles.indexOf(role) == -1) {
      // 权限判断
      params = '/404';
    }
    if (params) {
      next(params);
      iView.LoadingBar.finish();
    } else {
      next();
    }
  }
});

/**
 * 获取路由的访问权限
 * @param {Object} router.to
 * @param {Object} cache
 * @returns {Array}
 */
function getRoles({ meta, matched, path }, cache) {
  if (cache[path]) return cache[path];
  let roles = [];
  if (meta.roles) {
    roles = meta.roles || [];
  } else {
    for (let el of matched) {
      if (el.meta && el.meta.roles) {
        roles = el.meta.roles;
      } else if (el.parent && el.parent.meta && el.parent.meta.roles) {
        roles = el.parent.meta.roles;
      }
      if (roles.length) break;
    }
  }
  cache[path] = roles;
  return roles;
}

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
});

/* eslint-disable no-new */
const VUE = new Vue({
  el: '#app',
  router,
  store,
  mixins: [mixin],
  render: h => h(App),
});
