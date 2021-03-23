
module.exports = {
  generate:{
    options:{
      '--website': Boolean,
      '--yes': Boolean,
      '-w': '--website',
      '-y': '--yes',
    },
    handler:(args)=>{
      console.log(args);
    }
  }
}