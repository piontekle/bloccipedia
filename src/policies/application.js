module.exports = class ApplicationPolicy {
  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == 2;
  }

  _isPremium() {
    return this.user && this.user.role == 1;
  }

  _isPrivate() {
    return this.record.private;
  }

  new() {
    return !!this.user;
  }

  create() {
    return this.new();
  }

  show() {
    return !this._isPrivate() || this._isAdmin() || this._isOwner();
  }

  edit() {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this._isAdmin();
  }

  upgrade() {
    return true;
  }
}
