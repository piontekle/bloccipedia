const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        name: "FirstName",
        email: "user@example.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "How to binge LOTR Extended Versions",
          body: "1) You need a variety of snacks.",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        });
      });
    });
  });

  describe("#create()", () => {
    it("should return a wiki object with a title, a description, and associated user", (done) => {
      Wiki.create({
        title: "Ways to cook bacon",
        body: "Baking is the only way.",
        private: false,
        userId: this.user.id
      })
      .then((topic) => {
        expect(topic.title).toBe("Ways to cook bacon");
        expect(topic.body).toBe("Baking is the only way.");
        expect(topic.private).toBe(false);
        expect(topic.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a post with a missing title, body, or assigned user", (done) => {
      Wiki.create({
        title: "Ways to cook bacon"
      })
      .then((wiki) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Wiki.body cannot be null");
        expect(err.message).toContain("Wiki.userId cannot be null");
        done();
      });
    });
  });

  describe("#setUser()", () => {
    it("should associate a wiki and a user together", (done) => {
      User.create({
        name: "FirstName",
        email: "user@users.com",
        password: "password"
      })
      .then((newUser) => {
        expect(this.wiki.userId).toBe(this.user.id);

        this.wiki.setUser(newUser)
        .then((wiki) => {
          expect(this.wiki.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });

  describe("#getUser()", () => {
    it("should return the associated wiki", () => {
      this.wiki.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("user@example.com");
        done();
      });
    });
  });


});
