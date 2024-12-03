import pool from "../dbconfig/database-setup.js";

export const createLocation = async (request, response) => {
  try {
    const { name, latitude, longitude, color } = request.body;

    const createLocation = await pool.query(
      "INSERT INTO public.locations (name, latitude, longitude, color) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, latitude, longitude, color]
    );

    if (createLocation.rows.length === 0) {
      return response.status(400).json({ message: "Error creating location" });
    }

    return response.status(201).json({
      message: "Location created successfully",
      location: createLocation.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getAllLocations = async (request, response) => {
  try {
    const result = await pool.query("SELECT * FROM public.locations");

    return response.status(200).json(result.rows);
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateLocation = async (request, response) => {
  try {
    const { id } = request.params;
    const { name, latitude, longitude, color } = request.body;

    const result = await pool.query(
      `UPDATE public.locations 
         SET name = $1, latitude = $2, longitude = $3, color = $4
         WHERE id = $5 
         RETURNING *`,
      [name, latitude, longitude, color, id]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({ message: "Location not found" });
    }

    return response.status(200).json({
      message: "Location updated successfully",
      location: result.rows[0],
    });
  } catch (error) {
    return response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteLocation = async (request, response) => {
  try {
    const { id } = request.params;
    const result = await pool.query(
      `DELETE FROM public.locations WHERE id = $1 RETURNING *`,
      [id]
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
