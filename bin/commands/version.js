const fetch = require('node-fetch')

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
  }
}