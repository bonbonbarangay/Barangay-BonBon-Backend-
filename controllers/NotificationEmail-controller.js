import pool from "../dbconfig/database-setup.js";
import SendEmail from "../services/nodemailer.js";
import "dotenv/config";
const fromEmail = process.env.EMAIL;

export const notificationForUser = async (request, response) => {
  try {
    const { userid, status } = request.body;

    const findEmail = await pool.query(
      "SELECT * FROM public.authentication WHERE id = $1",
      [userid]
    );

    if (findEmail.rowCount == 0) {
      return response.status(400).json({
        message: "Email Not Found.",
      });
    }
    const mailOptions = {
      from: fromEmail,
      to: findEmail.rows[0].emailaddress,
      subject: "RESIDENT FORM STATUS",
      text: `Your ResidentForm Status is ${status}`,
    };

    const emailSent = await SendEmail(mailOptions);

    if (!emailSent) {
      return response.status(400).json({
        message: "Failed to send verification email. Please try again later.",
      });
    }

    return response.status(200).json({
      message: "Sucess Send Email",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
