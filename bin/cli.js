const arg = require('arg');
const inquirer = require('inquirer');

module.exports = {
  Cli: class{
    constructor(){
      try {
        this.argv = process.argv.slice(2);
        this.argv[0] = this.findCommand()

        this.ready()
      } catch (error) {
        console.log(error);
        // console.log(error.toString());
        console.log("Run 'k-cli help' for information or visit https://github.com/Fyrok1/k-cli")
      }
    }

    argv = [];
    options = {};
    commands=process.global.commands

    ready(){
      let command = this.commands[this.argv[0]];
      let parsedOptions = {}
      if (command.options) {
        command.options.forEach(opt => {
          parsedOptions['--'+opt.name] = opt.constructure
          if (opt.short) {
            parsedOptions['-'+opt.short] = '--'+opt.name
          }
        });
      }
      const options = arg(
        parsedOptions ?? {},
        {argv: this.argv,}
      );
      this.options = options;
      this.argv = this.argv.filter(arg => !(arg.trim().startsWith('-')));
      // if (this.commands[this.argv[0]].description) { console.log(this.commands[this.argv[0]].description+'\n'); }
      
      if (options['--help'] && command.help != undefined) {
        command.help(this.argv,this.options)
      }else{
        if (command.variables) {
          this.argv['_variables'] = process.global.variableBuilder(command,this.argv,this.options)
        }

        if (command.builder != undefined) {
          command.builder(this.argv,this.options,command.handler)
        }else{
          command.handler(this.argv,this.options)
        }
      }
    }

    findCommand(){
      if (this.argv.length == 0 || !this.commands[this.argv[0]]) {
        if (this.argv.length > 0 && !this.commands[this.argv[0]]) {
          let shortCommand = false;
          Object.keys(this.commands).forEach(key=>{
            if (this.commands[key].short && this.argv[0] == this.commands[key].short) {
              shortCommand = true;
              this.argv[0] = key
            }
          })
          if (!shortCommand) {
            throw new Error('unknown command')
          }
        }else{
          this.argv[0] = 'help'
        }
      }
      return this.argv[0];
    }
  },
}