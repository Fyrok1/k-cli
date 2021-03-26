const pjson = require('../../package.json');

module.exports = {
  help:{
    description:"information about k-cli",
    handler:(argv,options)=>{
      let tableData = []; 
      Object.keys(process.global.commands).forEach(command=>{
        let options = ' '
        if (process.global.commands[command].options) {
          options = '';
          process.global.commands[command].options.forEach(opt=>{
            options += '--'+opt.name+' ';
            if (opt.short) {
              options += '-'+opt.short+' ';
            }
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
      console.log(
      'k-cli: '+pjson.version+'\n'+
      'local: '+ (process.global.local ? process.global.local.version : 'not detected'));
    }
  }
}