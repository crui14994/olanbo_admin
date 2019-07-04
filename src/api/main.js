import service from "./../utils/axios";

export function mock(paramsObj) {
    return service({
        url: "/api/get7Token",
        method: "get",
        params:paramsObj
    });
}