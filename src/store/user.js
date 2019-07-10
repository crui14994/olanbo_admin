import { userLogin } from "@/api/user.js";

const types = {
    SET_USERID: 'SET_USERID', // 用户id
    SET_USERNAME: 'SET_USERNAME', // 用户信息
    SET_NICKNAME: 'SET_NICKNAME', // 用户昵称
    SET_USERTYPE: 'SET_USERTYPE' // 用户类型
}

const state = {
    //userId
    userId: "",  // 用户id
    userName: "",//用户登录名
    nickName: "",//用户昵称
    userType: null, //用户类型
};
const mutations = {
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
};

const actions = {
    login: ({ commit }, userInfo) => {
        const { userName,mobile, passWord } = userInfo;
        return new Promise((resolve, reject) => {
            userLogin(userName,mobile, passWord).then(res => {
                const {data} = res.data;
                // 存储数据
                if(res.data.code==200){
                    commit(types.SET_USERID, data.userId);
                    commit(types.SET_USERNAME, data.userName);
                    commit(types.SET_NICKNAME, data.nickName);
                    commit(types.SET_USERTYPE, data.userType);
                }
                resolve();
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    state,
    mutations,
    actions
};