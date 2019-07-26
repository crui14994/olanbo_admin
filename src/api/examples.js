/**
 * 成功案例相关api
 */

import axios from "./../utils/axios";


//案例状态
export const STATUS = {
    RECOMMEND_NO: 0 ,
    RECOMMEND:1
}


//获取案例列表
export function getList(options) {
    return axios({
        url: "/web/examples/getList",
        method: "GET",
        params:options
    })
}
//新增案例
export function addItem(options) {
    return axios({
        url: "/web/examples/addItem",
        method: "POST",
        data:options
    })
}

// 修改案例信息
export function update(options) {
    return axios({
        url: "/web/examples/update",
        method: "POST",
        data:options
    })
}

//删除案例
export function deleteItem(options){
    return axios({
        url: "/web/examples/delete",
        method: "GET",
        params:options
    })
}

//增加案例类型
export function addItemType(options){
    return axios({
        url:"/web/exampleType/addItem",
        method: "POST",
        data:options
    })
}

//获取案列类型列表
export function getListType(){
    return axios({
        url:"/web/exampleType/getList",
        method: "GET"
    })
}


// 获取案例详情
export function getItemInfo(id){
    return axios({
        url:"/web/examples/getItemInfo",
        method: "GET",
        params:{
            id
        }
    })
}