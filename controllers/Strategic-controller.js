import pool from "../dbconfig/database-setup.js";

export const createStrategic = async (request, response) => {
  try {
    const { color, polylinedata } = request.body;

    if (!color || !Array.isArray(polylinedata) || polylinedata.length === 0) {
      return response.status(400).json({ message: "Invalid input data" });
    }

    const createPolylineData = await pool.query(
      "INSERT INTO polylines (color, polylinedata) VALUES ($1, $2) RETURNING *",
      [color, polylinedata]
    );

    if (createPolylineData.rowCount === 0) {
      return response
        .status(400)
        .json({ message: "Error creating polyline data" });
    }

    return response.status(201).json({
      message: "Created successfully",
      event: createPolylineData.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllStrategic = async (request, response) => {
  try {
    const getAllPolylineData = await pool.query(
      "SELECT * FROM public.polylines"
    );

    return response.status(200).json(getAllPolylineData.rows);
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deletePolyLineById = async (request, response) => {
  try {
    const { id } = request.params;

    const deleteResult = await pool.query(
      "DELETE FROM public.polylines WHERE id = $1",
      [id]
    );

    if (deleteResult.rowCount === 0) {
      return response.status(404).json({
        message: "Polyline not found or already deleted.",
      });
    }

    return response.status(200).json({
      message: "Polyline deleted successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
