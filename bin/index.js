#! /usr/bin/env node
const { table , getBorderCharacters } = require('table')
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const rimraf = require("rimraf");

const version = require('./commands/version');
const helper = require('./commands/helper');
const generate = require('./commands/generate');
const start = require('./commands/start');

process.global = {
  rootPath:path.join(__dirname,'../'),
  tmpPath:path.join(__dirname,'../tmp'),
  commands:{
    "new":start.new,
    "generate":generate.generate,
    "versions":version.list,
    "version":helper.version,
    "help":helper.help,
  },
  local:false,
  tmpFolders:[],
  table:(tableData=[],options={})=>{
    return table(tableData,{
      ...options,
      ...{
        border: getBorderCharacters(`void`),
        drawHorizontalLine:()=>{return false},
        columnDefault: {
          paddingLeft: 0,
          paddingRight: 2,
        },
        columns: {
          0:{
            alignment:'left'
          },
          1:{
            alignment:'left'
          },
          2:{
            alignment:'left'
          },
        }
      }
    })
  },
  commandHelper:(command)=>{
    if (command.description) {
      console.log(command.description+'\n');
    }

    if (command.usage) {
      console.log('usage : '+command.usage+'\n');
    }

    if (command.variables) {
      let variableTableData = []
      Object.keys(command.variables).forEach(key=>{
        let variable = command.variables[key];
        let detail = ' ';
        if (variable.values) {
          detail = ''
          variable.values.forEach(value => {
            detail += `${value.name} (${value.short}), `
          });
        }else{
          detail = 'bkz : '+variable.examples.join(', ');
        }
        variableTableData.push([
          key??' ',
          variable.description ?? ' ',
          detail??' ',
        ])
      })
      if (variableTableData.length > 0) {
        console.log('variables :\n');
        console.log(process.global.table(variableTableData));
      }
    }

    if (command.options) {
      let optTableData = []
      command.options.forEach(opt=>{
        optTableData.push([
          '--'+opt.name,
          opt.short?'-'+opt.short:' ',
          opt.constructure.name,
          opt.description??' ',
        ])
      })
      if (optTableData.length > 0) {
        console.log('options :\n');
        console.log(process.global.table(optTableData));
      }
    }
    console.log("for more information : https://github.com/Fyrok1/k-cli");
  },
  variableBuilder:(command,argv,options)=>{
    let _variables = {}
    if (command.variables) {
      Object.keys(command.variables).forEach((variableKey,variableIndex)=>{
        let val = argv[variableIndex+1]
        if (command.variables[variableKey].values) {
          let isVal = false
          command.variables[variableKey].values.forEach(value=>{
            if (val == value.name || val == value.short) {
              _variables[variableKey] = value.name
              isVal = true;
            }
          })
          if (!isVal) {
            throw new Error('unexpected '+variableKey+' : '+val)
          }
        }else{
          if (val == undefined) {
            throw new Error(`${variableKey} can't be undefined`)
          }else{
            _variables[variableKey] = val
          }
        }
      })
    }
    return _variables;
  },
  replace:(text,values)=>{
    Object.keys(values).forEach(key=>{
      text=text.replace(new RegExp('\\$'+key+'\\$','g'),values[key])
    })
    return text;
  },
  createTmpFolder:()=>{
    let folder = process.global.randomText(15);
    let dir = path.join(process.global.tmpPath,folder)
    
    if (!fs.existsSync(process.global.tmpPath)) {
      fs.mkdirSync(process.global.tmpPath)
    }
    
    if (!fs.existsSync(dir)){
      process.global.tmpFolders.push(dir);
      fs.mkdirSync(dir);
    }
    return dir;
  },
  clearTmpFolders:()=>{
    if (fs.existsSync(process.global.tmpPath)) {
      process.global.tmpFolders.forEach(dir=>{
        if (fs.existsSync(dir)) {
          rimraf.sync(dir);
        }
      })
    }
  },
  randomText:(length=10)=>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  getVersions:(handler)=>{
    fetch('https://api.github.com/repos/fyrok1/k/branches')
    .then(res=>res.json())
    .then(json=>{
      let v = []
      json.forEach(branch=>{
        if (!isNaN(parseInt(branch.name[0]))) {
          v.push(branch.name)
        }
      })
      handler(v)
    })
  }
}

if (fs.existsSync(process.cwd()+'/k.json')) {
  process.global.local = require(process.cwd()+'/k.json');
}

const cliFile = require('./cli')
const cli = new cliFile.Cli();

process.on('beforeExit', (code) => {
  process.global.clearTmpFolders();
});

process.on('exit', (code) => {
  process.global.clearTmpFolders();
});