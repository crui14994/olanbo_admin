import utils from "@/utils/index"; //导入工具函数

/**
 * 日期过滤器
 * @param {number} time
 */
export function timeFormat(time) {
    return utils.formatDate("YYYY-mm-dd hh:ff:ss", new Date(time));
}

/**
 * 如果为空数据则返回 “暂无数据”
 * @param {number} time
 */
export function nullData(data) {
    return data ? data : "暂无数据"
}

/** 
 * 设备类型
 * @param {number} typeId
 **/
// export function gettType(typeId) {
//     switch (typeId) {
//         case 1:
//             return "网关系列"
//             break;
//         case 2:
//             return "开关系列"
//             break;
//         case 3:
//             return "灯光系列"
//             break;
//         case 4:
//             return "test"
//             break;
//         default:
//             return "未知设备"
//     }
// }


/** 
 * 案列类型
 * @param {number} typeId
 **/
// export function exampleType(typeId) {
//     switch (typeId) {
//         case 1:
//             return "测试分类A"
//             break;
//         case 2:
//             return "测试分类B"
//             break;
//         default:
//             return "未知分类"
//     }
// }