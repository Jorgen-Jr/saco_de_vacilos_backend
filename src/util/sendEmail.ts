import { transporter } from "./../config/email";

export const sendEmail = (
  from: string,
  to: string,
  subject: string,
  content: string
) => {
  const mailOptions = {
    from,
    to,
    subject,
    html: content,
  };

  transporter.sendMail(mailOptions, (err: any) => {
    if (!err) {
      return {
        errors: [
          {
            field: "email",
            message:
              "Não foi possível enviar o email para recuperar sua senha, tente novamente mais tarde ou contate o administrador.",
          },
        ],
      };
    }

    return true;
  });
};
