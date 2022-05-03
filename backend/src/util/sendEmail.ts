require("dotenv").config();
const sgMail = require("@sendgrid/mail");

export default function sendEmail(link: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    // TODO change to variable before deploy
    to: "marc.haussmann@gmail.com",
    from: process.env.EMAIL_FROM,
    subject: "Réinilisation de votre mot de passe",
    text: `Voici le lien pour la réinitialisation de votre mot de passe de votre compte du réseau social GROUPOMANIA : ${link}`
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch(console.log("nope"));
}
