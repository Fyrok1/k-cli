const inquirer = require('inquirer');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra')
var AdmZip = require('adm-zip');
const rimraf = require('rimraf');


module.exports = {
  list:{
    description:"list of available versions",
    handler:(args,options)=>{
      process.global.getVersions((versions)=>{
        console.log('available versions :\n');
        versions.forEach(version=>{
          console.log(version);
        })
      })
    }
  },
  change:{
    description:"change project version",
    usage:"<version>",
    options:[
      {
        name:'help',
        constructure:Boolean,
        short:'h',
        description:'show command details'
      }
    ],
    variables:{
      version:{
        description:"selected version",
        examples:['0.0.1']
      }
    },
    builder:function(argv,options,next) {
      var prompt = inquirer.createPromptModule();
      prompt({
        type:"confirm",
        name:"sure",
        message:"are you sure about change version. some changes may be lost",
        default:false
      }).then(sure=>{
        if (sure.sure) {
          if (!process.global.local) {
            throw new Error('local project not detected')
          }else{
            process.global.getVersions(versions=>{
              if (!versions.includes(argv._variables.version)) {
                throw new Error('unavailable version')
              }else if(argv._variables.version == process.global.local.version){
                prompt({
                  type:"confirm",
                  name:"confirm",
                  message:"local version equal to selected version. do you want to continue",
                  default:false
                }).then((answer)=>{
                  if (answer.confirm) {
                    next(argv,options)
                  }
                })
              }else{
                next(argv,options)
              }
            })
          }
        }
      })
    },
    handler:function(argv,options) {
      fetch(`https://github.com/Fyrok1/k/archive/refs/heads/${argv._variables.version}.zip`)
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
          let unzipPath = path.join(dir,'unzip/k-'+argv._variables.version);
          rimraf.sync(path.join(unzipPath,'/generate'));
          console.log('copying...');
          let projectPath = path.resolve()

          rimraf.sync(path.join(projectPath,'.env.example'))
          fse.copyFileSync(path.join(unzipPath,'/.env.example'),path.join(projectPath,'/.env.example'));

          rimraf.sync(path.join(projectPath,'/src/k'))
          fse.copySync(path.join(unzipPath,'/src/k'),path.join(projectPath,'/src/k'));

          let unzipJson = require(path.join(unzipPath,'package.json'))
          let projectJson = require(path.join(projectPath,'package.json'))
          
          Object.keys(unzipJson.dependencies).forEach(unzipKey=>{
            projectJson.dependencies[unzipKey] = unzipJson.dependencies[unzipKey]
          })

          Object.keys(unzipJson.scripts).forEach(unzipKey=>{
            projectJson.scripts[unzipKey] = unzipJson.scripts[unzipKey]
          })
          
          Object.keys(unzipJson['devDependencies']).forEach(unzipKey=>{
            projectJson['devDependencies'][unzipKey] = unzipJson['devDependencies'][unzipKey]
          })

          rimraf.sync(path.join(projectPath,'package.json'))
          fs.writeFileSync(path.join(projectPath,'package.json'),JSON.stringify(projectJson,null,2))

          let kJson = require(path.join(projectPath,'k.json'))
          kJson.version = argv._variables.version;
          rimraf.sync(path.join(projectPath,'k.json'))
          fs.writeFileSync(path.join(projectPath,'k.json'),JSON.stringify(kJson,null,2))

          console.log('version changed to '+argv._variables.version);
          console.log(`do not forget 'npm i' before starting and check .env.example file for changes`);
        });
        res.body.pipe(dest);
      });
    },
    help:function() {
      process.global.commandHelper(this)
    }
  }
}