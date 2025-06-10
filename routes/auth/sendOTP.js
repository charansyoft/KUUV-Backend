import axios from "axios";
// import twilio from 'twilio';

// export default async function sendOTPThroughTwillio(phoneNumber, otp) {
//   try {
//       const accountSid = process.env.TWILIO_ACCOUNT_SID;
//       const authToken = process.env.TWILIO_AUTH_TOKEN;
//       const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

//       // Initialize Twilio client
//       const client = twilio(accountSid, authToken);

//       // Send OTP via Twilio
//       const message = await client.messages.create({
//         body: `Your Ziff verification code is: ${otp}. It will expire in 5 minutes. Do not share this code with anyone.`,
//         from: twilioPhoneNumber,
//         to: phoneNumber
//       });
//       console.log("OTP sent successfully, SID:", message.sid);
//       return true

//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       return false
//   }
// }


export default async function sendOTPThroughMsg91(phone, otp, name) {
  try {
    const MSG91_SMS_API_KEY = process.env.MSG91_SMS_API_KEY;
    const MSG91_SMS_TEMPLATE_ID = process.env.MSG91_SMS_TEMPLATE_ID;
    const headers = {
      "accept": "application/json",
      "authkey": MSG91_SMS_API_KEY,
      "content-type": "application/json",
    };

    const data = {
      template_id: MSG91_SMS_TEMPLATE_ID,
      short_url: "1",
      realTimeResponse: "1",
      recipients: [
        {
          mobiles: phone,
          name: name,
          otp: otp,
        },
      ],
    };

    const response = await axios.post("https://control.msg91.com/api/v5/flow", data, { headers });

    console.log("msg91 SMS response:", response.data);

    return response.status === 200;
  } catch (err) {
    console.error("sendOTP via MSG91 error:", err.message);
    return false;
  }
}
