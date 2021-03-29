const inquirer = require('inquirer');

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
      if (!process.global.local) {
        throw new Error('local project not detected')
      }else{
        process.global.getVersions(versions=>{
          if (!versions.includes(argv._variables.version)) {
            throw new Error('unavailable version')
          }else if(argv._variables.version == process.global.local.version){
            var prompt = inquirer.createPromptModule();
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
    },
    handler:function(argv,options) {
      // fetch(`https://github.com/Fyrok1/k/archive/refs/heads/${argv._variables.version}.zip`)
      // .then(res => {
      //   let dir = process.global.createTmpFolder();
      //   console.log('downloading...');
      //   let zipPath = path.join(dir,'repo.zip');
      //   const dest = fs.createWriteStream(zipPath);
      //   dest.on('close', function() {
      //     console.log('unzipping...');
      //     var zip = new AdmZip(zipPath);
      //     zip.extractAllTo(path.join(dir,'unzip/'),true);
      //     console.log('preparing...');
      //     rimraf.sync(zipPath)
      //     let unzipPath = path.join(dir,'unzip/k-'+argv._variables.version);
      //     fs.copyFileSync(path.join(unzipPath,'/.env.example'),path.join(unzipPath,'/.env'))
      //     rimraf.sync(path.join(unzipPath,'/generate'));
      //     console.log('copying...');
      //     let projectPath = path.join(path.resolve(),argv._variables.projectName)
      //     fs.mkdirSync(projectPath)
      //     fse.copySync(unzipPath,projectPath)
      //     console.log('project created to '+projectPath);
      //     console.log(`do not forget '$ npm i' before starting`);
      //   });
      //   res.body.pipe(dest);
      // });
    },
    help:function() {
      process.global.commandHelper(this)
    }
  }
}