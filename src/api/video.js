import axios from "./../utils/axios";

//添加视频
export function addHomeVideo(userId,url) {
    return axios.post("/api/addHomeVideo",{
        userId,
        url
    })
}

//获取视频
export function getHomeVideo() {
    return axios.get("/api/getHomeVideo")
}

//更新视频
export function updateHomeVideo(userId, id , url , key){
    return axios.post("/api/updateHomeVideo",{
        userId, id , url , key
    })
}