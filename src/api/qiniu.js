import axios from "./../utils/axios";

//定义七牛参数
export const QINIU_PARAMS = {
    domain:"https://upload.qiniup.com", //七牛云的上传地址，根据自己所在地区选择
    qiniuaddr:"static.olanboa.com" //七牛云空间的外链默认域名
}

//获取token
export function getToken(paramsObj) {
    return axios({
        url: "/get7Token",
        method: "get",
        params:paramsObj
    });
}

//上传到七牛
export function uploadQiniu(domain,formdata,config){
    return axios.post(domain,formdata,config)
}