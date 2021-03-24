const pjson = require('../../package.json');
const fs = require('fs')
const cli = require('../cli')

function getLocalConfig(){
  let configPath = process.cwd()+'/k.json'
  if (fs.existsSync(configPath)) {
    let configJson = require(configPath);
    return configJson.version ?? 'something went wrong'
  }else{
    return 'Not Detected'
  }
}

module.exports = {
  help:{
    description:"K-cli help",
    handler:(argv,options)=>{
      // let msg = 
      // 'Commands\n'+
      // '\n'
      // Object.keys(cli.commands).forEach(command=>{
      //   msg += `${commands}`  $+ '\n'
      // })
      console.table([{name:1},{name:2}])
      // console.log(msg);
    },
  },
  version:{
    handler:()=>{
      let msg = 
      'Versions\n'+
      '\n'+
      'K-Cli: '+pjson.version+'\n'+
      'Local: '+ (getLocalConfig())

      console.log(msg.trim());
    }
  },
  getLocalConfig
}