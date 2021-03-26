#! /usr/bin/env node
const { table , getBorderCharacters } = require('table')
const fs = require('fs');

const version = require('./commands/version');
const helper = require('./commands/helper');
const generate = require('./commands/generate');

process.global = {
  commands:{
    "generate":generate.generate,
    "versions":version.list,
    "version":helper.version,
    "help":helper.help,
  },
  local:false,
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
    console.log(command);
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
          detail??' ',
          variable.description ?? ' ',
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
          _variables[variableKey] = val
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
  }
}

if (fs.existsSync(process.cwd()+'/k.json')) {
  process.global.local = require(process.cwd()+'/k.json');
}

const cliFile = require('./cli')
const cli = new cliFile.Cli();