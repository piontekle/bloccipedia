const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  edit() {
    if (this.record.private) {
      return this.new() &&
        this.record && (this._isOwner() || this._isCollaborator());
    } else {
      return this.new() && this.record
    }
  }

  update() {
    return this.edit();
  }

}
