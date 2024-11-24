import pool from "../dbconfig/database-setup.js";
import bcrypt from "bcrypt";
import { VerifyToken, GenerateToken } from "../services/json-web-token.js";
const saltRounds = 10;

export const signIn = async (request, response) => {
  try {
    const { username, password } = request.body;
    const findUsername = await pool.query(
      "SELECT * FROM public.authentication WHERE username = $1 ",
      [username]
    );
    if (findUsername.rowCount === 0) {
      return response.status(400).json({
        message: "User Not Found",
      });
    }
    const user = findUsername.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).json({
        message: "Password Invalid",
      });
    }

    const token = GenerateToken({
      id: user.id,
    });

    return response.status(200).json({
      message: "Sucess Login",
      login: true,
      token: token,
      type: user.type,
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

    const findUser = await pool.query(
      "SELECT * FROM public.authentication WHERE username = $1 OR emailaddress = $2",
      [username, emailaddress]
    );

    if (findUser.rows.length > 0) {
      return response.status(400).json({
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);

    const createUser = await pool.query(
      "INSERT INTO public.authentication (username, emailaddress, password, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, emailaddress, passwordHash, type]
    );

    return response.status(201).json({
      message: "User created successfully",
      user: createUser.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
