import Vue from "vue";
import {orderStateList} from './constant/order'
import {countryList} from './constant/country'
import XLSX from 'xlsx';
// ----------------------
// js 深拷贝
// ----------------------
const deepCopy = (obj) => {
    if(obj instanceof Array) {
        return [...obj.map(i => deepCopy(i))]
    }
    let newobj = {};
    if(typeof obj !== 'object'){
        return obj;
    }
    if(obj instanceof Date){
        return new Date(obj.getTime());
    }
    for(let i in obj){
        newobj[i] = typeof obj[i] === 'object' ?
        deepCopy(obj[i]) : obj[i];
    }
    return newobj
}

// ----------------------
// 图片上传
// ----------------------
const amazonUpload = async (url, file, opts) => {
    let contentType = 'image/jpeg';
    if (opts && opts.contentType) {contentType = opts.contentType;}
    // ----------------------  大于100k,先压缩  ---------------------
    if (file.size > 100 * 1024) file = await fileResizetoFile(file,0.8)
    // let formdata = new FormData();
    // formdata.append('file',file);
    return new Promise((resolve, reject) => {
        // ------------------------------------------------------------ 
        // 使用原生ajax上传到亚马逊s3服务器
        // ------------------------------------------------------------ 
        const request = new XMLHttpRequest()
        , uploadMaxTime = 20000
        request.open('PUT', url, true);
        request.setRequestHeader('Content-Type', contentType)
        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                resolve({
                    success: true
                });

            } else {
                reject({success: false})
            }
        };
        request.send(file);
        setTimeout(() => {
            resolve({timeOut: true})
        }, uploadMaxTime);
    })
};

/**
 * [获取图片宽高]
 * @param          [file 图片文件]
 * @return         [list [width,height]]
 */
const getImgWidthHeight = (file) => {
    return new Promise((resolve,reject) => {
        let reader = new FileReader();
        reader.onload = function(evt){
            // 创建image对象
            let image = new Image();
            image.src = evt.target.result;
            // 获取图片宽高
            image.onload = function(){
                resolve([this.width,this.height])
            }
        };
        reader.readAsDataURL(file);
    })
}
// ----------------------
// 图片压缩
// ----------------------
const fileResizetoFile = (file,quality) => {
    return new Promise((resolve,reject) => {
        let filetoDataURL = (file,fn) =>{
            let reader = new FileReader();
            reader.onloadend = function(e){
                fn(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        , dataURLtoImage = (dataurl,fn) => {
            let img = new Image();
            img.onload = function() {
                fn(img);
            };
            img.src = dataurl;
        }
        , canvasResizetoFile = (canvas,quality) => {
            canvas.toBlob(function(blob) {
                resolve(blob)
            },'image/jpeg',quality);
        }
        , imagetoCanvas = (image) => {
            let cvs = document.createElement("canvas")
            , ctx = cvs.getContext('2d');
            cvs.width = image.width;
            cvs.height = image.height;
            ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
            return cvs ;
        }

        filetoDataURL (file,function(dataurl){
            dataURLtoImage(dataurl,function(image){
                canvasResizetoFile(imagetoCanvas(image),quality);
            })
        })
    })
}

const getImageDimensions = (file) => {
    return new Promise((resolve,reject) => {
        let filetoDataURL = (file,fn) =>{
            let reader = new FileReader();
            reader.onloadend = function(e){
                fn(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        , dataURLtoImage = (dataurl,fn) => {
            let img = new Image();
            img.onload = function() {
                fn(img);
            };
            img.src = dataurl;
        }
        filetoDataURL (file,function(dataurl){
            dataURLtoImage(dataurl,function(image){
                resolve({
                    width: image.width,
                    height: image.height
                })
            })
        })
    })
}

function goBack() {
    this.router && this.router.go(-1)
}

function objectToFormData(obj, config, formData, prefix){
    if(obj instanceof FormData){
        prefix = formData;
        formData = config;
        config = null;
    }
    config = config || {};
    config.indices = config.indices || false;
    config.allowDots = config.allowDots || true;
    formData = formData || new FormData();
    if(typeof obj === 'undefined'){
        return formData;
    }else if( obj === null){
        formData.append(prefix, '');
    }else if (Array.isArray(obj)){
        if(obj.length === 0){
            let key = prefix + '[]';
            formData.append(key, '');
        }else{
            obj.forEach(function(value, index){
                let key = prefix + '['+ (config.indices?index : '') + ']';

                objectToFormData(value, config, formData, key);
            })
        }
    } else if ( typeof obj === 'object' && !(obj instanceof File) && !(obj instanceof Blob)){
        Object.keys(obj).forEach(function(prop){
            let value = obj[prop];
            if(Array.isArray(value)){
                while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
                    prop = prop.substring(0, prop.length - 2)
                }
            }

            let key = prop;
            if(config.allowDots){
                key = prefix ? (prefix + '.' + prop ) : prop
            }else{
                key = prefix ? (prefix + '[' + prop + ']') : prop
            }

            objectToFormData(value, config, formData, key);
        })
    }else{
        formData.append(prefix, obj);
    }

    return formData;
}

 
// ----------------------  时间精度调整，type : 时，分，秒  ---------------------
function preciseTime({time,type}) {
    let formatMap = {
    'h': 'yyyy-MM-dd/hh',
    'm': 'yyyy-MM-dd/hh:mm',
    's': 'yyyy-MM-dd/hh:mm:ss'
    }
    
    let timeOld = Vue.options.filters.formatDate(time,formatMap[type])
    return new Date(timeOld).getTime()
}

function exporExcel({data, type = 'xlsx', fileName:FileName}) {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate file and send to client */
    XLSX.writeFile(wb, `${FileName}.${type}`);
}

function s2ab(s) { //字符串转字符流
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}
    // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
    let temCol = '',
    s = '',
    m = 0
    while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
    }
    return s
}


export default ({app}) => {
    // ----------------------  工具函数对象  ---------------------
    const utils = {
        install(Vue,option) {
            Vue.prototype.deepCopy = deepCopy
            Vue.prototype.amazonUpload = amazonUpload
            Vue.prototype.orderStateList = orderStateList
            Vue.prototype.countryList = countryList
            Vue.prototype.fileResizetoFile = fileResizetoFile
            Vue.prototype.getImgWidthHeight = getImgWidthHeight
            Vue.prototype.getImageDimensions = getImageDimensions
            Vue.prototype.goBack = goBack.bind(app)
            Vue.prototype.objectToFormData = objectToFormData;
            Vue.prototype.preciseTime = preciseTime
            Vue.prototype.exporExcel = exporExcel
        }
    }
    Vue.use(utils)
}