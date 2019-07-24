import { userLogin } from "@/api/user.js";

const types = {
    SET_ISLOGIN: 'SET_ISLOGIN', //用户是否登录
    SET_USERID: 'SET_USERID', // 用户id
    SET_USERNAME: 'SET_USERNAME', // 用户信息
    SET_NICKNAME: 'SET_NICKNAME', // 用户昵称
    SET_USERTYPE: 'SET_USERTYPE', // 用户类型
    SET_SMARTSYSTYPE: 'SET_SMARTSYSTYPE' //获取到的设备类型
}

const state = {
    isLogin: JSON.parse(sessionStorage.getItem(types.SET_ISLOGIN)) || false, //用户是否登录
    userId: JSON.parse(sessionStorage.getItem(types.SET_USERID)) || "",  // 用户id
    userName: JSON.parse(sessionStorage.getItem(types.SET_USERNAME)) || "",//用户登录名
    nickName: JSON.parse(sessionStorage.getItem(types.SET_NICKNAME)) || "",//用户昵称
    userType: JSON.parse(sessionStorage.getItem(types.SET_USERTYPE)) || "", //用户类型
    smartSysType: JSON.parse(sessionStorage.getItem(types.SET_SMARTSYSTYPE)) || "" //设备类型
};
const getters = {
   
};
const mutations = {
    [types.SET_ISLOGIN](state, isLogin) {
        state.isLogin = isLogin;
    },
    [types.SET_USERID](state, userId) {
        state.userId = userId;
    },
    [types.SET_USERNAME](state, userName) {
        state.userName = userName;
    },
    [types.SET_NICKNAME](state, nickName) {
        state.nickName = nickName;
    },
    [types.SET_USERTYPE](state, userType) {
        state.userType = userType;
    },
    [types.SET_SMARTSYSTYPE](state, smartSysType) {
        state.smartSysType = smartSysType;
    },
};

const actions = {
    //登录
    login: ({ commit }, userInfo) => {
        const { userName, mobile, passWord } = userInfo;
        return new Promise((resolve, reject) => {
            userLogin(userName, mobile, passWord).then(res => {
                const { data } = res.data;
                // 存储数据
                if (res.data.code == 200) {
                    commit(types.SET_ISLOGIN, true);
                    commit(types.SET_USERID, data.userId);
                    commit(types.SET_USERNAME, data.userName);
                    commit(types.SET_NICKNAME, data.nickName);
                    commit(types.SET_USERTYPE, data.userType);
                    commit(types.SET_SMARTSYSTYPE, data.smartSysType);
                    sessionStorage.setItem(types.SET_ISLOGIN, JSON.stringify(true));
                    sessionStorage.setItem(types.SET_USERID, JSON.stringify(data.userId));
                    sessionStorage.setItem(types.SET_USERNAME, JSON.stringify(data.userName));
                    sessionStorage.setItem(types.SET_NICKNAME, JSON.stringify(data.nickName));
                    sessionStorage.setItem(types.SET_USERTYPE, JSON.stringify(data.userType));
                    sessionStorage.setItem(types.SET_SMARTSYSTYPE, JSON.stringify(data.smartSysType));
                }
                resolve(res.data);
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 退出
    signOut: ({ commit , state}) => {
        return new Promise((resolve, reject) => {
            commit(types.SET_ISLOGIN, false);
            sessionStorage.clear();
            resolve();
        })
    }
}

export default {
    state,
    mutations,
    actions,
    getters
};