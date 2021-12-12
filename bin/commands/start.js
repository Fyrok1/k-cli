const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const fetch = require('node-fetch')
const inquirer = require('inquirer');
var AdmZip = require('adm-zip');
const rimraf = require('rimraf');
const child_process = require('child_process');

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
      },
      {
        name:'version',
        constructure:String,
        short:'v',
        description:'project version'
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
      process.global.getVersions(versions=>{
        let version
        if (options['--version'] == undefined) {
          version = versions[0]
        }else{
          version = options['--version']
          if (!versions.includes(version)) {
            throw new Error('incorrect version')
          }
        }
        argv._variables.version = version
        console.log('selected version : '+version);
        if (argv._variables.projectName.search(/(\/|\\)/g) != -1) {
          throw new Error('projectName can not be a path')
        }else if(fs.existsSync(path.join(path.resolve(),argv._variables.projectName))){
          var prompt = inquirer.createPromptModule();
          prompt({
            type:"confirm",
            name:'isClearDirectory',
            message:`already a folder named ${argv._variables.projectName}. do you want to continue`,
            default:false
          }).then((answer)=>{
            if (answer.isClearDirectory) {
              // rimraf.sync(path.join(path.resolve(),argv._variables.projectName))
              next(argv,options)
            }
          })
        }else{
          next(argv,options)
        }
      })
    },
    handler:function(argv,options){
      let version = argv._variables.version;
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
          if (version == "0.0.1") {
            fs.copyFileSync(path.join(unzipPath,'/.env.example'),path.join(unzipPath,'/.env'))
          }else if(version == "0.0.2"){
            fs.copyFileSync(path.join(unzipPath,'/example.env'),path.join(unzipPath,'/development.env'))
            fs.copyFileSync(path.join(unzipPath,'/example.env'),path.join(unzipPath,'/production.env'))
          }
          rimraf.sync(path.join(unzipPath,'/generate'));
          console.log('copying...');
          let projectPath = path.join(path.resolve(),argv._variables.projectName)
          fs.mkdirSync(projectPath)
          fse.copySync(unzipPath,projectPath)
          console.log('node_modules installing...');
          try {
            child_process.spawnSync('npm',['install'],{
              cwd:projectPath,
              stdio: 'inherit',
            })
            console.log('project created to '+projectPath);
          } catch (error) {
            console.log(error);
          }
        });
        res.body.pipe(dest);
      });
    },
    help:function() {
      process.global.commandHelper(this)
    }
  }
}