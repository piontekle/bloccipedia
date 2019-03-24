const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  edit() {
    return this.new() &&
      this.record && !this._isPrivate();
  }

  update() {
    return this.edit();
  }

}
