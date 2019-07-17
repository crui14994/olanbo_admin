import { userLogin } from "@/api/user.js";

const types = {
    SET_ISLOGIN: 'SET_ISLOGIN', //用户是否登录
    SET_USERID: 'SET_USERID', // 用户id
    SET_USERNAME: 'SET_USERNAME', // 用户信息
    SET_NICKNAME: 'SET_NICKNAME', // 用户昵称
    SET_USERTYPE: 'SET_USERTYPE' // 用户类型
}

const state = {
    isLogin: false, //用户是否登录
    userId: "b2b94188a3d56deb3031bd4c11221fa6",  // 用户id
    userName: "",//用户登录名
    nickName: "",//用户昵称
    userType: null, //用户类型
    smartSysType: [
        { icon: "aaaaaaaaaaa", id: 1, status: 0, timeStamp: 0, typeName: "aaaaaaaa" },
        { icon: "", id: 2, status: 0, timeStamp: 0, typeName: "智能家电" },
        { icon: "", id: 3, status: 0, timeStamp: 0, typeName: "智能控制" },
        { icon: "", id: 4, status: 0, timeStamp: 0, typeName: "test" }
    ]
};
// const getters = {
//     isLogin(state){

//         if (!state.isLogin) {   
//             //从sessionStorage中读取状态 
//             state.isLogin=localStorage.getItem(types.SET_ISLOGIN);   
//             state.userId=localStorage.getItem(types.SET_USERID);
//             state.userName=localStorage.getItem(types.SET_USERNAME);
//             state.nickName=localStorage.getItem(types.SET_NICKNAME);
//             state.userType=localStorage.getItem(types.SET_USERTYPE);

//         }
//         return state
//     }
// };
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
                    localStorage.setItem(types.SET_ISLOGIN, JSON.stringify(true));
                    localStorage.setItem(types.SET_USERID, JSON.stringify(data.userId));
                    localStorage.setItem(types.SET_USERNAME, JSON.stringify(data.userName));
                    localStorage.setItem(types.SET_NICKNAME, JSON.stringify(data.nickName));
                    localStorage.setItem(types.SET_USERTYPE, JSON.stringify(data.userType));
                }
                resolve(res.data);
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 退出
    signOut: ({ commit }) => {
        return new Promise((resolve, reject) => {
            commit(types.SET_ISLOGIN, false);
            localStorage.removeItem(types.SET_ISLOGIN);
            localStorage.removeItem(types.SET_USERID);
            localStorage.removeItem(types.SET_USERNAME);
            localStorage.removeItem(types.SET_NICKNAME);
            localStorage.removeItem(types.SET_USERTYPE);
        })

    }
}

export default {
    state,
    mutations,
    actions,
    // getters
};