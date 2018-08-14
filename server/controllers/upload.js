import config from '../config'
const formidable = require('koa-formidable'); // 图片处理
const fs = require('fs'); // 图片路径
const path = require('path'); // 图片路径

function mkdirs (dirname) {
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdirs(path.dirname(dirname))){
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
// ----------------------  报错了  ---------------------
// let mkdirs = (dirname, )=> {
//     fs.exists(dirname, function(exists) {
//         if (exists) {
//         } else {
//             mkdirs(path.dirname(dirname), function() {
//                 fs.mkdir(dirname);
//             });
//         }
//     });
// };

// ----------------------
// 上传图片
// ----------------------
export const postImg = async(ctx,next) => {
  console.log('start post')
  try{
    let form = formidable.parse(ctx.request)
    , uploadDir = 'public/upload/'
    form.encoding = 'utf-8';
    form.keepExtensions = true; //保留后缀
    mkdirs('public/upload');
    console.log('after mkdir')
    let imgPlay = new Promise((resolve, reject) => {
      form((opt, {fields, files})=> {
        let filename = files.file.name;
        let avatarName = Date.now() + '_' + filename;
        let readStream = fs.createReadStream(files.file.path)
        let writeStream = fs.createWriteStream(uploadDir + avatarName);
        readStream.pipe(writeStream);
        resolve({
          url: ctx.protocol + '://' + ctx.host + '/' + uploadDir + avatarName
        })
      })
    });
    let imageData = await imgPlay;
    ctx.body = {success: true,msg:'',data: imageData} // 路径返回给前端
  } catch (e) {
    console.log(e,e.message)
    ctx.body = {
      success: false,
      err: e
    }
  }
}