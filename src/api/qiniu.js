import axios from "./../utils/axios";
//获取token
export function getToken(paramsObj) {
    return axios({
        url: "/api/get7Token",
        method: "get",
        params:paramsObj
    });
}
