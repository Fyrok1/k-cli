const arg = require('arg');
const inquirer = require('inquirer');

module.exports = {
  Cli: class{
    constructor(){
      this.argv = process.argv.slice(2);
      if (this.argv.length == 0 || !this.commands[this.argv[0]]) {
        this.argv[0] = 'help'
      }

      const options = arg(
        this.commands[this.argv[0]].options ?? {},
        {
          argv: this.argv,
        }
      );
      this.options = options;
      // if (this.commands[this.argv[0]].description) { console.log(this.commands[this.argv[0]].description+'\n'); }
      this.commands[this.argv[0]].handler(this.argv,this.options);
    }

    argv = [];
    options = {};

    commands=process.global.commands
  },
}