import pool from "../dbconfig/database-setup.js";
export const createFormStatus = async (request, response) => {
  try {
    const { userid, status } = request.body;

    const findUserExist = await pool.query(
      "SELECT * FROM public.formstatus WHERE userid = $1",
      [userid]
    );

    if (findUserExist.rowCount > 0) {
      return response.status(400).json({ message: "userexist" });
    }
    const createFormstatus = await pool.query(
      "INSERT INTO public.formstatus (userid, status) VALUES ($1, $2) RETURNING *",
      [userid, status]
    );

    if (!createFormstatus) {
      return response.status(400).json({ message: "error create" });
    }
    return response.status(201).json({
      message: "formStatus created successfully",
      event: createFormstatus.rows[0],
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
    const { userid } = request.params;

    const getUserId = await pool.query(
      "SELECT * FROM public.formstatus WHERE userid = $1",
      [userid]
    );
    return response.status(201).json(getUserId.rows[0]);
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateUserForm = async (request, response) => {
  try {
    const { userid } = request.params;
    const { status } = request.body;
    const result = await pool.query(
      `UPDATE public.formstatus 
           SET status = $1 WHERE userid = $2 
           RETURNING *`,
      [status, userid]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        message: "FormStatus not found",
      });
    }

    return response.status(200).json({
      success: true,
      message: "FormStatus updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteFormStatus = async (request, response) => {
  try {
    const { userid } = request.params;
    const result = await pool.query(
      `DELETE FROM public.formstatus WHERE userid = $1 RETURNING *`,
      [userid]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ message: "Location not found" });
    }

    return response.status(200).json({
      message: "Location deleted successfully",
      location: result.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
