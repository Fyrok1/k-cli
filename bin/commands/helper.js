const pjson = require('../../package.json');
const fs = require('fs')
const { table , getBorderCharacters } = require('table')

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
      let tableData = [
        ['Commands','',''],
        ['name','usage','description'],
        ['','','']
      ]; 

      Object.keys(process.global.commands).forEach(command=>{
        tableData.push([
          command,
          'usage',
          'descriptipn'
        ])
      })

      console.log(process.global.table(tableData));
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