/**
 * 网站留言管理相关api
 */


import axios from "./../utils/axios";

//用户留言状态
export const typeStatus = {
    SUBMIT:0,//刚提交未回访
    REPLY:1 //已回访
}

//留言提交
export  function addMsg(options){
    return axios({
        url: "/webMsg/addMsg",
        method: "POST",
        data:options
    })
}

// 获取网站留言列表
export function getWebMsgList(options){
    return axios({
        url: "/webMsg/getWebMsgList",
        method: "GET",
        params:options
    })
}

// 更新留言信息状态
export function changeStatus(options){
    return axios({
        url: "/webMsg/changeStatus",
        method: "POST",
        data:options
    })
}

// 删除网站留言信息
export function deleteMsg(options){
    return axios({
        url: "/webMsg/delete",
        method: "GET",
        params:options
    })
}