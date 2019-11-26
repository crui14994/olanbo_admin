/**
 * 代理商管理相关api
 */

import axios from "./../utils/axios";

//配置条件
export const agentConfig = {
    PAGENUM:1,//分页当前页码
    PAGESIZE:5 //分页查询中每页返回的总条数
}

//获取用户列表
export function getList(options) {
    return axios({
        url: "/user/getList",
        method: "GET",
        params: options
    })
}
//获取appUrl列表数据
export function getappUrlList(options) {
    return axios({
        url: "/web/appUrl/list",
        method: "GET",
        params: options
    })
}


//添加代理商
export function agentRegist(options) {
    return axios({
        url: "/user/regist",
        method: "post",
        data: options
    })
}

//添加跳转地址
export function addUrl(options){
    return axios({
        url: "/web/appUrl/add",
        method: "POST",
        data:options
    })
}

//更新信息
export function updateItemInfo(options){
    return axios({
        url: "/web/appUrl/update",
        method: "POST",
        data:options
    })
}

//获取单条信息
export function getItemInfo(options) {
    return axios({
        url: "/web/appUrl/itemInfo",
        method: "GET",
        params: options
    })
}