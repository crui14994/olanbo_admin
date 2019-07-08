import service from "./../utils/axios";

export function qiniu(paramsObj) {
    return service({
        url: "/api/get7Token",
        method: "get",
        params:paramsObj
    });
}