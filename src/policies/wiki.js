const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  edit() {
    return this.new() &&
      this.record && (!this._isPrivate() || this._isOwner());
  }

  update() {
    return this.edit();
  }

}
