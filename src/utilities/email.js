const sgMail = require("@sendgrid/mail");

module.exports = function(username, email) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: `${email}`,
    from: { email: "piontekle@gmail.com", name: "Bloccipedia"},
    subject: "Welcome to Bloccipedia!",
    text: `Hello, ${username}! Thanks for signing up for Bloccipedia. Your account is ready for you to explore!`,
    html: `<a href:"https://piontekle-bloccipedia.herokuapp.com/">Head to Bloccipedia</a>`
  };
  sgMail.send(msg);
}
