import axios from "./../utils/axios";

// 登陆
export function userLogin(userName,mobile,passWord){
    return axios.post("/api/user/login",{
        userName,mobile,passWord
    })
}

//注册
export function userRegist(smsCode,userName,nickName,mobile,passWord){
    return axios.post("/api/user/regist",{
        smsCode,userName,nickName,mobile,passWord
    })
}