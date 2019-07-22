/**
 * 设备/智能产品相关api
 */

import axios from "./../utils/axios";

//配置查询条件的额页码和每一页要显示的
export const devPage = {
    PAGENUM:1,//分页当前页码
    PAGESIZE:5 //分页查询中每页返回的总条数
}

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

//删除设备
export function deleteSmart(options){
    return axios({
        url: "/api/web/devs/delete",
        method: "GET",
        params:options
    })
}
