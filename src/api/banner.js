/**
 * 首页banner相关api
 */


import axios from "./../utils/axios";

//添加banner
export function addBanner(linkUrl, userId, pcDataUrl, mobileDataUrl, bannerTitle) {
    return axios.post("/addBanner", {
        linkUrl, userId, pcDataUrl, mobileDataUrl,type:1, bannerTitle
    });
}
//获取banner列表
export function bannerList() {
    return axios({
        url: "/web/bannerList",
        method: "GET"
    })
}
//更新单条banner信息
export function updateBanner(options) {
    return axios({
        url: "/web/updateBanner",
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
        url: "/web/deleteBanner",
        method: "POST",
        data: {
            userId,id,keys
        }
    })
}