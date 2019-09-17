/**
 * app升级管理
 */

import axios from "./../utils/axios";


//配置条件
export const managerConfig = {
    PAGENUM:1,//分页当前页码
    PAGESIZE:5 //分页查询中每页返回的总条数
}


//获取列表
export function managerList(options) {
    return axios({
        url: "/app/manager/list",
        method: "GET",
        params: options
    })
}

//添加
export  function addManager(options){
    return axios({
        url: "/app/manager/add",
        method: "POST",
        data:options
    })
}

// 更新
export  function updateManager(options){
    return axios({
        url: "/app/manager/update",
        method: "POST",
        data:options
    })
}