const getters = {
    isLogin: state => state.user.isLogin,
    userId: state => state.user.userId,
    id: state => state.user.id,

    siderBarRouters: state => state.silderBar.siderbar_routers,
  };
  export default getters
  