module.exports = {
  generate:{
    description:'generate controller, model and router',
    usage:'<type> <path>',
    options:{
      '--help':Boolean,
      '-h':'--help'
    },
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
        description:"file path for component. ps: do not add 'controller' or 'modal' end of filename, it will automatically added on creation.",
        examples:[
          'Site',
          'customfolder/Site'
        ]
      }
    },
    builder:function(argv,options){
      return true
    },
    handler:function(argv,options){
      console.log(this);
      
    },
    help:function() {
      process.global.commandHelper(this)
    }
  }
}