import { constantRouterMap, asyncRouterMap } from '@/router';

/**
 * 通过meta.roles判断当前是否与用户权限匹配
 * @param {String} userRoles
 * @param {Object} route
 */
function hasPermission(userRoles, route) {
  if (route.meta && route.meta.roles) {
    return ~route.meta.roles.indexOf(userRoles);
  }
  return true;
}

/**
 * 递归过滤异步路由表，返回符合用户权限的路由表
 * @param {Array} asyncRouterMap
 * @param {String} userRoles // (Array || String)
 */
function filterAsyncRouter(asyncRouterMap, userRoles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(userRoles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, userRoles);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    generateRoutes({ commit }, data) {
      console.log('generateRoutes', data);
      return new Promise(resolve => {
        // typeof roles == 'string'
        const { roles } = data;
        let accessedRouters = [];
        // 代理身份拥有所有权限
        if (~roles.indexOf('agent')) {
          accessedRouters = asyncRouterMap;
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
        }

        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });

    }
  }
};

export default permission;
