const path = require('path')
const fs = require('fs')

// ------------------------------------------------------------
// 生成中文翻译
// ------------------------------------------------------------
const generateZh = () => {
  let readPath = path.resolve(__dirname,'../','locales','in.json')
  fs.readFile(readPath,function(err,data){
    copyAndWrite(data.toString())
  })
}

const copyAndWrite = (json) => {
  copyToZh(JSON.parse(json))
  .then(data => {
    writeJson(data)
  })
}

const copyToZh = (json) => {
  return new Promise((resolve,reject) => {
    const newJson = recursionCopy(json)
    resolve(newJson)
  })
}

const recursionCopy = (obj) => {
  let newobj = {};
  if(typeof obj !== 'object'){
      return obj;
  }
  for(let i in obj){
      newobj[i] = typeof obj[i] === 'object' ?
      recursionCopy(obj[i]) : i;
  }
  return newobj
}

const writeJson = (json) => {
  fs.writeFile(path.resolve(__dirname,'../','locales','zh.json'),JSON.stringify(json),function(err,data){
    if (err) {
        console.log(err.message);
        throw err;
    } else {
        console.log(`create zh.json file success!`);
    }
  })
}

// ----------------------  启动  ---------------------
generateZh()