import utils from "@/utils/index"; //导入工具函数

/**
 * 日期过滤器
 * @param {number} time
 */
export function timeFormat(time) {
    return utils.formatDate("YYYY-mm-dd hh:ff:ss", new Date(time));
}