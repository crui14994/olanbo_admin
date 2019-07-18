/**
 * 成功案例相关api
 */

import axios from "./../utils/axios";


//获取案例列表
export function getList(options) {
    return axios({
        url: "/api/web/examples/getList",
        method: "GET",
        params:options
    })
}
//新增案例
export function addItem(options) {
    return axios({
        url: "/api/examples/addItem",
        method: "POST",
        data:options
    })
}

// 修改案例信息
export function update(options) {
    return axios({
        url: "/api/web/examples/update",
        method: "POST",
        data:options
    })
}

//删除案例
export function deleteItem(options){
    return axios({
        url: "/api/web/examples/delete",
        method: "GET",
        params:options
    })
}

//增加案例类型
export function addItemType(options){
    return axios({
        url:"/api/exampleType/addItem",
        method: "POST",
        data:options
    })
}

//获取案列类型列表
export function getListType(){
    return axios({
        url:"/api/exampleType/getList",
        method: "GET"
    })
}


// 获取案例详情
export function getItemInfo(){
    return axios({
        url:"/api/web/examples/getItemInfo",
        method: "GET"
    })
}