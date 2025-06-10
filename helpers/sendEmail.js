import nodemailer from "nodemailer";

export default async function sendEmail({ recipient, subject, body }) {
  try {
    const auth = { user: "tech@practe.in", pass: "vxfdhuhyoazfgpys" };
    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: auth,
    });

    // Setup email data
    let mailOptions = {
      from: auth?.user,
      to: recipient,
      subject: subject,
      text: body,
    };

    // Send mail with defined transport object
    let sendEmailResult = await transporter.sendMail(mailOptions);
    console.log({ sendEmailResult });
    return true;
  } catch (err) {
    console.log({ err });
    return false;
  }
}
