import { asyncRouterMap } from '@/router/route';

function getNowRouter(asyncRouterMap, to) {
    return asyncRouterMap.some(route => {
      // console.log(asyncRouterMap);
      if (to.path.indexOf(route.path) !== -1) {
        return true;
      } else if (route.children && route.children.length) { //如果有孩子就遍历孩子
        return getNowRouter(route.children, to)
      }
    })
  }

  const permission = {
    state: {
      siderbar_routers: [],
    },
    mutations: {
      SET_NOW_ROUTERS: (state, to) => {
        // 递归访问 accessedRouters，找到包含to 的那个路由对象，设置给siderbar_routers
        asyncRouterMap.forEach(e => {
          if (e.children && e.children.length) {
            if (getNowRouter(e.children, to) === true)
              state.siderbar_routers = e;
          }
        })
      }
    },
    actions: {
      getNowRoutes({ commit }, data) {
        return new Promise(resolve => {
          //data => to
          commit('SET_NOW_ROUTERS', data);
          resolve();
        })
      },
    }
  };
  
  export default permission;
  