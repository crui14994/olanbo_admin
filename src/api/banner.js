/**
 * 首页banner相关api
 */


import axios from "./../utils/axios";

//添加banner
export function addBanner(linkUrl, userId, pcDataUrl, mobileDataUrl, bannerTitle) {
    return axios.post("/api/addBanner", {
        linkUrl, userId, pcDataUrl, mobileDataUrl,type:1, bannerTitle
    });
}
//获取banner列表
export function bannerList() {
    return axios({
        url: "/api/bannerList",
        method: "GET"
    })
}
//更新单条banner信息
export function updateBanner(options) {
    return axios({
        url: "/api/updateBanner",
        method: "POST",
        data: {
            type: 1,
            ...options
        }
    })
}
//删除banner
export function deleteBanner(userId, id ,keys) {
    return axios({
        url: "/api/deleteBanner",
        method: "POST",
        data: {
            userId,id,keys
        }
    })
}