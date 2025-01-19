import pool from "../dbconfig/database-setup.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import SendEmail from "../services/nodemailer.js";
const saltRounds = 10;

const fromEmail = process.env.EMAIL;
function generateRandomSixDigits() {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit number
  return randomNumber;
}

export const signIn = async (request, response) => {
  try {
    const { emailaddress, password } = request.body;

    // Input validation
    if (!emailaddress || !password) {
      return response
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const findEmail = await pool.query(
      "SELECT * FROM public.authentication WHERE emailaddress = $1",
      [emailaddress]
    );

    if (findEmail.rowCount === 0) {
      return response.status(400).json({ message: "Email address not found." });
    }

    const userAccount = findEmail.rows[0];

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      password,
      userAccount.password
    );
    if (!isPasswordValid) {
      return response.status(400).json({ message: "Invalid password." });
    }

    // Check if account is verified
    if (!userAccount.is_verified) {
      const verificationLink = `https://barangay-bonbon.onrender.com/verify/${userAccount.id}`;

      const mailOptions = {
        from: fromEmail,
        to: emailaddress,
        subject: "Verify Account",
        text: `Hi,\n\nThank you for signing up. Please verify your account using the link below:\n\n${verificationLink}\n\nIf you did not sign up, please ignore this email.\n\nBest regards,\nBarangay BonBon`,
        html: `<p>Hi,</p><p>Thank you for signing up. Please verify your account using the link below:</p><p><a href="${verificationLink}" target="_blank" style="color: blue;">Verify Account</a></p><p>If you did not sign up, please ignore this email.</p><p>Best regards,<br>Barangay BonBon</p>`,
      };

      const emailSent = await SendEmail(mailOptions);

      if (!emailSent) {
        return response.status(400).json({
          message: "Failed to send verification email. Please try again later.",
        });
      }

      return response.status(200).json({
        message: "Verification email sent. Please check your email.",
      });
    }

    // Generate OTP
    const randomOTP = generateRandomSixDigits();

    const otpMailOptions = {
      from: fromEmail,
      to: emailaddress,
      subject: "Your OTP",
      text: `Your OTP is: ${randomOTP}`,
      html: `<p>Your OTP is: <strong>${randomOTP}</strong></p>`,
    };

    const otpEmailSent = await SendEmail(otpMailOptions);

    if (!otpEmailSent) {
      return response.status(400).json({
        message: "Failed to send OTP. Please try again later.",
      });
    }

    await pool.query(
      "UPDATE public.authentication SET token = $1, expired = $2 WHERE id = $3",
      [randomOTP, false, userAccount.id]
    );

    return response.status(200).json({
      message: "OTP sent successfully to your email.",
      otpverification: true,
      email: emailaddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const signUp = async (request, response) => {
  try {
    const { username, emailaddress, password, type } = request.body;

    // Input validation
    if (!username || !emailaddress || !password || !type) {
      return response.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const findUser = await pool.query(
      "SELECT * FROM public.authentication WHERE emailaddress = $1",
      [emailaddress]
    );

    if (findUser.rows.length > 0) {
      return response
        .status(400)
        .json({ message: "Email address already exists" });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const createUser = await pool.query(
      "INSERT INTO public.authentication (username, emailaddress, password, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, emailaddress, passwordHash, type]
    );

    const userAccount = createUser.rows[0];
    const verificationLink = `https://barangay-bonbon.onrender.com/verify/${userAccount.id}`;

    const mailOptions = {
      from: fromEmail,
      to: emailaddress,
      subject: "Verify Account",
      text: `Hi,\n\nThank you for signing up. Please verify your account using the link below:\n\n${verificationLink}\n\nIf you did not sign up, please ignore this email.\n\nBest regards,\nBarangay BonBon`,
      html: `
        <p>Hi,</p>
        <p>Thank you for signing up. Please verify your account using the link below:</p>
        <p><a href="${verificationLink}" target="_blank" style="color: blue;">Verify Account</a></p>
        <p>If you did not sign up, please ignore this email.</p>
        <p>Best regards,<br>Barangay BonBon</p>
      `,
    };

    const emailSent = await SendEmail(mailOptions);

    if (!emailSent) {
      return response
        .status(500)
        .json({ message: "Failed to send verification email" });
    }

    return response
      .status(200)
      .json({ message: "Check your email to verify your account" });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateUser = async (request, response) => {
  try {
    const hash = await bcrypt.genSalt(saltRounds);
    const { id } = request.params;

    const { password, username, emailaddress } = request.body;
    const passwordHast = await bcrypt.hash(password, hash);

    const updateResult = await pool.query(
      `UPDATE public.authentication 
       SET password = $1, username = $2, emailaddress = $3  
       WHERE id = $4 
       RETURNING *;`,
      [passwordHast, username, emailaddress, id]
    );
    if (updateResult.rowCount === 0) {
      return response.status(400).json({
        message: "Password Did not Change",
      });
    }

    return response.status(200).json({
      message: "Password Change",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getByUserid = async (request, response) => {
  try {
    const { id } = request.params;
    const getUserById = await pool.query(
      "SELECT * FROM public.authentication WHERE id = $1",
      [id]
    );

    if (getUserById.rowCount === 0) {
      return response.status(400).json({
        message: "User not Found",
      });
    }

    return response.status(200).json({
      user: getUserById.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const verifyUser = async (request, response) => {
  try {
    const { id } = request.params;

    const verifyUser = await pool.query(
      `UPDATE public.authentication 
         SET is_verified = $1 WHERE id = $2 
         RETURNING *`,
      [true, id]
    );
    if (verifyUser.rows.length === 0) {
      return response.status(404).json({ message: "User Account not found" });
    }

    return response.status(200).json({
      message: "User Account Verified",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const verifyOtp = async (request, response) => {
  try {
    const { emailaddress, otp } = request.body;
    const findAccount = await pool.query(
      "SELECT * FROM public.authentication WHERE emailaddress = $1",
      [emailaddress]
    );

    if (findAccount.rowCount === 0) {
      return response.status(404).json({ message: "Email address not found." });
    }

    const userAccount = findAccount.rows[0];

    if (userAccount.expired === true) {
      return response.status(400).json({ message: "OTP has expired." });
    }
    if (Number(otp) !== Number(userAccount.token)) {
      return response.status(400).json({ message: "Invalid OTP." });
    }

    if (userAccount.is_verified === false) {
      const verificationLink = `https://barangay-bonbon.onrender.com/verify/${userAccount.id}`;

      const mailOptions = {
        from: fromEmail,
        to: emailaddress,
        subject: "Verify Account",
        text: `Hi,\n\nThank you for signing up. Please verify your account using the link below:\n\n${verificationLink}\n\nIf you did not sign up, please ignore this email.\n\nBest regards,\nBarangay BonBon`,
        html: `<p>Hi,</p><p>Thank you for signing up. Please verify your account using the link below:</p><p><a href="${verificationLink}" target="_blank" style="color: blue;">Verify Account</a></p><p>If you did not sign up, please ignore this email.</p><p>Best regards,<br>Barangay BonBon</p>`,
      };

      const emailSent = await SendEmail(mailOptions);

      if (!emailSent) {
        return response.status(500).json({
          message: "Failed to send verification email. Please try again later.",
        });
      }

      return response.status(200).json({
        message: "Verification email sent. Please check your email.",
      });
    }

    // Mark OTP as used
    await pool.query(
      "UPDATE public.authentication SET expired = $1 WHERE id = $2",
      [true, userAccount.id]
    );

    // Success response
    return response.status(200).json({
      message: "Login Sucess",
      email: userAccount.emailaddress,
      type: userAccount.type,
      id: userAccount.id,
      username: userAccount.username,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getEmailAndgetOtp = async (request, response) => {
  try {
    const { emailaddress } = request.body;

    // Check if emailaddress is provided
    if (!emailaddress) {
      return response
        .status(400)
        .json({ message: "Email address is required." });
    }

    // Find the user account in the database
    const findAccount = await pool.query(
      "SELECT * FROM public.authentication WHERE emailaddress = $1",
      [emailaddress]
    );

    if (findAccount.rowCount === 0) {
      return response.status(400).json({ message: "Email address not found." });
    }

    const userAccount = findAccount.rows[0];

    const verificationLink = `https://barangay-bonbon.onrender.com/resetpassword/${userAccount.id}`;

    const mailOptions = {
      from: fromEmail,
      to: emailaddress,
      subject: "Password Reset Request",
      text: `Hi,\n\nWe received a request to reset your password. Please click the link below to reset your password:\n\n${verificationLink}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nBarangay BonBon`,
      html: `<p>Hi,</p><p>We received a request to reset your password. Please click the link below to reset your password:</p><p><a href="${verificationLink}" target="_blank" style="color: blue;">Reset Password</a></p><p>If you did not request a password reset, please ignore this email.</p><p>Best regards,<br>Barangay BonBon</p>`,
    };

    // Send email with password reset link
    const emailSent = await SendEmail(mailOptions);

    // Check if email was successfully sent
    if (!emailSent) {
      return response.status(500).json({
        message: "Failed to send password reset email. Please try again later.",
      });
    }

    return response.status(200).json({
      message:
        "A password reset link has been sent to your email address. Please check your inbox (and spam folder) to reset your password.",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};
export const resetPassword = async (request, response) => {
  try {
    const hash = await bcrypt.genSalt(saltRounds);
    const { id } = request.params;
    const { password } = request.body;
    const passwordHast = await bcrypt.hash(password, hash);

    const updateResult = await pool.query(
      `UPDATE public.authentication 
       SET password = $1 
       WHERE id = $2
       RETURNING *;`,
      [passwordHast, id]
    );
    if (updateResult.rowCount === 0) {
      return response.status(400).json({
        message: "Password Did not Change",
      });
    }

    return response.status(200).json({
      message: "Password Change",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
