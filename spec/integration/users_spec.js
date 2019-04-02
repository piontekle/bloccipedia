const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : users", () => {

  beforeEach((done) => {
    this.user;

    sequelize.sync({force: true})
    .then(() => {
      User.create({
        name: "Lauren",
        email: "user@example.com",
        password: "123456",
        role: 0
      })
      .then((user) => {
        this.user = user;

        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    });
  });

  describe("GET /users/sign_up", () => {
    it("should render a view with a sign-up form", (done) => {
      request.get(`${base}sign_up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign Up");
        done();
      });
    });
  });

  describe("POST /users", () => {
    it("should create a new user with valid values and redirect", (done) => {
      const options = {
        url: base,
        form: {
          name: "Lauren",
          email: "user@example.com",
          password: "123456"
        }
      }

      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "user@example.com"}})
        .then((user) => {
          expect(user).not.toBeNull();
          expect(user.id).toBe(1);
          expect(user.name).toBe("Lauren");
          expect(user.email).toBe("user@example.com");
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });

    it("should not create a user that fails to meet criteria and redirect", (done) => {
      const options = {
        url: base,
        form: {
          email: "nah",
          password: "123456"
        }
      }

      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "nah"}})
        .then((user) => {
          expect(user).toBeNull();
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    })

  });

  describe("GET /users/sign_in", () => {
    it("should render a view with a sign-in page", (done) => {
      request.get(`${base}sign_in`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign In");
        done();
      });
    });

  });

  describe("GET /users/:id", () => {
    it("should render a view with the user's profile", (done) => {
      request.get(`${base}${this.user.id}`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain(this.user.name);
        done();
      })
    })
  })

  describe("GET /users/:id/status", () => {
    it("should render a view with the user's profile", (done) => {
      request.get(`${base}${this.user.id}/status`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Account Levels");
        done();
      })
    })
  })

  describe("POST /users/:id/premium", () => {
    it("should upgrade user's role to premium", (done) => {
      const options = {
        url: `${base}${this.user.id}/premium`,
        form: {
          role: 1,
          token: {
            id: 3,
            email: "user@example.com"
          }
        }
      };

      expect(this.user.role).toBe("0");

      request.post(options, (err, res, body) => {
        expect(err).toBeNull();

        User.findOne({where: {id: this.user.id}})
        .then((user) => {
          expect(user.role).toBe("1");
          done();
        })
      })
    });
  });

  describe("POST /users/:id/standard", () => {
    it("should change user's role to standard", (done) => {
      User.create({
        name: "LP",
        email: "standarder@email.com",
        password: "4567890",
        role: 1
      })
      .then((user) => {
        const options = {
          url: `${base}${user.id}/standard`,
          form: {
            role: 0
          }
        }
        request.post(options, (err, res, body) => {
          expect(err).toBeNull();

          User.findOne({where: {email: "standarder@email.com"}})
          .then((user) => {
            expect(user.role).toBe("0");
            done();
          })
        })
      });
    });

  });


})
