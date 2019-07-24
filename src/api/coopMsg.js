/**
 * 网站留言管理相关api
 */


import axios from "./../utils/axios";

//合作申请状态
export const typeStatus = {
    SUBMIT: 0,//提交
    REPLY: 1, //审核通过
    REFUSED_TO: 2 //审核不通过
}


//提交申请信息
export function addMsg(options) {
    return axios({
        url: "/coopMsg/addMsg",
        method: "POST",
        data: options
    })
}

//获取申请信息列表
export function getcoopMsgList(options) {
    return axios({
        url: "/coopMsg/getList",
        method: "GET",
        params: options
    })
}

//修改申请信息状态
export function changeStatus(options) {
    return axios({
        url: "/coopMsg/changeStatus",
        method: "POST",
        data:options
    })
}

//删除申请信息
export function deleteCoopMsg(options) {
    return axios({
        url: "/coopMsg/delete",
        method: "GET",
        params:options
    })
}