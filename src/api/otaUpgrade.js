/**
 * 设备OTA升级
 */

import axios from "./../utils/axios";

const baseUrl = "http://192.168.101.129:8888"
//配置条件
export const managerConfig = {
    PAGENUM:1,//分页当前页码
    PAGESIZE:5 //分页查询中每页返回的总条数
}

//获取设备类型
export function getOtaType(){
    return axios({
        url: baseUrl+"/smart/devType/list",
        method: "GET"
    })
}



//获取列表
export function managerList(options) {
    return axios({
        url: baseUrl+"/smart/ota/list",
        method: "GET",
        params: options
    })
}

//添加
export  function addManager(options){
    return axios({
        url: baseUrl+"/smart/ota/add",
        method: "POST",
        data:options
    })
}

// 更新
export  function updateManager(options){
    return axios({
        url: baseUrl+"/smart/ota/update",
        method: "POST",
        data:options
    })
}

//获取md5地址
export function getMd5(url){
    return axios({
        url: url+"?hash/md5",
        method: "GET"
    })
}