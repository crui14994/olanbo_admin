/**
 * 首页视频相关api
 */

import axios from "./../utils/axios";

//添加视频
export function addHomeVideo(userId,url) {
    return axios.post("/addHomeVideo",{
        userId,
        url
    })
}

//获取视频
export function getHomeVideo() {
    return axios.get("/getHomeVideo")
}

//更新视频
export function updateHomeVideo(userId, id , url , key){
    return axios.post("/updateHomeVideo",{
        userId, id , url , key
    })
}