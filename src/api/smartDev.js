/**
 * 智能家居控制端(APP)用户管理相关api
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


//更新信息
export function updateInfo(options){
    return axios({
        url: "/user/updateInfo",
        method: "POST",
        data:options
    })
}

