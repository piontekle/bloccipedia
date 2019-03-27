const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getUser(id, callback) {
    let result = {};
    User.findByPk(id)
    .then((user) => {
      if(!user){
        callback(404);
      } else {
        result["user"] = user;

        Wiki.scope({method: ["lastFiveFor", id]}).findAll()
        .then((wikis) => {
          result["wikis"] = wikis;

          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        })
      }
    });
  },
  updateUserRole(id, newRole, callback){
    return User.findByPk(id)
    .then((user) => {
      if(!user) {
        return callback("User not found.");
      }
      return user.update({role: newRole})
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      });
    });
  }
}
