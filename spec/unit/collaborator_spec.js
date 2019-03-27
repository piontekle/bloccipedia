const sequelize = require("../../src/db/models/index").sequelize;
const Collaborator = require("../../src/db/models").Collaborator;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Collaborator", () => {
  beforeEach((done) => {
    this.collab;
    this.user;
    this.wiki;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        name: "Lauren",
        email: "user@email.com",
        password: "123456"
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          id: 1,
          title: "How to Test",
          body: "This is how you test",
          private: true,
          userId: this.user.id,
          collaborators: [{
            userId: this.user.id,
            wikiId: 1
          }]
        }, {
          include: {
            model: Collaborator,
            as: "collaborators"
          }
        })
        .then((wiki) => {
          this.wiki = wiki;
          this.collab = wiki.collaborators[0];
          done();
        })
      });
    });

  });

  describe("#create()", () => {
    it("should create a Collaborator object with valid email", (done) => {
      Collaborator.create({
        userId: this.user.id,
        wikiId: this.wiki.id
      })
      .then((user) => {
        expect(user.wikiId).toBe(this.wiki.id);
        expect(user.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("#setWiki()", () => {
    it("should associate a wiki and collaborator together", (done) => {
      Wiki.create({
        id: 2,
        title: "Collab Adder",
        body: "This has to be private",
        private: true,
        userId: this.user.id
      })
      .then((newWiki) => {
        expect(this.collab.wikiId).toBe(this.wiki.id);

        this.collab.setWiki(newWiki)
        .then((collaborator) => {
          expect(collaborator.wikiId).toBe(newWiki.id);
          done();
        });
      })
    });
  });

  describe("#getWiki()", () => {
    it("should return the associated wiki", (done) => {
      this.collab.getWiki()
      .then((associatedWiki) => {
        expect(associatedWiki.title).toBe("How to Test");
        done();
      });
    });
  });

  describe("#setUser()", () => {
    it("should associate a post and a user together", (done) => {
      User.create({
        name: "El",
        email: "el@email.com",
        password: "123456"
      })
      .then((newUser) => {
        expect(this.collab.userId).toBe(this.user.id);

        this.collab.setUser(newUser)
        .then((collaborator) => {
          expect(this.collab.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });

  describe("#getUser()", () => {
    it("should return the associated User", (done) => {
      this.collab.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("user@email.com");
        done();
      });
    });
  });

})
