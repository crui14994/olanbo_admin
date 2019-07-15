export default {
    formatDate: require('./formatDate.js').default,  //日期格式化
    getFilePreview,
}

//传入一个 文件对象参数 获取改文件的预览地址
function getFilePreview(file) {
    return new Promise(function (resolve, reject) {
        if(file){
            let freader = new FileReader();
            freader.readAsDataURL(file);
            freader.onload = function (e) {
                resolve(e.target);
            }
        }else{
            reject(error);
        }
        
    })
}