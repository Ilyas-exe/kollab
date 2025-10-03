// Fichier: /server/utils/sendEmail.js
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // 1. Créer un "transporter" (le service qui envoie l'email)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Ton adresse email depuis .env
      pass: process.env.EMAIL_PASS, // Ton mot de passe d'application depuis .env
    },
  });

  // 2. Définir les options de l'email (destinataire, sujet, contenu, etc.)
  const mailOptions = {
    from: `Kollab <${process.env.EMAIL_USER}>`, // Expéditeur
    to: options.email, // Destinataire
    subject: options.subject, // Sujet
    html: options.message, // Contenu en HTML
  };

  // 3. Envoyer l'email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;