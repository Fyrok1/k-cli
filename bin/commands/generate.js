const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

module.exports = {
  generate:{
    short:"g",
    description:'generate controller, model and router',
    usage:'<type> <path>',
    options:[
      {
        name:'help',
        constructure:Boolean,
        short:'h',
        description:'show command details'
      }
    ],
    variables:{
      type:{
        description:'component type',
        values:[
          {
            name:"controller",
            short:"c"
          },
          {
            name:"model",
            short:"m"
          },
          {
            name:"router",
            short:"r"
          },
        ]
      },
      path:{
        description:"file path for component.\nps: do not add 'controller' or 'modal' end of filename, it will automatically added on creation.",
        examples:[
          'Site',
          'customfolder/Site'
        ]
      }
    },
    builder:function(argv,options,next){
      if (process.global.local) {
        next(argv,options)
      }else{
        throw new Error('local project not detected')
      }
    },
    handler:function(argv,options){
      fetch(`https://raw.githubusercontent.com/Fyrok1/k/${process.global.local.version}/generate/${argv._variables.type}`)
        .then(res=>res.text())
        .then(raw=>{
          let filename = path.basename(argv._variables.path)
          let content = process.global.replace(raw,{
            capitalizeName:filename.replace(/\b\w/g, l => l.toUpperCase()),
            name:filename
          })
          let filepath = ''
          filename = filename
          switch (argv._variables.type) {
            case 'controller':
              filepath = path.join('./src/controllers/',path.dirname(argv._variables.path),filename+'.controller.ts')
              break;
            case 'router':
              filepath = path.join('./src/web/routers/',path.dirname(argv._variables.path),filename+'.router.ts')
              break;
            case 'model':
              filepath = path.join('./src/models/',path.dirname(argv._variables.path),filename+'.model.ts')
              break;
          }
          if (filepath != '') {
            fse.outputFile(filepath,content)
            console.log(argv._variables.type+' created');
          }
        })
    },
    help:function() {
      process.global.commandHelper(this)
    }
  }
}