const arg = require('arg');
const inquirer = require('inquirer');

module.exports = {
  Cli: class{
    constructor(){
      this.argv = process.argv.slice(2);
      if (this.argv.length == 0 || !this.commands[this.argv[0]]) {
        if (this.argv.length > 0 && !this.commands[this.argv[0]]) {
          console.log('unknown command\n');
        }
        this.argv[0] = 'help'
      }

      this.ready().then(()=>{}).catch((err)=>{console.log(err)})
    }

    argv = [];
    options = {};

    commands=process.global.commands

    async ready(){
      try {
        let command = this.commands[this.argv[0]];
        const options = arg(
          this.commands[this.argv[0]].options ?? {},
          {
            argv: this.argv,
          }
        );
        this.options = options;
        this.argv = this.argv.filter(arg => !(arg.trim().startsWith('-')));
        // if (this.commands[this.argv[0]].description) { console.log(this.commands[this.argv[0]].description+'\n'); }
        if (options['--help'] && command.help != undefined) {
          command.help(this.argv,this.options)
        }else if (command.builder == undefined || await command.builder()) {
          command.handler(this.argv,this.options);
        }
      } catch (error) {
        console.log(error.toString());
        console.log("Run 'k-cli help' for information or visit https://github.com/Fyrok1/k-cli")
      }
    }
  },
}