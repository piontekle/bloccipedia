const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";

const sequelize = require("../../src/db/models/index").sequelize;
const Collaborator = require("../../src/db/models").Collaborator;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : collaborators", () => {
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

  describe("GET /wiki/:wikiId/collaborators/add", () => {
    it("should add a collaborator to wiki", (done) => {
      const options = {
        url: `${base}${this.wiki.id}/collaborators/add`
      };
    })

  })


})
