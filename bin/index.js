#! /usr/bin/env node
const { table , getBorderCharacters } = require('table')

const version = require('./commands/version');
const helper = require('./commands/helper');
const create = require('./commands/create');

process.global = {
  commands:{
    "versions":version.list,
    "version":helper.version,
    "help":helper.help,
  },
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
  }
}

const cliFile = require('./cli')
const cli = new cliFile.Cli();