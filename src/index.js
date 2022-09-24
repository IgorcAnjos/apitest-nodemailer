require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

const port = process.env.PORT ?? 3000;

// início Configs do NodeMailer

const SMTP_CONFIG = require("./config/smtp");

const transporter = nodemailer.createTransport({
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  tls: true,
  auth: {
    user: SMTP_CONFIG.user,
    pass: SMTP_CONFIG.pass,
  },
});
// Criando a função de enviar email

async function sendEmail(email, assunto, mensagem) {
  const mailSent = transporter.sendMail({
    Text: mensagem,
    subject: assunto,
    from: "Feedback, conta de teste",
    to: [SMTP_CONFIG.user, email],
  });

  console.log(mailSent);
}

// Chamando a função de enviar emai
// sendEmail();

// endpoint: "/"
// method: POST
// body: {email: "test@gmail.com", assunto: "testando aqui", mensagem: "test"}
app.post("/", async (req, res) => {
  const body = req.body;
  const assunto = body.assunto;
  const mensagem = body.mensagem;
  const email = body.email;
  sendEmail(email, assunto, mensagem)
    .then((response) => {
      res.status(201).send("mensagem enviada com sucesso!");
      console.log(response);
    })
    .catch((err) => {
      res.status(500).send(err.message);
      console.log(err);
    });
});

app.listen(port, () => {
  console.info(`Servidor escutando na porta ${port}`);
});
