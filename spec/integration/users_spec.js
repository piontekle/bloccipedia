const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;


describe("routes : users", () => {

  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  })

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


})
