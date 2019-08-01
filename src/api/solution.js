/**
 * 解决方案相关api
 */
import axios from "./../utils/axios";


//配置查询条件的额页码和每一页要显示的
export const solutionConfig = {
    STATUS_NO:0, //未推荐状态
    STATUS_OK:1, //已推荐状态
    PAGENUM:1,//分页当前页码
    PAGESIZE:5 //分页查询中每页返回的总条数
}


//添加解决方案
export  function addSolution(options){
    console.log(options)
    return axios({
        url: "/web/solution/add",
        method: "POST",
        data:options
    })
}

// 获取解决方案列表
export function getSolution(options){
    return axios({
        url: "/web/solution/getList",
        method: "GET",
        params:options
    })
}
// 更新解决方案
export  function updateSolution(options){
    return axios({
        url: "/web/solution/update",
        method: "POST",
        data:options
    })
}
//删除解决方案
export function deleteSolution(options){
    return axios({
        url: "/web/solution/delete",
        method: "GET",
        params:options
    })
}

// 添加解决方案类型
export  function addSolutionType(options){
    return axios({
        url: "/web/solutiontype/add",
        method: "POST",
        data:options
    })
}

// 获取解决方案类型列表
export function getSolutionType(){
    return axios({
        url: "/web/solutiontype/getList",
        method: "GET",
    })
}

// 删除解决方案类型
export  function deleteSolutionType(options){
    return axios({
        url: "/web/solutiontype/delete",
        method: "GET",
        data:options
    })
}

// 更新解决方案类型
export  function updateSolutionType(options){
    return axios({
        url: "/web/solutiontype/update",
        method: "POST",
        data:options
    })
}

// 获取案例详情
export  function getItemInfo(id){
    return axios({
        url: "web/solution/getItem",
        method: "GET",
        params:{id}
    })
}