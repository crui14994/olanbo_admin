/**
 * 设备OTA升级
 */

import axios from "./../utils/axios";


//配置条件
export const managerConfig = {
    PAGENUM: 1,//分页当前页码
    PAGESIZE: 5 //分页查询中每页返回的总条数
}

//获取设备类型
export function getOtaType() {
    return axios({
        url: "/smart/devType/list",
        method: "GET"
    })
}


//获取列表
export function managerList(options) {
    return axios({
        url: "/smart/ota/list",
        method: "GET",
        params: options
    })
}

//添加
export function addManager(options) {
    return axios({
        url: "/smart/ota/add",
        method: "POST",
        data: options
    })
}

// 更新
export function updateManager(options) {
    return axios({
        url: "/smart/ota/update",
        method: "POST",
        data: options
    })
}

//获取md5地址
export function getMd5(url) {
    return axios({
        url: url + "?hash/md5",
        method: "GET"
    })
}

// 获取用户设备列表
export function userDevsList(options) {
    return axios({
        url:"web/userDevs/list",
        method: "GET",
        params: options
    })
}
//发送OTA升级信息
export function otaPush(options) {
    return axios({
        url: "/smart/ota/push",
        method: "GET",
        params: options
    })
}