const arg = require('arg');
const inquirer = require('inquirer');

const version = require('./commands/version');
const create = require('./commands/create');

module.exports = {
  Cli: class{
    constructor(){
      this.argv = process.argv.slice(2);
      
      if (this.argv.length == 0 && !this.commands[this.argv[0]]) {
        this.help()
      }else{
        const options = arg(
          this.commands[this.argv[0]].options,
          {
            argv: this.argv,
          }
        );
        this.options = options;
        if (this.commands[this.argv[0]].description) { console.log(this.commands[this.argv[0]].description); }
        console.log('');
        this.commands[this.argv[0]].handler(this.argv,this.options);
      }
    }

    argv = [];
    options = {};

    commands={
      "versions":version.list
    }

    help(){
      console.log("Help");
    }
  }
}