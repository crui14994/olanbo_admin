import utils from "@/utils/index"; //导入工具函数

/**
 * 日期过滤器
 * @param {number} time
 */
export function timeFormat(time) {
    return utils.formatDate("YYYY-mm-dd hh:ff:ss", new Date(time));
}

/** 
 * 设备类型
 * @param {number} typeId
 **/
export function gettType(typeId) {
    switch (typeId) {
        case 1:
            return "智能安防"
            break;
        case 2:
            return "智能家电"
            break;
        case 3:
            return "智能控制"
            break;
        case 4:
            return "test"
            break;
        default:
            return "未知设备"
    }
}

