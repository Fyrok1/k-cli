const fetch = require('node-fetch')

module.exports = {
  list:{
    description:"list of available versions",
    handler:(args,options)=>{
      fetch('https://api.github.com/repos/fyrok1/k/branches')
        .then(res=>res.json())
        .then(json=>{
          console.log('available versions :\n');
          json.forEach(branch=>{
            if (!isNaN(parseInt(branch.name[0]))) {
              console.log(branch.name);
            }
          })
        })
    }
  }
}