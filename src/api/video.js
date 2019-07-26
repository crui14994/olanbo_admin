/**
 * 首页视频相关api
 */

import axios from "./../utils/axios";

//添加视频
export function addHomeVideo(userId,url) {
    return axios.post("/web/addHomeVideo",{
        userId,
        url
    })
}

//获取视频
export function getHomeVideo() {
    return axios.get("/web/getHomeVideo")
}

//更新视频
export function updateHomeVideo(userId, id , url , key){
    return axios.post("/web/updateHomeVideo",{
        userId, id , url , key
    })
}