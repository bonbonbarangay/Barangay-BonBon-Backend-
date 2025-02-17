import pool from "../dbconfig/database-setup.js";

export const createLocation = async (request, response) => {
  try {
    const {
      projecttitle,
      projectlocation,
      contractor,
      contractpayment,
      updatestatus,
      datemonitoring,
      issues,
      projectengineer,
      datestart,
      overall,
      color,
      budgetyear,
      latitude,
      longitude,
      percentage,
    } = request.body;

    const createLocation = await pool.query(
      "INSERT INTO public.locations (projecttitle, projectlocation, contractor, contractpayment, updatestatus, datemonitoring, issues, projectengineer, datestart, overall, color, budgetyear, latitude, longitude, percentage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
      [
        projecttitle,
        projectlocation,
        contractor,
        contractpayment,
        updatestatus,
        datemonitoring,
        issues,
        projectengineer,
        datestart,
        overall,
        color,
        budgetyear,
        latitude,
        longitude,
        percentage,
      ]
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
    const {
      projecttitle,
      projectlocation,
      contractor,
      contractpayment,
      updatestatus,
      datemonitoring,
      issues,
      projectengineer,
      datestart,
      overall,
      color,
      budgetyear,
      percentage,
    } = request.body;

    const { id } = request.params;

    const updateLocation = await pool.query(
      "UPDATE public.locations SET projecttitle = $1, projectlocation = $2, contractor = $3, contractpayment = $4, updatestatus = $5, datemonitoring = $6, issues = $7, projectengineer = $8, datestart = $9, overall = $10, color = $11, budgetyear = $12, percentage = $13 WHERE id = $14 RETURNING *",
      [
        projecttitle,
        projectlocation,
        contractor,
        contractpayment,
        updatestatus,
        datemonitoring,
        issues,
        projectengineer,
        datestart,
        overall,
        color,
        budgetyear,
        percentage,
        id,
      ]
    );

    if (updateLocation.rows.length === 0) {
      return response.status(404).json({ message: "Location not found" });
    }

    return response.status(200).json({
      message: "Location updated successfully",
      location: updateLocation.rows[0],
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

export const updateLocationDrag = async (request, response) => {
  try {
    const { id } = request.params;
    const { latitude, longitude } = request.body;

    const result = await pool.query(
      `UPDATE public.locations 
         SET latitude = $1, longitude = $2 WHERE id = $3 
         RETURNING *`,
      [latitude, longitude, id]
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
