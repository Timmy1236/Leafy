class Data {
  constructor() {
    this.arrayBot = [];
    this.arrayDiscord = [];
    this.arraySlash = [];
  }
  pushToBot(value) {
    this.arrayBot.push("`" + value + "`");
  }
  pushToDiscord(value) {
    this.arrayDiscord.push("`" + value + "`");
  }
  pushToSlash(value) {
    this.arraySlash.push("`" + value + "`");
  }

  totalCommands() {
    return this.arrayBot.length + this.arrayDiscord.length;
  }
}
const data = new Data();
module.exports = data;