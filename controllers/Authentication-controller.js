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

    return response.status(200).json({
      id: user.id,
      user: user.username,
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
