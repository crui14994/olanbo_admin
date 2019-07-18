/**
 * 设备/智能产品相关api
 */

import axios from "./../utils/axios";

//获取设备列表
export function smartList(options) {
    return axios({
        url: "/api/web/devs/smartList",
        method: "GET",
        params:options
    })
}

//添加设备
export function addSmart(options) {
    return axios.post("/api/web/devs/addSmart", options);
}

//更新设备
export function updateSmart(options) {
    return axios.post("/api/web/devs/updateSmart", options);
}
