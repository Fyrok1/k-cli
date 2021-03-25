const pjson = require('../../package.json');
const fs = require('fs')
const { table , getBorderCharacters } = require('table')

function getLocalConfig(){
  let configPath = process.cwd()+'/k.json'
  if (fs.existsSync(configPath)) {
    let configJson = require(configPath);
    return configJson.version ?? 'something went wrong'
  }else{
    return 'not Detected'
  }
}

module.exports = {
  help:{
    description:"information about k-cli",
    handler:(argv,options)=>{
      console.log('commands :\n');
      let tableData = []; 
      Object.keys(process.global.commands).forEach(command=>{
        let options = ' '
        if (process.global.commands[command].options) {
          options = '';
          Object.keys(process.global.commands[command].options).forEach(optKey=>{
            options += optKey+' ';
          })
        }

        tableData.push([
          command,
          process.global.commands[command].usage??' ',
          options.length == 0 ? ' ' : options,
          process.global.commands[command].description??' ',
        ])
      })
      console.log(process.global.table(tableData));
      console.log("for more information : https://github.com/Fyrok1/k-cli");
    },
  },
  version:{
    description:"k-cli version",
    handler:()=>{
      console.log('versions\n'+
      '\n'+
      'k-cli: '+pjson.version+'\n'+
      'local: '+ (getLocalConfig()));
    }
  },
  getLocalConfig
}