import axios from "./../utils/axios";

//用户类型
export const userType ={
    ADMIIN:{
        type:1,
        typeName:"超级管理员"
    },
    USER:{
        type:2,
        typeName:"普通用户"
    },
    SERVICE:{
        type:3,
        typeName:"运营人员"
    },
    SELLER:{
        type:4,
        typeName:"销售人员"
    },
    AGENT:{
        type:5,
        typeName:"代理商"
    }
    ,
    SALER:{
        type:6,
        typeName:"销售商"
    },
    SMARTDEV:{
        type:7,
        typeName:"智能家居控制端(APP)"
    }
}

// 登陆
export function userLogin(userName,mobile,passWord){
    return axios.post("/user/login",{
        userName,mobile,passWord
    })
}

//注册
export function userRegist(smsCode,userName,nickName,mobile,passWord){
    return axios.post("/user/regist",{
        smsCode,userName,nickName,mobile,passWord
    })
}
//修改
// export function updateInfo(){
//     return axios.post("/user/updateInfo",{

//     })
// }