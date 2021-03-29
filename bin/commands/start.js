const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const fetch = require('node-fetch')
const inquirer = require('inquirer');
var AdmZip = require('adm-zip');
const rimraf = require('rimraf');

module.exports = {
  new:{
    usage:'<projectName>',
    description:'',
    options:[
      {
        name:'help',
        constructure:Boolean,
        short:'h',
        description:'show command details'
      }
    ],
    variables:{
      projectName:{
        description:"folder and project name for new project.\ncan not be a path",
        examples:[
          'hello-world'
        ]
      }
    },
    builder:function(argv,options,next){
      if (argv._variables.projectName.search(/(\/|\\)/g) != -1) {
        throw new Error('projectName can not be a path')
      }else if(fs.existsSync(path.join(path.resolve(),argv._variables.projectName))){
        var prompt = inquirer.createPromptModule();
        prompt({
          type:"confirm",
          name:'isClearDirectory',
          message:`already a folder named ${argv._variables.projectName}. clear directory and continue`,
          default:false
        }).then((answer)=>{
          if (answer.isClearDirectory) {
            rimraf.sync(path.join(path.resolve(),argv._variables.projectName))
            next(argv,options)
          }
        })
        // throw new Error('folder already exist')
      }else{
        next(argv,options)
      }
    },
    handler:function(argv,options){
      process.global.getVersions(versions=>{
        var prompt = inquirer.createPromptModule();
        prompt({
          type:'list',
          name:"version",
          message:"select version",
          choices:versions
        }).then((answer)=>{
          let version = answer["version"]
          fetch(`https://github.com/Fyrok1/k/archive/refs/heads/${version}.zip`)
          .then(res => {
            let dir = process.global.createTmpFolder();
            console.log('downloading...');
            let zipPath = path.join(dir,'repo.zip');
            const dest = fs.createWriteStream(zipPath);
            dest.on('close', function() {
              console.log('unzipping...');
              var zip = new AdmZip(zipPath);
              zip.extractAllTo(path.join(dir,'unzip/'),true);
              console.log('preparing...');
              rimraf.sync(zipPath)
              let unzipPath = path.join(dir,'unzip/k-'+version);
              fs.copyFileSync(path.join(unzipPath,'/.env.example'),path.join(unzipPath,'/.env'))
              rimraf.sync(path.join(unzipPath,'/generate'));
              console.log('copying...');
              let projectPath = path.join(path.resolve(),argv._variables.projectName)
              fs.mkdirSync(projectPath)
              fse.copySync(unzipPath,projectPath)
              console.log('project created to '+projectPath);
              console.log(`do not forget '$ npm i' before starting`);
            });
            res.body.pipe(dest);
          });
        });
      })
    },
    help:function() {
      process.global.commandHelper(this)
    }
  }
}