module.exports = class ApplicationPolicy {
  constructor(user, record, collaborator) {
    this.user = user;
    this.record = record;
    this.collaborator = collaborator;
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

  _isCollaborator() {
    return this.collaborator.userId == this.user.id;
  }

  new() {
    return !!this.user;
  }

  create() {
    return this.new();
  }

  privateIndex() {
    return this._isOwner() || this._isCollaborator()
  }

  show() {
    return !this._isPrivate() || this._isAdmin() || this._isOwner() || this._isCollaborator();
  }

  edit() {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this._isAdmin() || this._isOwner();
  }

  upgrade() {
    return true;
  }

  editCollaborator() {
    return this._isPremium() || this._isCollaborator();
  }
}
