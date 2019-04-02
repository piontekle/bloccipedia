const request = require("request");
const sequelize = require("../../src/db/models/index").sequelize;
const server = require("../../src/server");
const base = "http://localhost:3000/wiki/";
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes: wiki", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then(() => {
      User.create({
        name: "Lauren",
        email: "standard@example.com",
        password: "123456",
        role: 0
      })
      .then((user) => {
        this.user = user;

        Wiki.create({
          title: "How to binge watch LOTR Extended Versions",
          body: "1) You need a variety of snacks.",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

  describe("member performing CRUD actions for Wiki", () => {
    beforeEach((done) => {
      request.get({
        url: "http://localhost:3000/auth/fake",
        form: {
          role: 0,
          userId: this.user.id
        }
      }, (err, res, body) => {
        done();
      });
    });

    describe("GET /wiki", () => {
      it("should return all wikis", (done) => {
        request.get(base, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Wikis");
          expect(body).toContain("How to binge watch LOTR Extended Versions");
          done();
        });
      });
    });

    describe("GET /wiki/new", () => {
      it("should render a new wiki form", (done) => {
        request.get(`${base}new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });


    describe("POST /wiki/create", () => {
      it("should create a new wiki and redirect", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Bacon making",
            body: "Pre-heat oven to 375"
          }
        };

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Bacon making"}})
          .then((wiki) => {
            expect(wiki.title).toBe("Bacon making");
            expect(wiki.body).toBe("Pre-heat oven to 375");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      it("should not create a new wiki that fails validations", (done) => {
        const options = {
          url: `${base}create`,
          form: {
            title: "Bah",
            body: "Pre"
          }
        };

        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Bah"}})
          .then((wiki) => {
            expect(wiki).toBeNull();
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

    });

    describe("GET /wiki/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("How to binge watch LOTR Extended Versions");
          done();
        });
      });
    });

    describe("POST /wiki/:id/destroy", () => {
      it("should delete the wiki with the associated ID", (done) => {

        Wiki.findAll()
        .then((wikis) => {
          const wikiCountBeforeDelete = wikis.length;
          expect(wikiCountBeforeDelete).toBe(1);

          request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll()
            .then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /wiki/:id/edit", () => {
      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Public Wiki");
          expect(body).toContain("How to binge watch LOTR Extended Versions");
          done();
        });
      });
    });


    describe("POST /wiki/:id/update", () => {
      it("should update the wiki with the given values", (done) => {
        const options = {
          url: `${base}${this.wiki.id}/update`,
          form: {
            title: "How to binge watch LOTR Extended Versions",
            body: "1) Don't eat too much"
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          Wiki.findOne({where: {id: this.wiki.id}})
          .then((wiki) => {
            expect(wiki.title).toBe("How to binge watch LOTR Extended Versions");
            expect(wiki.body).toBe("1) Don't eat too much");
            done();
          });
        });
      });
    });

  }) //End STANDARD member scope


})
