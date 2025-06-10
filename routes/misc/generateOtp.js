import otpModel from "../../models/otpModel.js";

export default async function generateOtp({ userId }) {
  try {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }

    const otp = new otpModel({
      user: userId,
      otp: code,
    });

    const createOtpResult = await otp.save();
    console.log({ createOtpResult });

    return code;
  } catch (err) {
    console.log({ err });
    return null;
  }
}
